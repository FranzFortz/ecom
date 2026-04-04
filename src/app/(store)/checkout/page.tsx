// src/app/(store)/checkout/page.tsx
import { redirect } from "next/navigation";
import { CheckoutClient } from "@/features/checkout/components/CheckoutClient";
import { isAdminEmail } from "@/shared/lib/admin";
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";
import type { ShippingFormValues } from "@/features/checkout/types";
import type { Json } from "@/shared/types";

function addressFromJson(raw: Json | null): Partial<ShippingFormValues> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const o = raw as Record<string, unknown>;
  return {
    street: typeof o.street === "string" ? o.street : undefined,
    city: typeof o.city === "string" ? o.city : undefined,
    province: typeof o.province === "string" ? o.province : undefined,
    zip: typeof o.zip === "string" ? o.zip : undefined,
  };
}

export default async function CheckoutPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?callbackUrl=%2Fcheckout");
  }
  if (user.email && isAdminEmail(user.email)) {
    redirect("/admin");
  }

  let shippingDefaults: Partial<ShippingFormValues> = {};

  const { data } = await supabase
    .from("profiles")
    .select("full_name, email, phone, address")
    .eq("id", user.id)
    .maybeSingle();

  if (data) {
    shippingDefaults = {
      fullName:
        (data.full_name as string | null) ??
        (user.user_metadata as { full_name?: string } | undefined)?.full_name ??
        undefined,
      email: (data.email as string | null) ?? user.email ?? undefined,
      phone: (data.phone as string | null) ?? undefined,
      ...addressFromJson((data.address as Json | null) ?? null),
    };
  } else {
    const meta = user.user_metadata as { full_name?: string } | undefined;
    shippingDefaults = {
      fullName: meta?.full_name ?? user.email?.split("@")[0] ?? undefined,
      email: user.email ?? undefined,
    };
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900">Checkout</h1>
      <p className="mt-1 text-sm text-stone-600">
        Review your order and enter shipping details.
      </p>
      <p
        className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950"
        role="status"
      >
        Payments are not processed online yet — this is a mock checkout. Orders are
        stored as pending with your selected method (GCash, COD, or card on delivery)
        for when you plug in real flows later.
      </p>
      <div className="mt-8">
        <CheckoutClient shippingDefaults={shippingDefaults} />
      </div>
    </main>
  );
}
