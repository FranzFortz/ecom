import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isOrderStatus } from "@/shared/constants/order-status";
import { notifyCustomerOrderStatus } from "@/shared/lib/notifications-server";
import { requireAdminApi } from "@/shared/lib/admin-request";
import {
  createSupabaseServiceClient,
  isSupabaseServiceRoleConfigured,
} from "@/shared/lib/supabase/service";
import type { OrderStatus } from "@/shared/types";

type Body = { status?: unknown };

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  if (!isSupabaseServiceRoleConfigured()) {
    return NextResponse.json(
      { error: "Server missing SUPABASE_SERVICE_ROLE_KEY" },
      { status: 503 }
    );
  }

  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const status =
    typeof body.status === "string" && isOrderStatus(body.status)
      ? body.status
      : null;
  if (!status) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseServiceClient();
    const { data: existing, error: fetchErr } = await supabase
      .from("orders")
      .select("user_id, status")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr || !existing) {
      return NextResponse.json(
        { error: fetchErr?.message ?? "Order not found" },
        { status: fetchErr ? 500 : 404 }
      );
    }

    const prev = existing.status as string;
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const uid = existing.user_id as string | null;
    if (uid && prev !== status) {
      await notifyCustomerOrderStatus({
        userId: uid,
        orderId: id,
        status: status as OrderStatus,
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/account");
    revalidatePath("/account/orders");

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  if (!isSupabaseServiceRoleConfigured()) {
    return NextResponse.json(
      { error: "Server missing SUPABASE_SERVICE_ROLE_KEY" },
      { status: 503 }
    );
  }

  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/account");
    revalidatePath("/account/orders");

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
