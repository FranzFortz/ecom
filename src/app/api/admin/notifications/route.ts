import { NextResponse } from "next/server";
import { requireAdminApi } from "@/shared/lib/admin-request";
import {
  createSupabaseServiceClient,
  isSupabaseServiceRoleConfigured,
} from "@/shared/lib/supabase/service";

export async function GET(req: Request) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  if (!isSupabaseServiceRoleConfigured()) {
    return NextResponse.json(
      { error: "Server missing SUPABASE_SERVICE_ROLE_KEY" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit") ?? "30") || 30)
  );

  try {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("admin_notifications")
      .select("id, kind, title, body, payload, read_at, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const items = data ?? [];
    const unreadCount = items.filter((r) => r.read_at == null).length;
    return NextResponse.json({ items, unreadCount });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
