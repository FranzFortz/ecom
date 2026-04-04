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

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const sku = typeof body.sku === "string" ? body.sku.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : null;
  const category =
    typeof body.category === "string" ? body.category.trim() : "gadgets";

  const price = typeof body.price === "number" ? body.price : Number(body.price);
  const stock = typeof body.stock === "number" ? body.stock : Number(body.stock);
  let compare_price: number | null = null;
  if (body.compare_price != null && body.compare_price !== "") {
    const c =
      typeof body.compare_price === "number"
        ? body.compare_price
        : Number(body.compare_price);
    compare_price = Number.isFinite(c) ? c : null;
  }

  const is_featured = Boolean(body.is_featured);

  let images: string[] | null = null;
  if (Array.isArray(body.images)) {
    images = body.images.filter((x): x is string => typeof x === "string" && x.trim() !== "");
    if (images.length === 0) images = null;
  }

  let variants: Record<string, unknown> | null = null;
  if (body.variants != null && body.variants !== "") {
    if (typeof body.variants === "object" && !Array.isArray(body.variants)) {
      variants = body.variants as Record<string, unknown>;
    } else if (typeof body.variants === "string") {
      const t = body.variants.trim();
      if (t) {
        try {
          const parsed = JSON.parse(t) as unknown;
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            variants = parsed as Record<string, unknown>;
          }
        } catch {
          return NextResponse.json(
            { error: "variants must be valid JSON object or empty" },
            { status: 400 }
          );
        }
      }
    }
  }

  if (!name || !slug || !sku) {
    return NextResponse.json(
      { error: "name, slug, and sku are required" },
      { status: 400 }
    );
  }
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }
  if (!Number.isFinite(stock) || stock < 0 || !Number.isInteger(stock)) {
    return NextResponse.json({ error: "Invalid stock" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        description,
        price,
        compare_price,
        sku,
        stock,
        category,
        images,
        variants,
        is_featured,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return NextResponse.json({ id: data.id as string });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
