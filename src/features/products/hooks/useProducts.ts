// src/features/products/hooks/useProducts.ts
import {
  CATEGORY_EMOJI_BY_SLUG,
  getStaticCatalogCategories,
} from "@/features/products/constants";
import type { CatalogCategoryItem } from "@/features/products/types";
import type { Product } from "@/features/products/types";
import {
  fetchProductRowsPaginated,
  fetchProductSlugsPaginated,
} from "@/shared/lib/supabase/products-paginated";
import { createSupabaseAnonClient } from "@/shared/lib/supabase/public";

function hasSupabaseEnv(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function mapProductRow(row: Record<string, unknown>): Product {
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

function emojiForSlug(slug: string): string {
  return CATEGORY_EMOJI_BY_SLUG[slug] ?? "🛒";
}

/**
 * PRD: `categories` table is source of truth; fallback to distinct `products.category`,
 * then static seed-aligned list when DB is empty.
 */
export async function getCatalogCategories(): Promise<CatalogCategoryItem[]> {
  if (!hasSupabaseEnv()) {
    return getStaticCatalogCategories();
  }

  const supabase = createSupabaseAnonClient();

  const { data: catRows, error: catErr } = await supabase
    .from("categories")
    .select("name, slug")
    .order("name", { ascending: true });

  if (!catErr && catRows && catRows.length > 0) {
    return catRows.map((row) => ({
      slug: row.slug as string,
      name: row.name as string,
      emoji: emojiForSlug(row.slug as string),
    }));
  }

  const { data: productRows, error: prodErr } = await supabase
    .from("products")
    .select("category");

  if (!prodErr && productRows && productRows.length > 0) {
    const slugs = Array.from(
      new Set(
        productRows
          .map((r) => r.category as string | null)
          .filter((c): c is string => Boolean(c))
      )
    ).sort();
    if (slugs.length > 0) {
      return slugs.map((slug) => ({
        slug,
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        emoji: emojiForSlug(slug),
      }));
    }
  }

  return getStaticCatalogCategories();
}

export async function getProducts(options?: {
  category?: string;
  search?: string;
}): Promise<Product[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createSupabaseAnonClient();
  const { rows, error } = await fetchProductRowsPaginated(supabase, options);
  if (error) return [];
  return rows.map((row) => mapProductRow(row));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return mapProductRow(data as Record<string, unknown>);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .limit(8);
  if (error || !data) return [];
  return data.map((row) => mapProductRow(row as Record<string, unknown>));
}

export async function getAllProductSlugs(): Promise<string[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = createSupabaseAnonClient();
  const { slugs, error } = await fetchProductSlugsPaginated(supabase);
  if (error) return [];
  return slugs;
}
