// src/features/products/types.ts
import type { ProductRow } from "@/shared/types";

export type Product = ProductRow;

export type ProductVariants = {
  size?: string[];
  color?: string[];
};

/** Storefront category chip (DB slug + display). */
export type CatalogCategoryItem = {
  slug: string;
  name: string;
  emoji: string;
};
