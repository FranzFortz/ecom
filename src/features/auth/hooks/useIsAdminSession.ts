// src/features/auth/hooks/useIsAdminSession.ts
"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { fetchIsAdminSession } from "@/features/auth/lib/admin-session-client";

/** True when the signed-in user is on ADMIN_EMAILS (server-checked). */
export function useIsAdminSession(user: User | null): boolean {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      const next = await fetchIsAdminSession();
      if (!cancelled) setIsAdmin(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return isAdmin;
}
