import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminEmail } from "@/shared/lib/admin";
import { createSupabaseServerClient } from "@/shared/lib/supabase/server";

/** Customer deletes their own order (RLS orders_delete_own). */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.email && isAdminEmail(user.email)) {
    return NextResponse.json(
      { error: "Admins remove orders from Admin → Orders." },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  revalidatePath("/account");
  revalidatePath("/account/orders");
  revalidatePath("/admin");
  revalidatePath("/admin/orders");

  return NextResponse.json({ ok: true });
}
