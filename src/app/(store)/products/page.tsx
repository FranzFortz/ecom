// src/app/(store)/products/page.tsx
import { CategoryFilterLinks } from "@/features/products/components/CategoryFilterLinks";
import { CatalogSearchBar } from "@/features/products/components/CatalogSearchBar";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import {
  getCatalogCategories,
  getProducts,
} from "@/features/products/hooks/useProducts";

type SearchParams = { category?: string; search?: string };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const category =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;

  const [products, categories] = await Promise.all([
    getProducts({ category, search }),
    getCatalogCategories(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 rounded-xl border-2 border-dashed border-stone-400 bg-stone-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          [ Catalog page — placeholder chrome ]
        </p>
        <h1 className="mt-1 text-2xl font-bold text-stone-900">All products</h1>
        <p className="mt-1 text-sm text-stone-600">
          Filter by category and search. Category tabs follow your Supabase{" "}
          <code className="rounded bg-stone-200 px-1 text-xs">categories</code>{" "}
          table (or distinct <code className="rounded bg-stone-200 px-1 text-xs">products.category</code>
          ).
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <CategoryFilterLinks
          categories={categories}
          activeCategory={category}
        />
        <CatalogSearchBar />
      </div>

      <ProductGrid
        products={products}
        placeholderCount={products.length === 0 ? 8 : 0}
      />
    </main>
  );
}
