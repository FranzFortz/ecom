// src/features/checkout/components/OrderSummary.tsx
"use client";

import Image from "next/image";
import { useCart } from "@/features/cart/context/CartContext";
import { formatPrice } from "@/shared/lib/utils";

function variantNote(v?: { size?: string; color?: string }) {
  if (!v?.size && !v?.color) return null;
  return [v.size, v.color].filter(Boolean).join(" · ");
}

export function OrderSummary() {
  const { items, subtotal } = useCart();
  const shipping = 0;

  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 p-6">
      <h2 className="text-lg font-semibold text-stone-900">Your order</h2>
      <ul className="mt-4 max-h-72 space-y-4 overflow-y-auto">
        {items.map((line) => (
          <li key={`${line.productId}-${line.variant?.size}-${line.variant?.color}`} className="flex gap-3 text-sm">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-stone-200">
              <Image
                src={line.image}
                alt={line.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-stone-900">{line.name}</p>
              {variantNote(line.variant) ? (
                <p className="text-xs text-stone-500">{variantNote(line.variant)}</p>
              ) : null}
              <p className="text-stone-600">
                {line.quantity} × {formatPrice(line.price)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 space-y-1 border-t border-stone-200 pt-4 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(subtotal + shipping)}</span>
        </div>
      </div>
    </div>
  );
}
