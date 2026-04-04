// src/features/products/constants.ts
import type { CatalogCategoryItem } from "@/features/products/types";

/**
 * Default categories — must match `supabase/seed.sql` (`categories` + `products.category`).
 * Gadgets-only catalog.
 */
export const SHOP_CATEGORIES = [
  { slug: "gadgets", label: "Gadgets", emoji: "📱" },
] as const;

/** Emoji per category slug when `categories` rows have no icon column. */
export const CATEGORY_EMOJI_BY_SLUG: Record<string, string> = {
  gadgets: "📱",
};

export function getStaticCatalogCategories(): CatalogCategoryItem[] {
  return SHOP_CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.label,
    emoji: c.emoji,
  }));
}
