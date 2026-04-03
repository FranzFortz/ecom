// src/app/(account)/layout.tsx
import Link from "next/link";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-8 flex flex-wrap gap-4 border-b border-stone-200 pb-4 text-sm">
        <Link
          href="/account"
          className="font-medium text-stone-700 hover:text-emerald-800"
        >
          Dashboard
        </Link>
        <Link
          href="/account/orders"
          className="font-medium text-stone-700 hover:text-emerald-800"
        >
          Orders
        </Link>
        <Link
          href="/account/wishlist"
          className="font-medium text-stone-700 hover:text-emerald-800"
        >
          Wishlist
        </Link>
        <Link
          href="/account/settings"
          className="font-medium text-stone-700 hover:text-emerald-800"
        >
          Settings
        </Link>
        <Link
          href="/products"
          className="font-medium text-stone-500 hover:text-emerald-800"
        >
          Continue shopping
        </Link>
      </nav>
      {children}
    </div>
  );
}
