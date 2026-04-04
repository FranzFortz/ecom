import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminProductForm } from "@/features/admin/components/AdminProductForm";
import { createSupabaseAnonClient } from "@/shared/lib/supabase/public";
import type { Product } from "@/features/products/types";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function AdminEditProductPage({ params }: Props) {
  const supabase = createSupabaseAnonClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const product = data as Product;

  return (
    <main>
      <p className="mb-4 text-sm">
        <Link href="/admin/products" className="font-medium text-emerald-700 hover:underline">
          ← Back to products
        </Link>
      </p>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Catalog</p>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit product</h1>
      <p className="mt-1 font-mono text-xs text-slate-500">{product.id}</p>
      <div className="mt-8">
        <AdminProductForm mode="edit" initial={product} />
      </div>
    </main>
  );
}
