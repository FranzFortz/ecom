import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { mapProductRow } from "@/features/products/hooks/useProducts";
import { DeleteProductButton } from "@/features/admin/components/DeleteProductButton";
import type { Product } from "@/features/products/types";
import { fetchProductRowsPaginated } from "@/shared/lib/supabase/products-paginated";
import { createSupabaseAnonClient } from "@/shared/lib/supabase/public";
import {
  createSupabaseServiceClient,
  isSupabaseServiceRoleConfigured,
} from "@/shared/lib/supabase/service";
import { formatPrice } from "@/shared/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  noStore();
  let products: Product[] = [];
  let listError: Error | null = null;
  try {
    const supabase = isSupabaseServiceRoleConfigured()
      ? createSupabaseServiceClient()
      : createSupabaseAnonClient();
    const { rows, error } = await fetchProductRowsPaginated(supabase);
    listError = error;
    products = rows.map((row) => mapProductRow(row));
  } catch (e) {
    listError = e instanceof Error ? e : new Error("Failed to load products");
  }

  return (
    <main>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Catalog control
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-600">
            Full CRUD — the live site reads this table. Use <strong>Featured</strong> to
            surface items on the homepage.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          + Add product
        </Link>
      </div>

      {listError ? (
        <p className="mt-6 text-sm text-red-600">{listError.message}</p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-900 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Name
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Slug
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  SKU
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Price
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Stock
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No products yet. Run seed.sql or add one.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{p.slug}</td>
                    <td className="px-4 py-3 text-slate-600">{p.sku}</td>
                    <td className="px-4 py-3">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/products/${p.slug}`}
                          className="text-emerald-800 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </Link>
                        <span className="text-stone-300">|</span>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="text-emerald-800 hover:underline"
                        >
                          Edit
                        </Link>
                        <span className="text-stone-300">|</span>
                        <DeleteProductButton productId={p.id} productName={p.name} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
