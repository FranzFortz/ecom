import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { AdminClearOrdersButton } from "@/features/admin/components/AdminClearOrdersButton";
import { AdminOrderDeleteButton } from "@/features/admin/components/AdminOrderDeleteButton";
import { AdminOrderStatusSelect } from "@/features/admin/components/AdminOrderStatusSelect";
import {
  createSupabaseServiceClient,
  isSupabaseServiceRoleConfigured,
} from "@/shared/lib/supabase/service";
import { formatPrice } from "@/shared/lib/utils";
import type { CartItem } from "@/features/cart/types";
import type { ShippingFormValues } from "@/features/checkout/types";
import { PAYMENT_METHOD_LABELS } from "@/features/checkout/types";
import type { OrderRow, PaymentMethod } from "@/shared/types";

type OrderWithProfile = OrderRow & {
  profiles: { email: string | null; full_name: string | null } | null;
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  noStore();

  if (!isSupabaseServiceRoleConfigured()) {
    return (
      <main>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
        <p className="mt-2 text-sm text-amber-800">
          Add <code className="rounded bg-amber-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code> to
          list all customer orders.
        </p>
      </main>
    );
  }

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, user_id, status, total, shipping_info, items, payment_method, created_at, profiles ( email, full_name )"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (data ?? []) as unknown as OrderWithProfile[];

  return (
    <main>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Fulfillment
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Orders</h1>
          <p className="mt-1 text-sm text-slate-600">
            Customer orders (newest first). Test orders: use a non-admin account at checkout.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AdminClearOrdersButton />
          <Link
            href="/"
            className="text-sm font-medium text-emerald-800 hover:underline"
          >
            ← Live site
          </Link>
        </div>
      </div>

      {error ? (
        <p className="mt-6 text-sm text-red-600">{error.message}</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-900 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Placed
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Customer
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Total
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Payment
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Items
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No orders yet. Place a test order from the storefront while signed in as a
                    non-admin customer.
                  </td>
                </tr>
              ) : (
                rows.map((o) => {
                  const ship = o.shipping_info as unknown as ShippingFormValues;
                  const items = Array.isArray(o.items) ? (o.items as CartItem[]) : [];
                  const pm = o.payment_method as PaymentMethod | null;
                  const profile = o.profiles;
                  const label =
                    profile?.full_name?.trim() ||
                    profile?.email ||
                    ship?.email ||
                    (o.user_id ? `User ${o.user_id.slice(0, 8)}…` : "Guest");

                  return (
                    <tr key={o.id} className="border-b border-slate-100 align-top hover:bg-slate-50/80">
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {new Date(o.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{label}</p>
                        {profile?.email ? (
                          <p className="text-xs text-slate-500">{profile.email}</p>
                        ) : null}
                        <p className="font-mono text-[10px] text-slate-400">{o.id}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                        {formatPrice(Number(o.total))}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {pm && pm in PAYMENT_METHOD_LABELS
                          ? PAYMENT_METHOD_LABELS[pm]
                          : o.payment_method ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <AdminOrderStatusSelect orderId={o.id} initialStatus={o.status} />
                      </td>
                      <td className="max-w-[220px] px-4 py-3 text-xs text-slate-600">
                        <ul className="list-inside list-disc">
                          {items.slice(0, 4).map((line) => (
                            <li key={`${line.productId}-${line.slug}`}>
                              {line.name} × {line.quantity}
                            </li>
                          ))}
                          {items.length > 4 ? (
                            <li className="list-none text-slate-400">
                              +{items.length - 4} more
                            </li>
                          ) : null}
                        </ul>
                      </td>
                      <td className="px-4 py-3">
                        <AdminOrderDeleteButton orderId={o.id} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
