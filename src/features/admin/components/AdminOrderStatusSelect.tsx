// src/features/admin/components/AdminOrderStatusSelect.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  isOrderStatus,
  type OrderStatus,
} from "@/shared/constants/order-status";
import { cn } from "@/shared/lib/utils";

function coerceStatus(s: string): OrderStatus {
  return isOrderStatus(s) ? s : "pending";
}

export function AdminOrderStatusSelect({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(() => coerceStatus(initialStatus));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(coerceStatus(initialStatus));
  }, [initialStatus]);

  async function onChange(next: string) {
    if (!isOrderStatus(next) || next === value) return;
    setSaving(true);
    try {
      const r = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const j = (await r.json().catch(() => ({}))) as { error?: string };
      if (!r.ok) {
        window.alert(j.error ?? "Update failed");
        return;
      }
      setValue(next);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={value}
      disabled={saving}
      aria-label="Order status"
      onChange={(e) => void onChange(e.target.value)}
      className={cn(
        "max-w-[140px] rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-900",
        "focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600",
        saving && "opacity-60"
      )}
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
