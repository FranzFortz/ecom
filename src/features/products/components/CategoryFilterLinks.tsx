// src/features/products/components/CategoryFilterLinks.tsx
import Link from "next/link";
import type { CatalogCategoryItem } from "@/features/products/types";
import { cn } from "@/shared/lib/utils";

export function CategoryFilterLinks({
  categories,
  activeCategory,
}: {
  categories: CatalogCategoryItem[];
  activeCategory?: string;
}) {
  const pill =
    "min-h-11 inline-flex items-center rounded-lg border-2 border-dashed px-4 py-2 text-sm font-medium transition-colors";
  const on = "border-emerald-600 bg-emerald-50 text-emerald-900";
  const off = "border-stone-300 text-stone-600 hover:border-stone-400";

  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/products" className={cn(pill, !activeCategory ? on : off)}>
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.slug}
          href={`/products?category=${encodeURIComponent(c.slug)}`}
          className={cn(pill, activeCategory === c.slug ? on : off)}
        >
          <span aria-hidden>{c.emoji}</span> {c.name}
        </Link>
      ))}
    </div>
  );
}
