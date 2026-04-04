// src/features/admin/components/AdminRealtimeBridge.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/shared/lib/supabase/browser";

type Toast = { id: number; message: string };

/**
 * Products: Realtime postgres_changes (table on `supabase_realtime`).
 * New customer activity: poll newest `admin_notifications` row (browser cannot
 * subscribe to that table under RLS).
 */
export function AdminRealtimeBridge() {
  const router = useRouter();
  const pathname = usePathname();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const lastCreatedAtRef = useRef<string | null>(null);

  const pushToast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 7000);
  }, []);

  useEffect(() => {
    if (!pathname.startsWith("/admin")) return;

    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel("admin-catalog")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          const name =
            (payload.new as { name?: string } | null)?.name ??
            (payload.old as { name?: string } | null)?.name ??
            "";
          if (payload.eventType === "INSERT") {
            pushToast(`Catalog · New product${name ? ` · ${name}` : ""}`);
          } else if (payload.eventType === "UPDATE") {
            pushToast(`Catalog · Updated${name ? ` · ${name}` : ""}`);
          } else if (payload.eventType === "DELETE") {
            pushToast("Catalog · Product removed");
          }
          if (pathname.startsWith("/admin/products")) {
            router.refresh();
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [pathname, router, pushToast]);

  useEffect(() => {
    if (!pathname.startsWith("/admin")) return;

    const tick = async () => {
      try {
        const r = await fetch("/api/admin/notifications?limit=1");
        if (!r.ok) return;
        const j = (await r.json()) as {
          items?: {
            id: string;
            read_at: string | null;
            title: string;
            created_at: string;
          }[];
        };
        const head = j.items?.[0];
        if (!head?.created_at) return;

        const prev = lastCreatedAtRef.current;
        if (prev != null && head.created_at > prev) {
          pushToast(head.title);
          if (pathname.startsWith("/admin/orders")) {
            router.refresh();
          }
        }
        lastCreatedAtRef.current = head.created_at;
      } catch {
        /* ignore */
      }
    };

    void tick();
    const id = window.setInterval(tick, 6000);
    return () => window.clearInterval(id);
  }, [pathname, router, pushToast]);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[60] flex max-w-sm flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-sm text-white shadow-lg"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
