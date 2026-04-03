// src/app/(store)/products/[slug]/not-found.tsx
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

export default function ProductNotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-16 text-center">
      <p className="text-sm font-medium text-stone-500">Product</p>
      <h1 className="mt-2 text-2xl font-bold text-stone-900">
        Product not found
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        This slug is not in the catalog. Check the URL or browse the shop.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/products"
          className={cn(
            "inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-700 px-5 text-sm font-medium text-white hover:bg-emerald-800"
          )}
        >
          All products
        </Link>
        <Link
          href="/"
          className={cn(
            "inline-flex min-h-11 items-center justify-center rounded-lg border border-stone-300 bg-stone-100 px-5 text-sm font-medium text-stone-800 hover:bg-stone-200"
          )}
        >
          Home
        </Link>
      </div>
    </main>
  );
}
