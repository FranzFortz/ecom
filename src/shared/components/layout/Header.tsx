// src/shared/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useIsAdminSession } from "@/features/auth/hooks/useIsAdminSession";
import { useSupabaseAuth } from "@/features/auth/context/SupabaseAuthContext";
import { useCart } from "@/features/cart/context/CartContext";
import { createSupabaseBrowserClient } from "@/shared/lib/supabase/browser";
import { Button } from "@/shared/components/ui/Button";
import { MobileNav } from "@/shared/components/layout/MobileNav";
import { SITE_NAME } from "@/shared/lib/site";
import { STORE_NAV_LINKS } from "@/shared/lib/store-nav";
import { CustomerNotificationBell } from "@/features/notifications/components/CustomerNotificationBell";

export function Header() {
  const router = useRouter();
  const { user } = useSupabaseAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = useIsAdminSession(user);

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  return (
    <>
      <div className="sticky top-0 z-30">
        {isAdmin ? (
          <div className="border-b border-slate-800 bg-slate-900 px-4 py-2 text-center text-xs text-slate-100 sm:text-sm">
            <span className="text-slate-400">Admin · live site preview · </span>
            <Link
              href="/admin"
              className="font-semibold text-emerald-300 underline-offset-2 hover:underline"
            >
              Return to control center
            </Link>
          </div>
        ) : null}
        <header className="border-b border-stone-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-stone-800 md:hidden"
                aria-label="Open menu"
                onClick={() => setMenuOpen(true)}
              >
                <span className="text-xl">☰</span>
              </button>
              <Link
                href="/"
                className="truncate text-lg font-semibold tracking-tight text-emerald-800"
              >
                {SITE_NAME}
              </Link>
            </div>
            <nav className="hidden items-center gap-6 md:flex" aria-label="Store">
              {STORE_NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium text-stone-700 hover:text-emerald-800"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-2">
              {user ? <CustomerNotificationBell /> : null}
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="hidden rounded-lg border border-slate-700 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-slate-200 sm:inline-flex sm:min-h-9 sm:items-center"
                >
                  Control center
                </Link>
              ) : null}
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
              {user ? (
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
                    onClick={() => void handleSignOut()}
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
      </div>
      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        showAdminLink={isAdmin}
      />
    </>
  );
}
