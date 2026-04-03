// src/app/(store)/page.tsx
import Link from "next/link";
import { CategoryGrid } from "@/features/products/components/CategoryGrid";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import {
  getCatalogCategories,
  getFeaturedProducts,
} from "@/features/products/hooks/useProducts";
import { cn } from "@/shared/lib/utils";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(),
    getCatalogCategories(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero — placeholder wireframe */}
      <section className="mb-10 rounded-2xl border-2 border-dashed border-stone-400 bg-gradient-to-br from-stone-100 to-stone-200 px-6 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
          [ Hero — placeholder ]
        </p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl">
          BayanMart storefront preview
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-stone-600">
          Wireframe layout: headline, subcopy, and primary CTA. Replace copy
          when branding is final.
        </p>
        <Link
          href="/products"
          className={cn(
            "mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-700 px-6 text-sm font-medium text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          )}
        >
          Shop now
        </Link>
      </section>

      {/* Value strip */}
      <section
        className="mb-10 grid gap-4 border-2 border-dashed border-stone-300 bg-stone-50 p-6 sm:grid-cols-3"
        aria-label="Value propositions placeholder"
      >
        {[
          { t: "Free shipping", d: "Placeholder — nationwide copy" },
          { t: "Secure checkout", d: "Placeholder — GCash / cash / card" },
          { t: "Easy returns", d: "Placeholder — policy summary" },
        ].map((x) => (
          <div key={x.t} className="text-center">
            <p className="text-sm font-semibold text-stone-800">{x.t}</p>
            <p className="mt-1 text-xs text-stone-500">{x.d}</p>
          </div>
        ))}
      </section>

      {/* Featured */}
      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between gap-4 border-b border-dashed border-stone-300 pb-2">
          <div>
            <p className="text-xs font-medium uppercase text-stone-500">
              [ Section — featured products ]
            </p>
            <h2 className="text-xl font-semibold text-stone-900">
              Featured products
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-emerald-800 hover:underline"
          >
            View all
          </Link>
        </div>
        <ProductGrid
          products={featured}
          placeholderCount={featured.length === 0 ? 6 : 0}
        />
      </section>

      {/* Categories — driven by Supabase `categories` (or products), else seed fallback */}
      <section>
        <p className="text-xs font-medium uppercase text-stone-500">
          [ Section — category grid ]
        </p>
        <h2 className="text-xl font-semibold text-stone-900">Shop by category</h2>
        <CategoryGrid categories={categories} />
      </section>
    </main>
  );
}
