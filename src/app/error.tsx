// src/app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { SITE_NAME } from "@/shared/lib/site";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-medium text-red-600">Something went wrong</p>
      <h1 className="mt-2 text-2xl font-bold text-stone-900">Unexpected error</h1>
      <p className="mt-2 text-sm text-stone-600">
        Please try again or return to {SITE_NAME}.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className={cn(
            "inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-700 px-5 text-sm font-medium text-white hover:bg-emerald-800"
          )}
        >
          Try again
        </button>
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
