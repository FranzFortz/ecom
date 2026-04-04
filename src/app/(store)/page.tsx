// src/app/(store)/page.tsx
import Link from "next/link";
import { CategoryGrid } from "@/features/products/components/CategoryGrid";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import {
  getCatalogCategories,
  getFeaturedProducts,
} from "@/features/products/hooks/useProducts";
import { getStorefrontSettings } from "@/shared/lib/storefront-settings";
import { cn } from "@/shared/lib/utils";

export default async function HomePage() {
  const [featured, categories, sf] = await Promise.all([
    getFeaturedProducts(),
    getCatalogCategories(),
    getStorefrontSettings(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {sf.showAnnouncement && sf.announcementText.trim() ? (
        <div className="mb-6 rounded-lg bg-slate-900 px-4 py-2.5 text-center text-sm text-white">
          {sf.announcementText}
        </div>
      ) : null}

      <section className="mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 px-6 py-16 text-center text-white shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/90">
          {sf.heroKicker}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {sf.heroTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
          {sf.heroSubtitle}
        </p>
        <Link
          href={sf.heroCtaHref.startsWith("/") ? sf.heroCtaHref : "/products"}
          className={cn(
            "mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-500 px-8 text-sm font-semibold text-slate-950 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
          )}
        >
          {sf.heroCtaLabel}
        </Link>
      </section>

      {sf.showValueStrip ? (
        <section
          className="mb-10 grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-3"
          aria-label="Value propositions"
        >
          {sf.valueProps.slice(0, 3).map((x) => (
            <div key={x.title} className="text-center sm:text-left">
              <p className="text-sm font-semibold text-slate-900">{x.title}</p>
              <p className="mt-1 text-xs text-slate-600">{x.description}</p>
            </div>
          ))}
        </section>
      ) : null}

      {sf.showFeaturedSection ? (
        <section className="mb-10">
          <div className="mb-4 flex items-end justify-between gap-4 border-b border-slate-200 pb-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {sf.featuredSectionKicker}
              </p>
              <h2 className="text-xl font-semibold text-slate-900">
                {sf.featuredSectionTitle}
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
      ) : null}

      {sf.showCategorySection ? (
        <section>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {sf.categorySectionKicker}
          </p>
          <h2 className="text-xl font-semibold text-slate-900">
            {sf.categorySectionTitle}
          </h2>
          <div className="mt-4">
            <CategoryGrid categories={categories} />
          </div>
        </section>
      ) : null}
    </main>
  );
}
