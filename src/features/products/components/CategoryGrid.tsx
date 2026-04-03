// src/features/products/components/CategoryGrid.tsx
import Link from "next/link";
import type { CatalogCategoryItem } from "@/features/products/types";

export function CategoryGrid({ categories }: { categories: CatalogCategoryItem[] }) {
  return (
    <ul className="mt-4 grid gap-4 sm:grid-cols-3">
      {categories.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/products?category=${encodeURIComponent(c.slug)}`}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-white p-8 text-center transition hover:border-emerald-500 hover:bg-emerald-50/30"
          >
            <span className="text-3xl" aria-hidden>
              {c.emoji}
            </span>
            <span className="mt-2 font-medium text-stone-800">{c.name}</span>
            <span className="mt-1 text-xs text-stone-500">{c.slug}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
