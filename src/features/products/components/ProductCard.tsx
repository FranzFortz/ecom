// src/features/products/components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/features/cart/context/CartContext";
import type { Product } from "@/features/products/types";
import { StockBadge } from "@/features/products/components/StockBadge";
import { Button } from "@/shared/components/ui/Button";
import { formatPrice } from "@/shared/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const img = product.images?.[0] ?? "https://placehold.co/600x400/e2e8f0/64748b?text=Product";
  const inStock = product.stock > 0;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-stone-100">
          <Image
            src={img}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${product.slug}`}>
          <h2 className="font-semibold text-stone-900 hover:text-emerald-800">
            {product.name}
          </h2>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold text-emerald-900">
            {formatPrice(product.price)}
          </span>
          {product.compare_price != null && product.compare_price > product.price ? (
            <span className="text-sm text-stone-400 line-through">
              {formatPrice(product.compare_price)}
            </span>
          ) : null}
        </div>
        <StockBadge stock={product.stock} />
        <Button
          type="button"
          className="mt-auto w-full"
          disabled={!inStock}
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              slug: product.slug,
              image: img,
              price: product.price,
              quantity: 1,
            })
          }
        >
          Add to cart
        </Button>
      </div>
    </article>
  );
}
