// src/app/(auth)/auth/login/page.tsx
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <p className="text-sm text-stone-500">Loading sign-in form…</p>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
