// src/features/account/components/WishlistGrid.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { WishlistLine } from "@/features/account/hooks/useWishlist";
import { useCart } from "@/features/cart/context/CartContext";
import { Button } from "@/shared/components/ui/Button";
import { formatPrice } from "@/shared/lib/utils";

export function WishlistGrid({ lines }: { lines: WishlistLine[] }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [removing, setRemoving] = useState<string | null>(null);

  async function remove(productId: string) {
    setRemoving(productId);
    try {
      await fetch(`/api/wishlist?productId=${encodeURIComponent(productId)}`, {
        method: "DELETE",
      });
      router.refresh();
    } finally {
      setRemoving(null);
    }
  }

  if (lines.length === 0) {
    return (
      <p className="rounded-lg border border-stone-200 bg-stone-50 py-8 text-center text-sm text-stone-600">
        Your wishlist is empty.{" "}
        <Link href="/products" className="text-emerald-800 hover:underline">
          Browse products
        </Link>
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {lines.map((line) => {
        const p = line.product;
        if (!p) return null;
        const img =
          p.images?.[0] ??
          "https://placehold.co/400x300/e2e8f0/64748b?text=Product";
        return (
          <li
            key={line.id}
            className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm"
          >
            <Link href={`/products/${p.slug}`} className="relative aspect-[4/3] bg-stone-100">
              <Image
                src={img}
                alt={p.name}
                fill
                className="object-cover"
                sizes="(max-width:640px) 100vw, 33vw"
              />
            </Link>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <Link
                href={`/products/${p.slug}`}
                className="font-semibold text-stone-900 hover:text-emerald-800"
              >
                {p.name}
              </Link>
              <p className="text-lg font-bold text-emerald-900">
                {formatPrice(p.price)}
              </p>
              <div className="mt-auto flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  className="flex-1"
                  disabled={p.stock < 1}
                  onClick={() =>
                    addItem({
                      productId: p.id,
                      name: p.name,
                      slug: p.slug,
                      image: img,
                      price: p.price,
                      quantity: 1,
                    })
                  }
                >
                  Move to cart
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  isLoading={removing === p.id}
                  onClick={() => remove(p.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
