// src/features/products/components/SearchBar.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { Input } from "@/shared/components/ui/Input";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("search") ?? "");
  const [isPending, startTransition] = useTransition();

  const apply = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }
      startTransition(() => {
        router.push(`/products?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  return (
    <form
      className="w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        apply(q);
      }}
    >
      <Input
        label="Search products"
        name="search"
        placeholder="Search by name…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        disabled={isPending}
      />
    </form>
  );
}
