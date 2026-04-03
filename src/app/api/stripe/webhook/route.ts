// src/app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";

export function POST() {
  return NextResponse.json(
    { ok: false, message: "Webhook not configured" },
    { status: 503 }
  );
}
