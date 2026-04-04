// src/shared/lib/notifications-server.ts
import { formatPrice } from "@/shared/lib/utils";
import {
  createSupabaseServiceClient,
  isSupabaseServiceRoleConfigured,
} from "@/shared/lib/supabase/service";
import type { OrderStatus } from "@/shared/constants/order-status";
import { ORDER_STATUS_LABEL } from "@/shared/constants/order-status";

/** Best-effort; never throws — checkout must succeed even if notify fails. */
export async function notifyAfterOrderPlaced(input: {
  userId: string;
  orderId: string;
  total: number;
}): Promise<void> {
  if (!isSupabaseServiceRoleConfigured()) return;
  try {
    const supabase = createSupabaseServiceClient();
    const totalLabel = formatPrice(input.total);
    await supabase.from("notifications").insert({
      user_id: input.userId,
      kind: "order_placed",
      title: "Order placed",
      body: `We received your order for ${totalLabel}.`,
      payload: { orderId: input.orderId },
    });
    await supabase.from("admin_notifications").insert({
      kind: "customer_order",
      title: "New customer order",
      body: `${totalLabel} · ${input.orderId.slice(0, 8)}…`,
      payload: { orderId: input.orderId, userId: input.userId },
    });
  } catch {
    /* table missing or misconfigured */
  }
}

export async function notifyCustomerOrderStatus(input: {
  userId: string;
  orderId: string;
  status: OrderStatus;
}): Promise<void> {
  if (!isSupabaseServiceRoleConfigured()) return;
  try {
    const supabase = createSupabaseServiceClient();
    const label = ORDER_STATUS_LABEL[input.status];
    await supabase.from("notifications").insert({
      user_id: input.userId,
      kind: "order_status",
      title: "Order status updated",
      body: `Your order is now: ${label}.`,
      payload: { orderId: input.orderId, status: input.status },
    });
  } catch {
    /* ignore */
  }
}
