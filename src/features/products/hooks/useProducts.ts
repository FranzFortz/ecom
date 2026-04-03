// src/features/products/hooks/useProducts.ts
import { createSupabaseServerClient } from "@/shared/lib/supabase";
import type { Product } from "@/features/products/types";

function hasSupabaseEnv(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function mapRow(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: (row.description as string) ?? null,
    price: Number(row.price),
    compare_price:
      row.compare_price != null ? Number(row.compare_price) : null,
    sku: row.sku as string,
    stock: Number(row.stock ?? 0),
    category: (row.category as string) ?? null,
    images: (row.images as string[] | null) ?? null,
    variants: (row.variants as Product["variants"]) ?? null,
    is_featured: Boolean(row.is_featured),
    created_at: row.created_at as string,
  };
}

export async function getProducts(options?: {
  category?: string;
  search?: string;
}): Promise<Product[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createSupabaseServerClient();
  let q = supabase.from("products").select("*").order("created_at", {
    ascending: false,
  });
  if (options?.category) {
    q = q.eq("category", options.category);
  }
  if (options?.search?.trim()) {
    q = q.ilike("name", `%${options.search.trim()}%`);
  }
  const { data, error } = await q;
  if (error || !data) return [];
  return data.map((row) => mapRow(row as Record<string, unknown>));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return mapRow(data as Record<string, unknown>);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .limit(8);
  if (error || !data) return [];
  return data.map((row) => mapRow(row as Record<string, unknown>));
}

export async function getAllProductSlugs(): Promise<string[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.from("products").select("slug");
  if (error || !data) return [];
  return data.map((r) => r.slug as string);
}
