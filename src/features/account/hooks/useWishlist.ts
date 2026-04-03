// src/features/account/hooks/useWishlist.ts
import { createSupabaseServiceClient } from "@/shared/lib/supabase/service";
import type { ProductRow } from "@/shared/types";

export type WishlistLine = {
  id: string;
  product_id: string;
  created_at: string;
  product: ProductRow | null;
};

export async function fetchWishlistForUser(
  userId: string
): Promise<WishlistLine[]> {
  try {
    const supabase = createSupabaseServiceClient();
    const { data, error } = await supabase
      .from("wishlist")
      .select("id, product_id, created_at, products (*)")
      .eq("user_id", userId);

    if (error || !data) return [];
    return (data as unknown as Record<string, unknown>[]).map((row) => ({
      id: row.id as string,
      product_id: row.product_id as string,
      created_at: row.created_at as string,
      product: (row.products as ProductRow | null) ?? null,
    }));
  } catch {
    return [];
  }
}
