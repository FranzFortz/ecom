// src/app/api/auth/[...nextauth]/route.ts
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    { ok: false, message: "Auth not configured" },
    { status: 503 }
  );
}

export function POST() {
  return NextResponse.json(
    { ok: false, message: "Auth not configured" },
    { status: 503 }
  );
}
