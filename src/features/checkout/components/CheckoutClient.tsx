// src/features/checkout/components/CheckoutClient.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useSupabaseAuth } from "@/features/auth/context/SupabaseAuthContext";
import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";
import { OrderSummary } from "@/features/checkout/components/OrderSummary";
import { PaymentOptions } from "@/features/checkout/components/PaymentOptions";
import { useCheckout } from "@/features/checkout/hooks/useCheckout";
import type { PaymentMethod } from "@/features/checkout/types";
import type { ShippingFormValues } from "@/features/checkout/types";
import { cn } from "@/shared/lib/utils";

export function CheckoutClient({
  shippingDefaults,
}: {
  shippingDefaults?: Partial<ShippingFormValues>;
}) {
  const { user } = useSupabaseAuth();
  const { placeOrder, loading, error, items } = useCheckout();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("gcash");

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-stone-200 bg-white p-8 text-center">
        <p className="text-stone-600">Your cart is empty.</p>
        <Link
          href="/products"
          className={cn(
            "mt-4 inline-flex min-h-11 items-center justify-center rounded-lg border border-stone-300 bg-stone-100 px-4 text-sm font-medium text-stone-800 hover:bg-stone-200"
          )}
        >
          Browse products
        </Link>
      </div>
    );
  }

  const onSubmit = (shipping: ShippingFormValues) => {
    void placeOrder(paymentMethod, shipping);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        <CheckoutForm
          defaultEmail={user?.email}
          shippingDefaults={shippingDefaults}
          onSubmit={onSubmit}
          isSubmitting={loading}
        />
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <PaymentOptions value={paymentMethod} onChange={setPaymentMethod} />
        </div>
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
      <OrderSummary />
    </div>
  );
}
