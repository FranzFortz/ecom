"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";

const CONFIRM_PHRASE = "DELETE_ALL_ORDERS";

export function AdminClearOrdersButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClear() {
    if (
      !window.confirm(
        "Delete ALL orders for every customer? This cannot be undone."
      )
    ) {
      return;
    }
    const typed = window.prompt(
      `Type ${CONFIRM_PHRASE} to confirm clearing every order.`
    );
    if (typed !== CONFIRM_PHRASE) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: CONFIRM_PHRASE }),
      });
      if (!res.ok) {
        const j = (await res.json()) as { error?: string };
        window.alert(j.error ?? "Clear failed");
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
      onClick={() => void onClear()}
    >
      Clear all orders
    </Button>
  );
}
