import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/shared/lib/admin-request";
import {
  createSupabaseServiceClient,
  isSupabaseServiceRoleConfigured,
} from "@/shared/lib/supabase/service";

const CONFIRM_PHRASE = "DELETE_ALL_ORDERS";

type Body = { confirm?: unknown };

/**
 * Removes every row from public.orders. Requires body { "confirm": "DELETE_ALL_ORDERS" }.
 */
export async function POST(req: Request) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  if (!isSupabaseServiceRoleConfigured()) {
    return NextResponse.json(
      { error: "Server missing SUPABASE_SERVICE_ROLE_KEY" },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.confirm !== CONFIRM_PHRASE) {
    return NextResponse.json(
      { error: `Send { "confirm": "${CONFIRM_PHRASE}" }` },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseServiceClient();
    const { error } = await supabase
      .from("orders")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/account");
    revalidatePath("/account/orders");

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
