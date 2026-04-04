import { NextResponse } from "next/server";
import { isAdminEmail } from "@/shared/lib/admin";
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";

/** Lets the client know if the current session is an admin (no secrets exposed). */
export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ isAdmin: false });
  }

  return NextResponse.json({ isAdmin: isAdminEmail(user.email) });
}
