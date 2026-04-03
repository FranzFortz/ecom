// src/features/checkout/hooks/useCheckout.ts
"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useCart } from "@/features/cart/context/CartContext";
import type { PaymentMethod } from "@/features/checkout/types";
import type { ShippingFormValues } from "@/features/checkout/types";

export function useCheckout() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeOrder = useCallback(
    async (paymentMethod: PaymentMethod, shipping: ShippingFormValues) => {
      setError(null);
      setLoading(true);
      try {
        const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod,
            shipping,
            items,
            total,
          }),
        });
        const json = (await res.json()) as { error?: string; orderId?: string };
        if (!res.ok) {
          setError(json.error ?? "Order failed");
          return;
        }
        if (!json.orderId) {
          setError("Missing order id");
          return;
        }
        clearCart();
        router.push(`/checkout/confirmation?order_id=${json.orderId}`);
        router.refresh();
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    },
    [items, clearCart, router]
  );

  return { placeOrder, loading, error, setError, subtotal, items };
}
