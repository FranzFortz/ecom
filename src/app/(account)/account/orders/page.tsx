// src/app/(account)/account/orders/page.tsx
import { redirect } from "next/navigation";
import { AccountOrdersRealtimeRefresh } from "@/features/account/components/AccountOrdersRealtimeRefresh";
import { OrderHistoryTable } from "@/features/account/components/OrderHistoryTable";
import { fetchOrdersForUser } from "@/features/account/hooks/useOrders";
import { getServerSupabaseUser } from "@/shared/lib/supabase/server-user";

export default async function OrdersPage() {
  const user = await getServerSupabaseUser();
  if (!user) {
    redirect("/auth/login?callbackUrl=%2Faccount%2Forders");
  }

  const orders = await fetchOrdersForUser(user.id);

  return (
    <main>
      <AccountOrdersRealtimeRefresh />
      <h1 className="text-2xl font-bold text-stone-900">Order history</h1>
      <p className="mt-1 text-sm text-stone-600">
        Track status and open confirmations.
      </p>
      <div className="mt-8">
        <OrderHistoryTable orders={orders} />
      </div>
    </main>
  );
}
