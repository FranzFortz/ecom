"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";

export function AdminOrderDeleteButton({
  orderId,
  label,
}: {
  orderId: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onDelete() {
    if (
      !window.confirm(
        `Delete order ${orderId.slice(0, 8)}…? This cannot be undone.`
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        window.alert(j.error ?? "Delete failed");
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
      {label ?? "Delete"}
    </Button>
  );
}
