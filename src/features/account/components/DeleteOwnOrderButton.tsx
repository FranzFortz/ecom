"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";

export function DeleteOwnOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (
      !window.confirm(
        "Remove this order from your history? This cannot be undone."
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        window.alert(j.error ?? "Could not delete order");
        return;
      }
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
      Remove
    </Button>
  );
}
