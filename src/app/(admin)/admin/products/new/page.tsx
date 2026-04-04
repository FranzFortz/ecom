import { AdminProductForm } from "@/features/admin/components/AdminProductForm";

export const dynamic = "force-dynamic";

export default function AdminNewProductPage() {
  return (
    <main>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Catalog</p>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">New product</h1>
      <p className="mt-1 text-sm text-slate-600">
        Slug must be unique. Use category{" "}
        <code className="rounded bg-slate-100 px-1 text-xs">gadgets</code> to match storefront filters.
        Toggle <strong>Featured</strong> so it appears in the homepage grid.
      </p>
      <div className="mt-8">
        <AdminProductForm mode="create" />
      </div>
    </main>
  );
}
