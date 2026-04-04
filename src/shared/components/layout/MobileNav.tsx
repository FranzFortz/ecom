// src/shared/components/layout/MobileNav.tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import { STORE_NAV_LINKS } from "@/shared/lib/store-nav";

export function MobileNav({
  open,
  onClose,
  showAdminLink = false,
}: {
  open: boolean;
  onClose: () => void;
  showAdminLink?: boolean;
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!open}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[min(100%,320px)] bg-white shadow-xl transition-transform md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!open}
      >
        <nav className="flex flex-col gap-1 p-4 pt-16" aria-label="Mobile store menu">
          {showAdminLink ? (
            <Link
              href="/admin"
              className="min-h-11 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-emerald-300 hover:bg-slate-800"
              onClick={onClose}
            >
              Control center
            </Link>
          ) : null}
          {STORE_NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="min-h-11 rounded-lg px-3 py-2 text-stone-800 hover:bg-stone-100"
              onClick={onClose}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
