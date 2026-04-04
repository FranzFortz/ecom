"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import type { Product } from "@/features/products/types";
import { cn } from "@/shared/lib/utils";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Mode = "create" | "edit";

export function AdminProductForm({
  mode,
  initial,
}: {
  mode: Mode;
  initial?: Product | null;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [price, setPrice] = useState(
    initial != null ? String(initial.price) : ""
  );
  const [comparePrice, setComparePrice] = useState(
    initial?.compare_price != null ? String(initial.compare_price) : ""
  );
  const [stock, setStock] = useState(
    initial != null ? String(initial.stock) : "0"
  );
  const [category, setCategory] = useState(initial?.category ?? "gadgets");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imagesText, setImagesText] = useState(
    initial?.images?.join("\n") ?? ""
  );
  const [variantsText, setVariantsText] = useState(
    initial?.variants != null
      ? JSON.stringify(initial.variants, null, 2)
      : ""
  );
  const [isFeatured, setIsFeatured] = useState(initial?.is_featured ?? false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const applySlugFromName = () => {
    if (name.trim()) setSlug(slugify(name));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const images = imagesText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      sku: sku.trim(),
      price: Number(price),
      compare_price: comparePrice.trim() === "" ? null : Number(comparePrice),
      stock: Number(stock),
      category: category.trim() || "gadgets",
      description: description.trim() || null,
      images,
      variants: variantsText.trim() === "" ? null : variantsText.trim(),
      is_featured: isFeatured,
    };

    try {
      if (mode === "create") {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = (await res.json()) as { error?: string; id?: string };
        if (!res.ok) {
          setError(json.error ?? "Save failed");
          return;
        }
        router.push(`/admin/products/${json.id}/edit`);
        router.refresh();
        return;
      }

      if (!initial?.id) {
        setError("Missing product id");
        return;
      }
      const res = await fetch(`/api/admin/products/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Update failed");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto max-w-2xl space-y-4 rounded-xl border border-stone-200 bg-white p-6"
    >
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-[200px] flex-1">
          <Input
            label="Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={applySlugFromName}>
          Slug from name
        </Button>
      </div>
      <Input
        label="Slug (URL)"
        name="slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="SKU" name="sku" value={sku} onChange={(e) => setSku(e.target.value)} required />
        <Input
          label="Category slug"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="gadgets"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          label="Price"
          name="price"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <Input
          label="Compare at (optional)"
          name="compare_price"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={comparePrice}
          onChange={(e) => setComparePrice(e.target.value)}
        />
        <Input
          label="Stock"
          name="stock"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-stone-800">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={cn(
            "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          )}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="images" className="text-sm font-medium text-stone-800">
          Image URLs (one per line)
        </label>
        <textarea
          id="images"
          name="images"
          rows={3}
          value={imagesText}
          onChange={(e) => setImagesText(e.target.value)}
          placeholder="https://..."
          className={cn(
            "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          )}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="variants" className="text-sm font-medium text-stone-800">
          Variants JSON (optional object)
        </label>
        <textarea
          id="variants"
          name="variants"
          rows={4}
          value={variantsText}
          onChange={(e) => setVariantsText(e.target.value)}
          className={cn(
            "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 font-mono text-xs text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          )}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-stone-800">
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-stone-300"
        />
        Featured on home
      </label>
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" isLoading={loading}>
        {mode === "create" ? "Create product" : "Save changes"}
      </Button>
    </form>
  );
}
