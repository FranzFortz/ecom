// src/shared/components/ui/Accordion.tsx
"use client";

import { useId, useState } from "react";
import { cn } from "@/shared/lib/utils";

export type AccordionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-${item.id}-panel`;
        const headerId = `${baseId}-${item.id}-header`;
        return (
          <div
            key={item.id}
            className="rounded-lg border border-stone-200 bg-white"
          >
            <button
              type="button"
              id={headerId}
              className="flex min-h-11 w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-stone-900"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              {item.title}
              <span className="text-stone-500" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={cn(
                "border-t border-stone-100 px-4 text-sm text-stone-600",
                isOpen ? "block py-3" : "hidden"
              )}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
