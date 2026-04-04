// src/app/(info)/tracking/page.tsx
import { TrackingLookup } from "@/features/info/components/TrackingLookup";
import { SITE_NAME } from "@/shared/lib/site";

export default function TrackingPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Track your order</h1>
      <p className="mt-2 text-sm text-stone-600">
        {SITE_NAME} demo: enter any text to see a sample status timeline. Real
        tracking would query your order in the database.
      </p>
      <div className="mt-8">
        <TrackingLookup />
      </div>
    </main>
  );
}
