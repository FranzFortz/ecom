// src/app/(store)/cart/page.tsx
"use client";

import Link from "next/link";
import { CartItemRow } from "@/features/cart/components/CartItem";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { useCart } from "@/features/cart/context/CartContext";

export default function CartPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-16 text-center">
        <div className="mx-auto max-w-md rounded-2xl border-2 border-dashed border-stone-400 bg-stone-50 p-10">
          <p className="text-xs font-semibold uppercase text-stone-500">
            [ Empty cart — placeholder ]
          </p>
          <h1 className="mt-2 text-xl font-bold text-stone-900">
            Your cart is empty
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Add items from the catalog to preview the cart UI.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-700 px-6 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Browse products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 rounded-lg border border-dashed border-stone-300 bg-stone-50 px-3 py-2 text-xs text-stone-600">
        [ Cart page — placeholder summary panel ]
      </div>
      <h1 className="text-2xl font-bold text-stone-900">Shopping cart</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <CartItemRow
              key={`${item.productId}-${item.variant?.size ?? ""}-${item.variant?.color ?? ""}`}
              item={item}
            />
          ))}
        </ul>
        <CartSummary />
      </div>
    </main>
  );
}
