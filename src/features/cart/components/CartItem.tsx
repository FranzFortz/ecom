// src/features/cart/components/CartItem.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartItem as CartLine } from "@/features/cart/types";
import { useCart } from "@/features/cart/context/CartContext";
import { Button } from "@/shared/components/ui/Button";
import { formatPrice } from "@/shared/lib/utils";

function variantLabel(v?: CartLine["variant"]): string {
  if (!v) return "";
  const parts = [v.size, v.color].filter(Boolean);
  return parts.length ? ` · ${parts.join(" / ")}` : "";
}

export function CartItemRow({ item }: { item: CartLine }) {
  const { updateQuantity, removeItem } = useCart();
  const sub = item.price * item.quantity;

  return (
    <li className="flex gap-4 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50/50 p-4">
      <Link
        href={`/products/${item.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-100"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div>
          <Link
            href={`/products/${item.slug}`}
            className="font-medium text-stone-900 hover:underline"
          >
            {item.name}
          </Link>
          <p className="text-xs text-stone-500">
            Line item (placeholder UI){variantLabel(item.variant)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              aria-label="Decrease"
              onClick={() =>
                updateQuantity(item.productId, item.quantity - 1, item.variant)
              }
            >
              −
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              aria-label="Increase"
              onClick={() =>
                updateQuantity(item.productId, item.quantity + 1, item.variant)
              }
            >
              +
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-red-600"
            onClick={() => removeItem(item.productId, item.variant)}
          >
            Remove
          </Button>
        </div>
        <p className="text-sm font-semibold text-stone-800">
          {formatPrice(sub)}
        </p>
      </div>
    </li>
  );
}
