// src/features/checkout/components/PaymentOptions.tsx
"use client";

import type { PaymentMethod } from "@/features/checkout/types";
import { PAYMENT_METHOD_LABELS } from "@/features/checkout/types";
import { cn } from "@/shared/lib/utils";

const OPTIONS: PaymentMethod[] = ["gcash", "cash", "card"];

export function PaymentOptions({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-stone-800">
        Payment method
      </legend>
      <p className="text-xs text-stone-500">
        Mock checkout — no real payment yet. Your choice is saved on the order for
        fulfillment: GCash, cash on delivery, or card on delivery (no online card
        capture).
      </p>
      <div className="flex flex-col gap-2">
        {OPTIONS.map((m) => (
          <label
            key={m}
            className={cn(
              "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border-2 px-3 py-2",
              value === m
                ? "border-emerald-600 bg-emerald-50"
                : "border-stone-200 hover:border-stone-300"
            )}
          >
            <input
              type="radio"
              name="payment"
              value={m}
              checked={value === m}
              onChange={() => onChange(m)}
              className="h-4 w-4"
            />
            <span className="text-sm font-medium text-stone-800">
              {PAYMENT_METHOD_LABELS[m]}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
