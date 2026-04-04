// src/app/providers.tsx
"use client";

import { SupabaseAuthProvider } from "@/features/auth/context/SupabaseAuthContext";
import { CartProvider } from "@/features/cart/context/CartContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseAuthProvider>
      <CartProvider>{children}</CartProvider>
    </SupabaseAuthProvider>
  );
}
