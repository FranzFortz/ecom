import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminRealtimeBridge } from "@/features/admin/components/AdminRealtimeBridge";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { AdminNotificationBell } from "@/features/notifications/components/AdminNotificationBell";
import { ADMIN_NAV_LINKS } from "@/shared/lib/admin-nav";
import { isAdminEmail } from "@/shared/lib/admin";
import { isSupabaseServiceRoleConfigured } from "@/shared/lib/supabase/service";
import { getServerSupabaseUser } from "@/shared/lib/supabase/server-user";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerSupabaseUser();
  if (!user?.email) {
    redirect("/auth/login?callbackUrl=%2Fadmin");
  }
  if (!isAdminEmail(user.email)) {
    redirect("/admin-denied");
  }

  const serviceOk = isSupabaseServiceRoleConfigured();

  return (
    <div className="flex min-h-screen bg-slate-950">
      <aside className="hidden w-60 shrink-0 md:block lg:w-64">
        <AdminSidebar userEmail={user.email} />
      </aside>
      <div className="flex min-h-screen flex-1 flex-col bg-slate-100">
        <header className="border-b border-slate-200 bg-white md:hidden">
          <div className="px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Admin
            </p>
            <p className="truncate text-sm font-medium text-slate-900">{user.email}</p>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-2 py-2 text-sm">
            {ADMIN_NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="shrink-0 rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </header>
        {!serviceOk ? (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <strong className="font-semibold">Limited mode:</strong> add{" "}
            <code className="rounded bg-amber-100 px-1 text-xs">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
            to <code className="rounded bg-amber-100 px-1 text-xs">.env.local</code> for product
            writes and storefront save.
          </div>
        ) : null}
        <AdminNotificationBell />
        <AdminRealtimeBridge />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
