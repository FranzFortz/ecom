// src/app/(account)/account/page.tsx
import Link from "next/link";
import { DashboardStats } from "@/features/account/components/DashboardStats";
import { fetchOrdersForUser } from "@/features/account/hooks/useOrders";
import { fetchWishlistForUser } from "@/features/account/hooks/useWishlist";
import { auth } from "@/auth";
import { createSupabaseServiceClient } from "@/shared/lib/supabase/service";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;
  const [orders, wishlist, profile] = await Promise.all([
    fetchOrdersForUser(userId),
    fetchWishlistForUser(userId),
    (async () => {
      try {
        const supabase = createSupabaseServiceClient();
        const { data } = await supabase
          .from("profiles")
          .select("created_at, full_name")
          .eq("id", userId)
          .maybeSingle();
        return data as { created_at: string; full_name: string | null } | null;
      } catch {
        return null;
      }
    })(),
  ]);

  const totalSpent = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + Number(o.total), 0);

  const memberSince = profile?.created_at ?? new Date().toISOString();

  return (
    <main>
      <h1 className="text-2xl font-bold text-stone-900">
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
      </h1>
      <p className="mt-1 text-sm text-stone-600">
        Manage your orders and wishlist.
      </p>
      <div className="mt-8">
        <DashboardStats
          orderCount={orders.length}
          wishlistCount={wishlist.length}
          memberSince={memberSince}
          totalSpent={totalSpent}
        />
      </div>
      <nav className="mt-10 flex flex-wrap gap-4 text-sm font-medium">
        <Link href="/account/orders" className="text-emerald-800 hover:underline">
          View order history →
        </Link>
        <Link href="/account/wishlist" className="text-emerald-800 hover:underline">
          View wishlist →
        </Link>
      </nav>
    </main>
  );
}
