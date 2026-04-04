"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (
      !window.confirm(
        `Delete “${productName}”? Wishlist rows referencing this product will be removed.`
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        window.alert(j.error ?? "Delete failed");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      window.alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="danger"
      size="sm"
      isLoading={loading}
      onClick={() => void onDelete()}
    >
      Delete
    </Button>
  );
}
