// src/features/account/components/DashboardStats.tsx
import { Card } from "@/shared/components/ui/Card";
import { formatPrice } from "@/shared/lib/utils";

export function DashboardStats({
  orderCount,
  wishlistCount,
  memberSince,
  totalSpent,
}: {
  orderCount: number;
  wishlistCount: number;
  memberSince: string;
  totalSpent: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <p className="text-xs font-medium uppercase text-stone-500">
          Total orders
        </p>
        <p className="mt-2 text-2xl font-bold text-stone-900">{orderCount}</p>
      </Card>
      <Card>
        <p className="text-xs font-medium uppercase text-stone-500">
          Wishlist items
        </p>
        <p className="mt-2 text-2xl font-bold text-stone-900">
          {wishlistCount}
        </p>
      </Card>
      <Card>
        <p className="text-xs font-medium uppercase text-stone-500">
          Member since
        </p>
        <p className="mt-2 text-lg font-semibold text-stone-900">
          {new Date(memberSince).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        <p className="mt-3 text-xs text-stone-500">
          Lifetime spend: {formatPrice(totalSpent)}
        </p>
      </Card>
    </div>
  );
}
