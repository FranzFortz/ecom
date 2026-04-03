// src/features/checkout/components/CheckoutForm.tsx
"use client";

import { useForm } from "react-hook-form";
import type { ShippingFormValues } from "@/features/checkout/types";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";

export function CheckoutForm({
  defaultEmail,
  shippingDefaults,
  onSubmit,
  isSubmitting,
}: {
  defaultEmail?: string | null;
  shippingDefaults?: Partial<ShippingFormValues>;
  onSubmit: (values: ShippingFormValues) => void;
  isSubmitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormValues>({
    defaultValues: {
      fullName: shippingDefaults?.fullName ?? "",
      email: shippingDefaults?.email ?? defaultEmail ?? "",
      phone: shippingDefaults?.phone ?? "",
      street: shippingDefaults?.street ?? "",
      city: shippingDefaults?.city ?? "",
      province: shippingDefaults?.province ?? "",
      zip: shippingDefaults?.zip ?? "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-stone-200 bg-white p-6"
    >
      <h2 className="text-lg font-semibold text-stone-900">Shipping details</h2>
      <p className="text-xs text-stone-500">
        Pre-filled from your profile when available (PRD{" "}
        <code className="rounded bg-stone-100 px-1">profiles.address</code>).
      </p>
      <Input
        label="Full name"
        {...register("fullName", { required: "Required" })}
        error={errors.fullName?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register("email", { required: "Required" })}
        error={errors.email?.message}
      />
      <Input
        label="Phone"
        {...register("phone", { required: "Required" })}
        error={errors.phone?.message}
      />
      <Input
        label="Street address"
        {...register("street", { required: "Required" })}
        error={errors.street?.message}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="City"
          {...register("city", { required: "Required" })}
          error={errors.city?.message}
        />
        <Input
          label="Province"
          {...register("province", { required: "Required" })}
          error={errors.province?.message}
        />
      </div>
      <Input
        label="ZIP code"
        {...register("zip", { required: "Required" })}
        error={errors.zip?.message}
      />
      <Button type="submit" className="w-full sm:w-auto" isLoading={isSubmitting}>
        Place order
      </Button>
    </form>
  );
}
