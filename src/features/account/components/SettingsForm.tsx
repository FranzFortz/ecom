// src/features/account/components/SettingsForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import type { Json } from "@/shared/types";

type Address = {
  street?: string;
  city?: string;
  province?: string;
  zip?: string;
};

export type ProfileSettingsValues = {
  full_name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  zip: string;
};

function parseAddress(raw: Json | null): Address {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const o = raw as Record<string, unknown>;
  return {
    street: typeof o.street === "string" ? o.street : "",
    city: typeof o.city === "string" ? o.city : "",
    province: typeof o.province === "string" ? o.province : "",
    zip: typeof o.zip === "string" ? o.zip : "",
  };
}

export function SettingsForm({
  initial,
}: {
  initial: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
    address: Json | null;
  };
}) {
  const router = useRouter();
  const addr = parseAddress(initial.address);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm<ProfileSettingsValues>({
    defaultValues: {
      full_name: initial.full_name ?? "",
      email: initial.email ?? "",
      phone: initial.phone ?? "",
      street: addr.street ?? "",
      city: addr.city ?? "",
      province: addr.province ?? "",
      zip: addr.zip ?? "",
    },
  });

  async function onSubmit(values: ProfileSettingsValues) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: values.full_name,
          phone: values.phone,
          address: {
            street: values.street,
            city: values.city,
            province: values.province,
            zip: values.zip,
          },
        }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Update failed");
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-xl space-y-4 rounded-xl border border-stone-200 bg-white p-6"
    >
      <h2 className="text-lg font-semibold text-stone-900">Profile & address</h2>
      <p className="text-xs text-stone-500">
        Matches PRD <code className="rounded bg-stone-100 px-1">profiles</code>{" "}
        row. Email is read-only (from your login).
      </p>
      <Input label="Full name" {...register("full_name")} />
      <Input label="Email" type="email" {...register("email")} disabled readOnly />
      <Input label="Phone" {...register("phone")} />
      <p className="text-sm font-medium text-stone-800">Default shipping address</p>
      <Input label="Street" {...register("street")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="City" {...register("city")} />
        <Input label="Province" {...register("province")} />
      </div>
      <Input label="ZIP" {...register("zip")} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" isLoading={loading}>
        Save changes
      </Button>
    </form>
  );
}
