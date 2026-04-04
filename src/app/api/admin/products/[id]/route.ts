import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/shared/lib/admin-request";
import {
  createSupabaseServiceClient,
  isSupabaseServiceRoleConfigured,
} from "@/shared/lib/supabase/service";

type Body = {
  name?: unknown;
  slug?: unknown;
  description?: unknown;
  price?: unknown;
  compare_price?: unknown;
  sku?: unknown;
  stock?: unknown;
  category?: unknown;
  images?: unknown;
  variants?: unknown;
  is_featured?: unknown;
};

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  if (!isSupabaseServiceRoleConfigured()) {
    return NextResponse.json(
      { error: "Server missing SUPABASE_SERVICE_ROLE_KEY" },
      { status: 503 }
    );
  }

  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (typeof body.name === "string") updates.name = body.name.trim();
  if (typeof body.slug === "string") updates.slug = body.slug.trim();
  if (typeof body.sku === "string") updates.sku = body.sku.trim();
  if (typeof body.category === "string") updates.category = body.category.trim();
  if (typeof body.description === "string") {
    updates.description = body.description.trim() || null;
  }
  if (typeof body.price === "number" || typeof body.price === "string") {
    const price =
      typeof body.price === "number" ? body.price : Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }
    updates.price = price;
  }
  if (typeof body.stock === "number" || typeof body.stock === "string") {
    const stock =
      typeof body.stock === "number" ? body.stock : Number(body.stock);
    if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) {
      return NextResponse.json({ error: "Invalid stock" }, { status: 400 });
    }
    updates.stock = stock;
  }
  if ("compare_price" in body) {
    if (body.compare_price == null || body.compare_price === "") {
      updates.compare_price = null;
    } else {
      const c =
        typeof body.compare_price === "number"
          ? body.compare_price
          : Number(body.compare_price);
      updates.compare_price = Number.isFinite(c) ? c : null;
    }
  }
  if (typeof body.is_featured === "boolean") {
    updates.is_featured = body.is_featured;
  }
  if (Array.isArray(body.images)) {
    const imgs = body.images.filter(
      (x): x is string => typeof x === "string" && x.trim() !== ""
    );
    updates.images = imgs.length ? imgs : null;
  }
  if (body.variants !== undefined) {
    if (body.variants == null || body.variants === "") {
      updates.variants = null;
    } else if (
      typeof body.variants === "object" &&
      !Array.isArray(body.variants)
    ) {
      updates.variants = body.variants;
    } else if (typeof body.variants === "string") {
      const t = body.variants.trim();
      if (!t) updates.variants = null;
      else {
        try {
          const parsed = JSON.parse(t) as unknown;
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            updates.variants = parsed;
          } else {
            return NextResponse.json(
              { error: "variants must be a JSON object" },
              { status: 400 }
            );
          }
        } catch {
          return NextResponse.json(
            { error: "variants must be valid JSON" },
            { status: 400 }
          );
        }
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseServiceClient();
    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const gate = await requireAdminApi();
  if (!gate.ok) return gate.response;

  if (!isSupabaseServiceRoleConfigured()) {
    return NextResponse.json(
      { error: "Server missing SUPABASE_SERVICE_ROLE_KEY" },
      { status: 503 }
    );
  }

  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseServiceClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
