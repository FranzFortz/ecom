// src/features/products/components/CatalogSearchBar.tsx
"use client";

import { Suspense } from "react";
import { SearchBar } from "@/features/products/components/SearchBar";

function SearchFallback() {
  return (
    <div
      className="h-24 w-full max-w-md rounded-lg border-2 border-dashed border-stone-300 bg-stone-50"
      aria-hidden
    >
      <p className="p-4 text-xs text-stone-500">[ Search bar loading… ]</p>
    </div>
  );
}

export function CatalogSearchBar() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchBar />
    </Suspense>
  );
}
