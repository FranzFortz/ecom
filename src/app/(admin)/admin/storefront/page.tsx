import { StorefrontSettingsForm } from "@/features/admin/components/StorefrontSettingsForm";
import { getStorefrontSettings } from "@/shared/lib/storefront-settings";
import { SITE_NAME } from "@/shared/lib/site";

export const dynamic = "force-dynamic";

export default async function AdminStorefrontPage() {
  const settings = await getStorefrontSettings();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Storefront</h1>
      <p className="mt-1 max-w-2xl text-sm text-slate-600">
        Control copy and visibility for the {SITE_NAME} homepage. Product list content is still
        managed under{" "}
        <a href="/admin/products" className="font-medium text-emerald-700 hover:underline">
          Products
        </a>
        ; featured items use each product&apos;s <strong>Featured</strong> flag.
      </p>
      <div className="mt-8 max-w-3xl">
        <StorefrontSettingsForm initial={settings} />
      </div>
    </div>
  );
}
