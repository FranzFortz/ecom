import Link from "next/link";
import { createSupabaseAnonClient } from "@/shared/lib/supabase/public";
import {
  createSupabaseServiceClient,
  isSupabaseServiceRoleConfigured,
} from "@/shared/lib/supabase/service";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let productCount = 0;
  let orderCount: number | null = null;
  try {
    if (isSupabaseServiceRoleConfigured()) {
      const supabase = createSupabaseServiceClient();
      const [prodRes, ordRes] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
      ]);
      productCount = prodRes.count ?? 0;
      orderCount = ordRes.count ?? 0;
    } else {
      const anon = createSupabaseAnonClient();
      const { count } = await anon
        .from("products")
        .select("*", { count: "exact", head: true });
      productCount = count ?? 0;
    }
  } catch {
    productCount = 0;
    orderCount = null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">
        You have full control of the catalog and what visitors see on the homepage.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Link
          href="/admin/products"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:border-emerald-300 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Catalog
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{productCount}</p>
          <p className="mt-1 text-sm text-slate-600">Products live in the store</p>
          <p className="mt-4 text-sm font-medium text-emerald-700">Manage products →</p>
        </Link>
        <Link
          href="/admin/orders"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:border-emerald-300 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Orders
          </p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {orderCount === null ? "—" : orderCount}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {orderCount === null
              ? "Add service role key for full order counts"
              : "Customer checkouts"}
          </p>
          <p className="mt-4 text-sm font-medium text-emerald-700">View orders →</p>
        </Link>
        <Link
          href="/admin/storefront"
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:border-emerald-300 hover:shadow-md"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Storefront
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">Homepage content</p>
          <p className="mt-1 text-sm text-slate-600">
            Hero, announcement, sections, and value strip visibility
          </p>
          <p className="mt-4 text-sm font-medium text-emerald-700">Edit appearance →</p>
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 hover:border-slate-400"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Preview
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-900">Open live site</p>
          <p className="mt-1 text-sm text-slate-600">See the storefront as customers do</p>
          <p className="mt-4 text-sm font-medium text-slate-700">Go to homepage →</p>
        </Link>
      </div>
    </div>
  );
}
