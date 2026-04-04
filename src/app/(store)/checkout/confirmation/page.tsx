// src/app/(store)/checkout/confirmation/page.tsx
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";
import { formatPrice } from "@/shared/lib/utils";
import type { CartItem } from "@/features/cart/types";
import type { ShippingFormValues } from "@/features/checkout/types";
import { PAYMENT_METHOD_LABELS } from "@/features/checkout/types";
import type { OrderRow, PaymentMethod } from "@/shared/types";
import { SITE_NAME } from "@/shared/lib/site";

type SearchParams = { order_id?: string };

export default async function CheckoutConfirmationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const orderId =
    typeof searchParams.order_id === "string" ? searchParams.order_id : null;
  if (!orderId) {
    notFound();
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/auth/login?callbackUrl=${encodeURIComponent(`/checkout/confirmation?order_id=${orderId}`)}`
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const order = data as OrderRow;
  const items = Array.isArray(order.items) ? (order.items as CartItem[]) : [];
  const shipping = order.shipping_info as ShippingFormValues;
  const pm = order.payment_method as PaymentMethod | null;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-8">
        <p className="text-sm font-medium text-emerald-900">Order placed</p>
        <h1 className="mt-2 text-2xl font-bold text-stone-900">
          Thank you, {shipping?.fullName ?? "customer"}!
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Order ID:{" "}
          <span className="font-mono text-stone-800">{order.id}</span>
        </p>
        <p className="mt-4 text-sm text-stone-600">
          Thank you for shopping with {SITE_NAME}. A confirmation email would be
          sent here (UI only for this project).
        </p>
      </div>

      <section className="mt-8 rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold text-stone-900">Order summary</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((line) => (
            <li key={`${line.productId}-${line.slug}`} className="flex justify-between gap-4">
              <span>
                {line.name} × {line.quantity}
              </span>
              <span>{formatPrice(line.price * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-stone-100 pt-4 font-semibold">
          <span>Total</span>
          <span>{formatPrice(Number(order.total))}</span>
        </p>
        <p className="mt-2 text-sm text-stone-600">
          Payment:{" "}
          {pm && pm in PAYMENT_METHOD_LABELS
            ? PAYMENT_METHOD_LABELS[pm as PaymentMethod]
            : order.payment_method ?? "—"}
        </p>
        <p className="mt-1 text-sm text-stone-600">Status: {order.status}</p>
        <p className="mt-4 text-sm text-stone-500">
          Estimated delivery: 5–10 business days (placeholder).
        </p>
      </section>

      <p className="mt-8 flex items-center justify-center gap-2 text-xs text-stone-500">
        <span aria-hidden>🔒</span>
        Secure checkout · Your data is protected
      </p>
    </main>
  );
}
