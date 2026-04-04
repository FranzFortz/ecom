// src/app/(account)/account/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { DashboardStats } from "@/features/account/components/DashboardStats";
import { fetchOrdersForUser } from "@/features/account/hooks/useOrders";
import { fetchWishlistForUser } from "@/features/account/hooks/useWishlist";
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";
import { SITE_NAME } from "@/shared/lib/site";

export default async function AccountPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?callbackUrl=%2Faccount");
  }

  const userId = user.id;
  const [orders, wishlist, profile] = await Promise.all([
    fetchOrdersForUser(userId),
    fetchWishlistForUser(userId),
    supabase
      .from("profiles")
      .select("created_at, full_name")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => data as { created_at: string; full_name: string | null } | null),
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
        Your {SITE_NAME} account — orders and wishlist.
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
