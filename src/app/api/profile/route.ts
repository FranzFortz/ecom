// src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";
import type { Json } from "@/shared/types";

export async function PATCH(req: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const b = body as Record<string, unknown>;
  const updates: Record<string, unknown> = {};

  if (typeof b.full_name === "string") {
    updates.full_name = b.full_name;
  }
  if (typeof b.phone === "string") {
    updates.phone = b.phone;
  }
  if (b.address && typeof b.address === "object") {
    updates.address = b.address as Json;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
