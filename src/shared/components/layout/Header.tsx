// src/shared/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useCart } from "@/features/cart/context/CartContext";
import { Button } from "@/shared/components/ui/Button";
import { MobileNav } from "@/shared/components/layout/MobileNav";

const navLinks = [
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/strategy", label: "Strategy" },
  { href: "/analytics", label: "Analytics" },
];

export function Header() {
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-stone-800 md:hidden"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <span className="text-xl">☰</span>
            </button>
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-emerald-800"
            >
              BayanMart
            </Link>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-stone-700 hover:text-emerald-800"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-stone-800 hover:bg-stone-100"
              aria-label={`Cart, ${itemCount} items`}
            >
              <span className="text-lg">🛒</span>
              {itemCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-700 px-1 text-xs text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
            </Link>
            {session?.user ? (
              <>
                <Link href="/account" className="hidden sm:block">
                  <Button type="button" variant="ghost" size="sm">
                    Account
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Log out
                </Button>
              </>
            ) : (
              <Link href="/auth/login">
                <Button type="button" size="sm">
                  Log in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
