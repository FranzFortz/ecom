// src/features/checkout/types.ts
import type { PaymentMethod } from "@/shared/types";

export type { PaymentMethod };

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  gcash: "GCash",
  cash: "Cash on delivery",
  card: "Debit / credit card (on delivery)",
};

/** All methods create a pending order; no payment gateway (Philippines, no Stripe). */
export const PAYMENT_METHOD_ORDER_STATUS_HINT: Record<
  PaymentMethod,
  "pending_offline"
> = {
  gcash: "pending_offline",
  cash: "pending_offline",
  card: "pending_offline",
};

export type ShippingFormValues = {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  zip: string;
};
