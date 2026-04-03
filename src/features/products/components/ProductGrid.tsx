// src/features/products/components/ProductGrid.tsx
import type { Product } from "@/features/products/types";
import { ProductCard } from "@/features/products/components/ProductCard";
import { ProductCardPlaceholder } from "@/features/products/components/ProductCardPlaceholder";

export function ProductGrid({
  products,
  placeholderCount = 0,
}: {
  products: Product[];
  /** When there are no products, show this many skeleton cards (wireframe). */
  placeholderCount?: number;
}) {
  if (products.length === 0) {
    if (placeholderCount > 0) {
      return (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: placeholderCount }, (_, i) => (
            <li key={i}>
              <ProductCardPlaceholder index={i} />
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p className="rounded-lg border border-dashed border-stone-300 bg-stone-50 py-12 text-center text-sm text-stone-500">
        No products loaded — add data in Supabase or check env keys.
      </p>
    );
  }
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
