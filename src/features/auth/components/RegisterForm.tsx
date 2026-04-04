// src/features/auth/components/RegisterForm.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { resolvePostAuthLandingPath } from "@/features/auth/lib/admin-session-client";
import { createSupabaseBrowserClient } from "@/shared/lib/supabase/browser";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { SITE_NAME } from "@/shared/lib/site";

export function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (signUpErr) {
        setError(signUpErr.message);
        return;
      }

      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInErr) {
        setError(
          "Account created. If email confirmation is required, confirm then log in."
        );
        return;
      }

      const user = signUpData.user ?? (await supabase.auth.getUser()).data.user;
      if (user) {
        await supabase.from("profiles").upsert(
          {
            id: user.id,
            email,
            full_name: fullName,
          },
          { onConflict: "id" }
        );
      }

      router.push(await resolvePostAuthLandingPath("/account"));
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex max-w-md flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      <h1 className="text-xl font-semibold text-stone-900">Create account</h1>
      <p className="text-sm text-stone-600">Join {SITE_NAME}</p>
      <Input
        label="Full name"
        name="fullName"
        autoComplete="name"
        required
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={6}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" className="w-full" isLoading={loading}>
        Register
      </Button>
      <p className="text-center text-sm text-stone-600">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-emerald-800 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
