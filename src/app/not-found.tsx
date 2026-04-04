// src/app/not-found.tsx
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { SITE_NAME } from "@/shared/lib/site";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-medium text-stone-500">404</p>
      <h1 className="mt-2 text-2xl font-bold text-stone-900">Page not found</h1>
      <p className="mt-1 text-xs font-medium text-stone-500">{SITE_NAME}</p>
      <p className="mt-2 text-sm text-stone-600">
        That link may be broken or the page was removed.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className={cn(
            "inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-700 px-5 text-sm font-medium text-white hover:bg-emerald-800"
          )}
        >
          Home
        </Link>
        <Link
          href="/products"
          className={cn(
            "inline-flex min-h-11 items-center justify-center rounded-lg border border-stone-300 bg-stone-100 px-5 text-sm font-medium text-stone-800 hover:bg-stone-200"
          )}
        >
          Shop
        </Link>
      </div>
    </main>
  );
}
