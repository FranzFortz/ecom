// src/features/account/components/AccountOrdersRealtimeRefresh.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useSupabaseAuth } from "@/features/auth/context/SupabaseAuthContext";
import { createSupabaseBrowserClient } from "@/shared/lib/supabase/browser";

/** Refreshes order history when an order row updates (e.g. admin changed status). */
export function AccountOrdersRealtimeRefresh() {
  const { user } = useSupabaseAuth();
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`orders-account-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user?.id, supabase, router]);

  return null;
}
