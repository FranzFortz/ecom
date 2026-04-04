import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";

/** Verified user from Supabase Auth (server). */
export async function getServerSupabaseUser(): Promise<User | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}
