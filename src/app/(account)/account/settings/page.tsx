// src/app/(account)/account/settings/page.tsx
import { SettingsForm } from "@/features/account/components/SettingsForm";
import { auth } from "@/auth";
import { createSupabaseServiceClient } from "@/shared/lib/supabase/service";
import type { Json } from "@/shared/types";

export default async function AccountSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  let profile: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
    address: Json | null;
  } = {
    full_name: session.user.name ?? null,
    email: session.user.email ?? null,
    phone: null,
    address: null,
  };

  try {
    const supabase = createSupabaseServiceClient();
    const { data } = await supabase
      .from("profiles")
      .select("full_name, email, phone, address")
      .eq("id", session.user.id)
      .maybeSingle();
    if (data) {
      profile = {
        full_name: (data.full_name as string | null) ?? profile.full_name,
        email: (data.email as string | null) ?? profile.email,
        phone: (data.phone as string | null) ?? null,
        address: (data.address as Json | null) ?? null,
      };
    }
  } catch {
    /* use session fallback */
  }

  return (
    <main>
      <h1 className="text-2xl font-bold text-stone-900">Account settings</h1>
      <p className="mt-1 text-sm text-stone-600">
        Update the data stored in Supabase for your profile (PRD schema).
      </p>
      <div className="mt-8">
        <SettingsForm initial={profile} />
      </div>
    </main>
  );
}
