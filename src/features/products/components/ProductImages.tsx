// src/features/products/components/ProductImages.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductImages({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const list = images.length > 0 ? images : ["https://placehold.co/800x800/e2e8f0/64748b?text=Product"];
  const [main, setMain] = useState(list[0]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-stone-100">
        <Image
          src={main}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width:1024px) 100vw, 50vw"
          priority
        />
      </div>
      {list.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {list.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setMain(src)}
              className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 ${
                main === src ? "border-emerald-700" : "border-transparent"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
