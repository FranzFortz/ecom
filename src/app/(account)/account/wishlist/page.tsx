// src/app/(account)/account/wishlist/page.tsx
import { redirect } from "next/navigation";
import { WishlistGrid } from "@/features/account/components/WishlistGrid";
import { fetchWishlistForUser } from "@/features/account/hooks/useWishlist";
import { getServerSupabaseUser } from "@/shared/lib/supabase/server-user";

export default async function WishlistPage() {
  const user = await getServerSupabaseUser();
  if (!user) {
    redirect("/auth/login?callbackUrl=%2Faccount%2Fwishlist");
  }

  const lines = await fetchWishlistForUser(user.id);

  return (
    <main>
      <h1 className="text-2xl font-bold text-stone-900">Wishlist</h1>
      <p className="mt-1 text-sm text-stone-600">
        Saved products — move to cart or remove anytime.
      </p>
      <div className="mt-8">
        <WishlistGrid lines={lines} />
      </div>
    </main>
  );
}
