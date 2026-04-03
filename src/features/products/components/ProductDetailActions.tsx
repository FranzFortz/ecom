// src/features/products/components/ProductDetailActions.tsx
"use client";

import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import { useCart } from "@/features/cart/context/CartContext";
import type { Product, ProductVariants } from "@/features/products/types";
import { ProductVariantSelector } from "@/features/products/components/ProductVariantSelector";
import { Button } from "@/shared/components/ui/Button";

export function ProductDetailActions({
  product,
  imageUrl,
}: {
  product: Product;
  imageUrl: string;
}) {
  const { addItem } = useCart();
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState<{ size?: string; color?: string }>({});
  const [toast, setToast] = useState<string | null>(null);

  const variants = product.variants as ProductVariants | null;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2800);
  }, []);

  const maxQty = Math.max(1, product.stock);

  const handleAddToCart = () => {
    if (product.stock < 1) return;
    const q = Math.min(quantity, maxQty);
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: imageUrl,
      price: product.price,
      quantity: q,
      variant:
        variant.size || variant.color
          ? { size: variant.size, color: variant.color }
          : undefined,
    });
    showToast("Added to cart");
  };

  const handleWishlist = async () => {
    if (!session?.user) return;
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        showToast(j.error ?? "Could not save wishlist");
        return;
      }
      showToast("Saved to wishlist");
    } catch {
      showToast("Network error");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {variants && (variants.size?.length || variants.color?.length) ? (
        <ProductVariantSelector variants={variants} onChange={setVariant} />
      ) : null}

      <div>
        <p className="mb-2 text-sm font-medium text-stone-600">Quantity</p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            −
          </Button>
          <span className="min-w-8 text-center font-medium">{quantity}</span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            aria-label="Increase quantity"
            disabled={quantity >= maxQty || product.stock < 1}
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
          >
            +
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          className="sm:min-w-[160px]"
          disabled={product.stock < 1}
          onClick={handleAddToCart}
        >
          Add to cart
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={!session?.user}
          title={session?.user ? undefined : "Log in to save items"}
          onClick={() => void handleWishlist()}
        >
          Add to wishlist
        </Button>
      </div>

      {toast ? (
        <div
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border-2 border-dashed border-stone-400 bg-white px-4 py-2 text-sm text-stone-700 shadow-lg"
          role="status"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
