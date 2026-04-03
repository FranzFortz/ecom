// src/app/(account)/account/orders/page.tsx
import { OrderHistoryTable } from "@/features/account/components/OrderHistoryTable";
import { fetchOrdersForUser } from "@/features/account/hooks/useOrders";
import { auth } from "@/auth";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const orders = await fetchOrdersForUser(session.user.id);

  return (
    <main>
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
