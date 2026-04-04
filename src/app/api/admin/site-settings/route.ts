import { NextResponse } from "next/server";
import { requireAdminApi } from "@/shared/lib/admin-request";
import {
  createSupabaseServiceClient,
  isSupabaseServiceRoleConfigured,
} from "@/shared/lib/supabase/service";
import {
  DEFAULT_STOREFRONT_SETTINGS,
  parseStorefrontSettings,
} from "@/shared/types/storefront";
import type { Json } from "@/shared/types";

export async function GET() {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  if (!isSupabaseServiceRoleConfigured()) {
    return NextResponse.json({
      settings: DEFAULT_STOREFRONT_SETTINGS,
      usedDefaults: true,
    });
  }

  try {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("settings")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({
        settings: DEFAULT_STOREFRONT_SETTINGS,
        usedDefaults: true,
      });
    }

    return NextResponse.json({
      settings: parseStorefrontSettings(data.settings as Json | null),
      usedDefaults: false,
    });
  } catch {
    return NextResponse.json({
      settings: DEFAULT_STOREFRONT_SETTINGS,
      usedDefaults: true,
    });
  }
}

export async function PUT(req: Request) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  if (!isSupabaseServiceRoleConfigured()) {
    return NextResponse.json(
      { error: "Server missing SUPABASE_SERVICE_ROLE_KEY" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const settings = parseStorefrontSettings(body as Json);

  try {
    const supabase = createSupabaseServiceClient();
    const { error } = await supabase.from("site_settings").upsert(
      {
        id: "default",
        settings: settings as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, settings });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
