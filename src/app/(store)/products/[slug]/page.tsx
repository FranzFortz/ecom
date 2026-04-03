// src/app/(store)/products/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailActions } from "@/features/products/components/ProductDetailActions";
import { ProductImages } from "@/features/products/components/ProductImages";
import { StockBadge } from "@/features/products/components/StockBadge";
import {
  getAllProductSlugs,
  getProductBySlug,
} from "@/features/products/hooks/useProducts";
import { formatPrice } from "@/shared/lib/utils";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["https://placehold.co/800x800/e2e8f0/64748b?text=Product"];
  const imageUrl = images[0];

  const isHtml =
    typeof product.description === "string" &&
    product.description.trim().startsWith("<");

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductImages images={images} alt={product.name} />
        <div className="flex flex-col gap-4">
          {product.category ? (
            <p className="text-sm text-stone-500">
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="font-medium text-emerald-800 hover:underline"
              >
                {product.category}
              </Link>
              <span className="text-stone-400"> · </span>
              <span className="text-stone-500">SKU {product.sku}</span>
            </p>
          ) : (
            <p className="text-sm text-stone-500">SKU: {product.sku}</p>
          )}
          <h1 className="text-3xl font-bold text-stone-900">{product.name}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl font-bold text-emerald-900">
              {formatPrice(product.price)}
            </span>
            {product.compare_price != null &&
            product.compare_price > product.price ? (
              <span className="text-lg text-stone-400 line-through">
                {formatPrice(product.compare_price)}
              </span>
            ) : null}
            <StockBadge stock={product.stock} />
          </div>
          {product.description ? (
            <div className="max-w-none text-sm leading-relaxed text-stone-700">
              {isHtml ? (
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="whitespace-pre-wrap">{product.description}</p>
              )}
            </div>
          ) : (
            <p className="text-sm italic text-stone-400">
              [ No description placeholder ]
            </p>
          )}
          <ProductDetailActions product={product} imageUrl={imageUrl} />
        </div>
      </div>
    </main>
  );
}
