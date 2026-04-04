// src/features/notifications/components/CustomerNotificationBell.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSupabaseAuth } from "@/features/auth/context/SupabaseAuthContext";
import { createSupabaseBrowserClient } from "@/shared/lib/supabase/browser";
import { cn } from "@/shared/lib/utils";

type Item = {
  id: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
};

export function CustomerNotificationBell() {
  const { user } = useSupabaseAuth();
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [unread, setUnread] = useState(0);
  const [miniToast, setMiniToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    const r = await fetch("/api/notifications");
    if (!r.ok) return;
    const j = (await r.json()) as { items?: Item[]; unreadCount?: number };
    setItems(j.items ?? []);
    setUnread(typeof j.unreadCount === "number" ? j.unreadCount : 0);
  }, []);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setUnread(0);
      return;
    }
    void load();
  }, [user, load]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`notifications-user-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const row = payload.new as { title?: string };
          if (row.title) {
            setMiniToast(row.title);
            window.setTimeout(() => setMiniToast(null), 5000);
          }
          void load();
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user?.id, supabase, load, router]);

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    void load();
  }

  if (!user) return null;

  return (
    <div className="relative">
      {miniToast ? (
        <div className="fixed bottom-4 left-1/2 z-[70] max-w-sm -translate-x-1/2 rounded-lg bg-stone-900 px-4 py-2 text-center text-sm text-white shadow-lg sm:left-auto sm:right-4 sm:translate-x-0">
          {miniToast}
        </div>
      ) : null}
      <button
        type="button"
        className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-stone-800 hover:bg-stone-100"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        onClick={() => {
          setOpen((o) => !o);
          if (!open) void load();
        }}
      >
        <span className="text-lg" aria-hidden>
          🔔
        </span>
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1 text-xs text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-black/20 md:bg-transparent"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              "absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,320px)] rounded-xl border border-stone-200 bg-white py-2 shadow-lg"
            )}
          >
            <div className="border-b border-stone-100 px-3 pb-2 pt-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                Notifications
              </p>
            </div>
            <ul className="max-h-72 overflow-y-auto">
              {items.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-stone-500">No updates yet.</li>
              ) : (
                items.map((n) => (
                  <li
                    key={n.id}
                    className={cn(
                      "border-b border-stone-50 px-3 py-2.5 last:border-0",
                      !n.read_at && "bg-emerald-50/40"
                    )}
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => {
                        if (!n.read_at) void markRead(n.id);
                      }}
                    >
                      <p className="text-sm font-medium text-stone-900">{n.title}</p>
                      {n.body ? (
                        <p className="mt-0.5 text-xs text-stone-600">{n.body}</p>
                      ) : null}
                      <p className="mt-1 text-[10px] text-stone-400">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </button>
                  </li>
                ))
              )}
            </ul>
            <div className="border-t border-stone-100 px-3 py-2">
              <Link
                href="/account/orders"
                className="text-xs font-medium text-emerald-800 hover:underline"
                onClick={() => setOpen(false)}
              >
                View order history →
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
