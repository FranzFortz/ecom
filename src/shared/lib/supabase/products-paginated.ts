// src/shared/lib/supabase/products-paginated.ts
import type { SupabaseClient } from "@supabase/supabase-js";

const PAGE = 1000;

/**
 * Fetches every row from `products` in pages. PostgREST (Supabase) can cap rows
 * per request via project `max_rows`; a single `.select()` may not return the full catalog.
 */
export async function fetchProductRowsPaginated(
  supabase: SupabaseClient,
  options?: { category?: string; search?: string }
): Promise<{ rows: Record<string, unknown>[]; error: Error | null }> {
  const rows: Record<string, unknown>[] = [];
  let offset = 0;

  for (;;) {
    let q = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE - 1);

    if (options?.category) {
      q = q.eq("category", options.category);
    }
    if (options?.search?.trim()) {
      q = q.ilike("name", `%${options.search.trim()}%`);
    }

    const { data, error } = await q;
    if (error) {
      return { rows, error: new Error(error.message) };
    }
    if (!data?.length) {
      break;
    }
    rows.push(...(data as Record<string, unknown>[]));
    if (data.length < PAGE) {
      break;
    }
    offset += PAGE;
  }

  return { rows, error: null };
}

export async function fetchProductSlugsPaginated(
  supabase: SupabaseClient
): Promise<{ slugs: string[]; error: Error | null }> {
  const slugs: string[] = [];
  let offset = 0;

  for (;;) {
    const { data, error } = await supabase
      .from("products")
      .select("slug")
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE - 1);

    if (error) {
      return { slugs, error: new Error(error.message) };
    }
    if (!data?.length) {
      break;
    }
    slugs.push(...data.map((r) => r.slug as string));
    if (data.length < PAGE) {
      break;
    }
    offset += PAGE;
  }

  return { slugs, error: null };
}
