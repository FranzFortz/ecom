// src/features/cart/components/CartSummary.tsx
"use client";

import Link from "next/link";
import { useIsAdminSession } from "@/features/auth/hooks/useIsAdminSession";
import { useSupabaseAuth } from "@/features/auth/context/SupabaseAuthContext";
import { useCart } from "@/features/cart/context/CartContext";
import { cn } from "@/shared/lib/utils";
import { formatPrice } from "@/shared/lib/utils";

export function CartSummary() {
  const { subtotal, itemCount } = useCart();
  const { user } = useSupabaseAuth();
  const isAdmin = useIsAdminSession(user);
  const shippingLabel = "Free";
  const shippingAmount = 0;
  const total = subtotal + shippingAmount;

  return (
    <aside className="rounded-xl border-2 border-dashed border-stone-400 bg-stone-50 p-6">
      <h2 className="text-lg font-semibold text-stone-800">
        Order summary (placeholder)
      </h2>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping (est.)</dt>
          <dd>{shippingLabel}</dd>
        </div>
        <div className="flex justify-between border-t border-dashed border-stone-300 pt-2 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-stone-500">
        {itemCount} item{itemCount === 1 ? "" : "s"} — UI preview only until
        checkout is wired.
      </p>
      {isAdmin ? (
        <Link
          href="/admin/orders"
          className={cn(
            "mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-600 bg-slate-800 px-4 text-sm font-medium text-slate-100 hover:bg-slate-700"
          )}
        >
          Admins: manage orders in control center
        </Link>
      ) : (
        <Link
          href={
            user ? "/checkout" : "/auth/login?callbackUrl=%2Fcheckout"
          }
          className={cn(
            "mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          )}
        >
          {user ? "Proceed to checkout" : "Log in to checkout"}
        </Link>
      )}
    </aside>
  );
}
