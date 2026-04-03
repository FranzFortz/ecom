// src/features/products/components/ProductVariantSelector.tsx
"use client";

import { useEffect, useState } from "react";
import type { ProductVariants } from "@/features/products/types";
import { cn } from "@/shared/lib/utils";

export function ProductVariantSelector({
  variants,
  onChange,
}: {
  variants: ProductVariants | null;
  onChange: (selected: { size?: string; color?: string }) => void;
}) {
  const sizes = variants?.size ?? [];
  const colors = variants?.color ?? [];
  const [size, setSize] = useState<string | undefined>(sizes[0]);
  const [color, setColor] = useState<string | undefined>(colors[0]);

  useEffect(() => {
    onChange({ size: sizes[0], color: colors[0] });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync initial variant once
  }, []);

  const notify = (next: { size?: string; color?: string }) => {
    onChange(next);
  };

  if (sizes.length === 0 && colors.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {sizes.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-medium text-stone-800">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s);
                  notify({ size: s, color });
                }}
                className={cn(
                  "min-h-11 min-w-11 rounded-lg border px-3 text-sm font-medium",
                  size === s
                    ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                    : "border-stone-300 text-stone-700 hover:border-stone-400"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {colors.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-medium text-stone-800">Color</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  notify({ size, color: c });
                }}
                className={cn(
                  "min-h-11 rounded-lg border px-3 text-sm font-medium",
                  color === c
                    ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                    : "border-stone-300 text-stone-700 hover:border-stone-400"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
