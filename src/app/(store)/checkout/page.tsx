// src/app/(store)/checkout/page.tsx
import { CheckoutClient } from "@/features/checkout/components/CheckoutClient";
import { auth } from "@/auth";
import { createSupabaseServiceClient } from "@/shared/lib/supabase/service";
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
  const session = await auth();
  let shippingDefaults: Partial<ShippingFormValues> = {};

  if (session?.user?.id) {
    try {
      const supabase = createSupabaseServiceClient();
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, phone, address")
        .eq("id", session.user.id)
        .maybeSingle();
      if (data) {
        shippingDefaults = {
          fullName:
            (data.full_name as string | null) ??
            session.user.name ??
            undefined,
          email: (data.email as string | null) ?? session.user.email ?? undefined,
          phone: (data.phone as string | null) ?? undefined,
          ...addressFromJson((data.address as Json | null) ?? null),
        };
      } else {
        shippingDefaults = {
          fullName: session.user.name ?? undefined,
          email: session.user.email ?? undefined,
        };
      }
    } catch {
      shippingDefaults = {
        fullName: session.user.name ?? undefined,
        email: session.user.email ?? undefined,
      };
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold text-stone-900">Checkout</h1>
      <p className="mt-1 text-sm text-stone-600">
        Review your order and enter shipping details.
      </p>
      <div className="mt-8">
        <CheckoutClient shippingDefaults={shippingDefaults} />
      </div>
    </main>
  );
}
