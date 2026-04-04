import { NextResponse } from "next/server";
import { isAdminEmail } from "@/shared/lib/admin";
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";

export type AdminCheckResult =
  | { ok: true }
  | { ok: false; response: NextResponse };

/** Use in Route Handlers before admin-only mutations. */
export async function requireAdminApi(): Promise<AdminCheckResult> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!isAdminEmail(user.email)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true };
}
