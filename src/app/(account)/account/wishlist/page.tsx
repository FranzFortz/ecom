// src/app/(account)/account/wishlist/page.tsx
import { WishlistGrid } from "@/features/account/components/WishlistGrid";
import { fetchWishlistForUser } from "@/features/account/hooks/useWishlist";
import { auth } from "@/auth";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const lines = await fetchWishlistForUser(session.user.id);

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
