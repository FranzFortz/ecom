// src/app/(auth)/auth/register/page.tsx
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <RegisterForm />
    </main>
  );
}
