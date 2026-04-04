// src/features/notifications/components/AdminNotificationBell.tsx
"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";

type Item = {
  id: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
};

export function AdminNotificationBell() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async () => {
    const r = await fetch("/api/admin/notifications?limit=40");
    if (!r.ok) return;
    const j = (await r.json()) as { items?: Item[]; unreadCount?: number };
    setItems(j.items ?? []);
    setUnread(typeof j.unreadCount === "number" ? j.unreadCount : 0);
  }, []);

  useEffect(() => {
    if (!pathname.startsWith("/admin")) return;
    void load();
    const id = window.setInterval(() => void load(), 12000);
    return () => window.clearInterval(id);
  }, [pathname, load]);

  async function markRead(nid: string) {
    await fetch(`/api/admin/notifications/${nid}`, { method: "PATCH" });
    void load();
  }

  if (!pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed right-3 top-14 z-[55] md:right-6 md:top-5">
      <button
        type="button"
        className="relative inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-600 bg-slate-800 text-lg text-slate-100 shadow-md hover:bg-slate-700"
        aria-label={`Admin notifications${unread ? `, ${unread} unread` : ""}`}
        onClick={() => {
          setOpen((o) => !o);
          if (!open) void load();
        }}
      >
        <span aria-hidden>🔔</span>
        {unread > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-xs font-bold text-slate-950">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-black/30"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              "absolute right-0 top-full z-50 mt-2 w-[min(100vw-1.5rem,340px)] rounded-xl border border-slate-600 bg-slate-900 py-2 shadow-xl"
            )}
          >
            <p className="border-b border-slate-700 px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Store activity
            </p>
            <ul className="max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-slate-500">No messages yet.</li>
              ) : (
                items.map((n) => (
                  <li
                    key={n.id}
                    className={cn(
                      "border-b border-slate-800 px-3 py-2.5 last:border-0",
                      !n.read_at && "bg-slate-800/80"
                    )}
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => {
                        if (!n.read_at) void markRead(n.id);
                      }}
                    >
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      {n.body ? (
                        <p className="mt-0.5 text-xs text-slate-400">{n.body}</p>
                      ) : null}
                      <p className="mt-1 text-[10px] text-slate-500">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
