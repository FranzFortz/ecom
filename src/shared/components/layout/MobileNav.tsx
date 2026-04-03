// src/shared/components/layout/MobileNav.tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { cn } from "@/shared/lib/utils";

const links = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/strategy", label: "Strategy" },
  { href: "/analytics", label: "Analytics" },
];

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
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
        <nav className="flex flex-col gap-1 p-4 pt-16">
          {links.map((l) => (
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
