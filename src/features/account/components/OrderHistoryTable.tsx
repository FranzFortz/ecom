// src/features/account/components/OrderHistoryTable.tsx
import Link from "next/link";
import { DeleteOwnOrderButton } from "@/features/account/components/DeleteOwnOrderButton";
import type { OrderRow } from "@/shared/types";
import { Badge } from "@/shared/components/ui/Badge";
import { formatPrice } from "@/shared/lib/utils";
import type { CartItem } from "@/features/cart/types";

function statusVariant(
  status: string
): "success" | "warning" | "error" | "neutral" {
  if (status === "paid" || status === "delivered") return "success";
  if (status === "shipped" || status === "processing") return "warning";
  if (status === "cancelled") return "error";
  if (status === "pending") return "neutral";
  return "neutral";
}

export function OrderHistoryTable({ orders }: { orders: OrderRow[] }) {
  if (orders.length === 0) {
    return (
      <p className="rounded-lg border border-stone-200 bg-stone-50 py-8 text-center text-sm text-stone-600">
        No orders yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-stone-200 bg-stone-50">
          <tr>
            <th className="px-4 py-3 font-medium text-stone-700">Order</th>
            <th className="px-4 py-3 font-medium text-stone-700">Date</th>
            <th className="px-4 py-3 font-medium text-stone-700">Status</th>
            <th className="px-4 py-3 font-medium text-stone-700">Items</th>
            <th className="px-4 py-3 font-medium text-stone-700">Total</th>
            <th className="px-4 py-3 font-medium text-stone-700"> </th>
            <th className="px-4 py-3 font-medium text-stone-700"> </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const items = Array.isArray(o.items) ? (o.items as CartItem[]) : [];
            return (
              <tr key={o.id} className="border-b border-stone-100">
                <td className="px-4 py-3 font-mono text-xs text-stone-800">
                  {o.id.slice(0, 8)}…
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {new Date(o.created_at).toLocaleDateString("en-PH")}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant(o.status)}>{o.status}</Badge>
                </td>
                <td className="px-4 py-3 text-stone-600">{items.length}</td>
                <td className="px-4 py-3 font-medium text-stone-900">
                  {formatPrice(Number(o.total))}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/checkout/confirmation?order_id=${o.id}`}
                    className="text-emerald-800 hover:underline"
                  >
                    View
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <DeleteOwnOrderButton orderId={o.id} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
