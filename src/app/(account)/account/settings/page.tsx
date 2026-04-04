// src/app/(account)/account/settings/page.tsx
import { redirect } from "next/navigation";
import { SettingsForm } from "@/features/account/components/SettingsForm";
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";
import type { Json } from "@/shared/types";

export default async function AccountSettingsPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?callbackUrl=%2Faccount%2Fsettings");
  }

  const meta = user.user_metadata as { full_name?: string } | undefined;
  let profile: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
    address: Json | null;
  } = {
    full_name: meta?.full_name ?? user.email?.split("@")[0] ?? null,
    email: user.email ?? null,
    phone: null,
    address: null,
  };

  const { data } = await supabase
    .from("profiles")
    .select("full_name, email, phone, address")
    .eq("id", user.id)
    .maybeSingle();

  if (data) {
    profile = {
      full_name: (data.full_name as string | null) ?? profile.full_name,
      email: (data.email as string | null) ?? profile.email,
      phone: (data.phone as string | null) ?? null,
      address: (data.address as Json | null) ?? null,
    };
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
