// src/features/products/constants.ts
import type { CatalogCategoryItem } from "@/features/products/types";

/**
 * Default categories — must match `supabase/seed.sql` (`categories` + `products.category`).
 */
export const SHOP_CATEGORIES = [
  { slug: "clothing", label: "Clothing", emoji: "👕" },
  { slug: "electronics", label: "Electronics", emoji: "📱" },
  { slug: "home", label: "Home", emoji: "🏠" },
] as const;

/** Emoji per category slug when `categories` rows have no icon column (PRD has no icon field). */
export const CATEGORY_EMOJI_BY_SLUG: Record<string, string> = {
  clothing: "👕",
  electronics: "📱",
  home: "🏠",
};

export function getStaticCatalogCategories(): CatalogCategoryItem[] {
  return SHOP_CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.label,
    emoji: c.emoji,
  }));
}
