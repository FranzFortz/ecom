// src/app/api/orders/route.ts
// Mock checkout: persists payment_method only; no payment gateway.
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminEmail } from "@/shared/lib/admin";
import { notifyAfterOrderPlaced } from "@/shared/lib/notifications-server";
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";
import type { PaymentMethod } from "@/shared/types";
import type { CartItem } from "@/features/cart/types";
import type { ShippingFormValues } from "@/features/checkout/types";

const METHODS: PaymentMethod[] = ["gcash", "cash", "card"];

function isPaymentMethod(x: unknown): x is PaymentMethod {
  return typeof x === "string" && (METHODS as string[]).includes(x);
}

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.email && isAdminEmail(user.email)) {
    return NextResponse.json(
      { error: "Admins cannot place storefront orders. Use the control center." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const paymentMethod = b.paymentMethod;
  const shipping = b.shipping as ShippingFormValues | undefined;
  const items = b.items as CartItem[] | undefined;
  const total = b.total;

  if (!isPaymentMethod(paymentMethod)) {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (typeof total !== "number" || total < 0 || !Number.isFinite(total)) {
    return NextResponse.json({ error: "Invalid total" }, { status: 400 });
  }
  if (
    !shipping ||
    typeof shipping.fullName !== "string" ||
    typeof shipping.email !== "string" ||
    typeof shipping.phone !== "string" ||
    typeof shipping.street !== "string" ||
    typeof shipping.city !== "string" ||
    typeof shipping.province !== "string" ||
    typeof shipping.zip !== "string"
  ) {
    return NextResponse.json({ error: "Invalid shipping" }, { status: 400 });
  }

  const computed = items.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0
  );
  if (Math.abs(computed - total) > 0.02) {
    return NextResponse.json({ error: "Total mismatch" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      total,
      shipping_info: shipping as unknown as Record<string, unknown>,
      items: items as unknown as Record<string, unknown>,
      payment_method: paymentMethod,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const orderId = data.id as string;
  await notifyAfterOrderPlaced({
    userId: user.id,
    orderId,
    total,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/account/orders");

  return NextResponse.json({ orderId });
}
