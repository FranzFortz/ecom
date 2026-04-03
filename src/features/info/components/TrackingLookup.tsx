// src/features/info/components/TrackingLookup.tsx
"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Card } from "@/shared/components/ui/Card";

const MOCK_STEPS = [
  { label: "Order placed", done: true },
  { label: "Processing", done: true },
  { label: "Shipped", done: true },
  { label: "Out for delivery", done: false },
  { label: "Delivered", done: false },
];

export function TrackingLookup() {
  const [orderId, setOrderId] = useState("");
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-6">
      <form
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          if (orderId.trim()) setShow(true);
        }}
      >
        <div className="flex-1">
          <Input
            label="Order ID"
            name="orderId"
            placeholder="Paste your order UUID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
        </div>
        <Button type="submit">Track (demo)</Button>
      </form>
      {show ? (
        <Card>
          <p className="text-xs font-medium uppercase text-stone-500">
            Mock timeline — not connected to live logistics
          </p>
          <ul className="mt-4 space-y-3">
            {MOCK_STEPS.map((s) => (
              <li
                key={s.label}
                className="flex items-center gap-3 text-sm text-stone-700"
              >
                <span
                  className={
                    s.done
                      ? "text-emerald-600"
                      : "text-stone-300"
                  }
                  aria-hidden
                >
                  {s.done ? "●" : "○"}
                </span>
                {s.label}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
