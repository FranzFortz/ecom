import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";

/** List notifications for the signed-in customer. */
export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("id, kind, title, body, payload, read_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const unread = (data ?? []).filter((r) => r.read_at == null).length;
  return NextResponse.json({ items: data ?? [], unreadCount: unread });
}
