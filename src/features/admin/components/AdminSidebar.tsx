"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { ADMIN_NAV_LINKS } from "@/shared/lib/admin-nav";
import { SITE_NAME } from "@/shared/lib/site";

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col border-r border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 px-4 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {SITE_NAME}
        </p>
        <p className="mt-1 text-lg font-bold tracking-tight text-white">Control center</p>
        <p className="mt-2 truncate text-xs text-slate-400" title={userEmail}>
          {userEmail}
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {ADMIN_NAV_LINKS.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-emerald-600/20 text-emerald-300 ring-1 ring-emerald-500/40"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <span className="w-5 text-center text-base opacity-80" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-3">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-800"
        >
          ← View live site
        </Link>
      </div>
    </div>
  );
}
