// src/features/products/types.ts
import type { ProductRow } from "@/shared/types";

export type Product = ProductRow;

export type ProductVariants = {
  size?: string[];
  color?: string[];
};
