// src/app/(info)/shipping/page.tsx
import { Card } from "@/shared/components/ui/Card";
import { SITE_NAME } from "@/shared/lib/site";

export default function ShippingPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Shipping</h1>
      <p className="mt-2 text-stone-600">
        How {SITE_NAME} gets orders from our partners to your door across the
        Philippines.
      </p>
      <div className="mt-8 space-y-6">
        <Card>
          <h2 className="font-semibold text-stone-900">Metro Manila & Luzon</h2>
          <p className="mt-2 text-sm text-stone-600">
            Typical delivery: 2–5 business days after payment confirmation.
            Courier partners include national 3PLs and local riders for last mile.
          </p>
        </Card>
        <Card>
          <h2 className="font-semibold text-stone-900">Visayas & Mindanao</h2>
          <p className="mt-2 text-sm text-stone-600">
            Typical delivery: 5–10 business days depending on island logistics
            and weather. Remote areas may require additional lead time.
          </p>
        </Card>
        <Card>
          <h2 className="font-semibold text-stone-900">International</h2>
          <p className="mt-2 text-sm text-stone-600">
            Student demo: international shipping is not enabled. Contact us for
            special arrangements.
          </p>
        </Card>
        <section className="text-sm text-stone-600">
          <h2 className="text-lg font-semibold text-stone-900">Fulfillment flow</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>Order placed and confirmed (pending payment verification for GCash / COD).</li>
            <li>Warehouse picks and packs within 1–2 business days.</li>
            <li>Handoff to courier; tracking reference issued when available.</li>
            <li>Delivery to your shipping address.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
