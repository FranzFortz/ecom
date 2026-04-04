// src/app/(info)/returns/page.tsx
import { SITE_NAME } from "@/shared/lib/site";

export default function ReturnsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Returns & refunds</h1>
      <p className="mt-2 text-sm text-stone-600">
        Policy summary for {SITE_NAME} (student demo).
      </p>
      <div className="mt-6 max-w-none text-sm text-stone-700">
        <h2 className="text-lg font-semibold text-stone-900">How to return</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5">
          <li>Email support within 14 days of delivery with your order ID.</li>
          <li>We send a return authorization and shipping instructions.</li>
          <li>Pack items in original condition with tags where applicable.</li>
          <li>Refund processed within 7–14 business days after we receive the return.</li>
        </ol>
        <h2 className="mt-8 text-lg font-semibold text-stone-900">Eligibility</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Items must be unused, unwashed, and in sellable condition.</li>
          <li>Hygiene-sealed goods may not be returnable once opened.</li>
          <li>Clearance items may be final sale — noted on the product page.</li>
        </ul>
        <h2 className="mt-8 text-lg font-semibold text-stone-900">Refunds</h2>
        <p className="mt-2">
          Refunds for approved returns go to the original payment path where
          possible (e.g. GCash reversal coordination). Cash-on-delivery refunds
          may be issued via store credit or bank transfer for this {SITE_NAME}{" "}
          demo.
        </p>
      </div>
    </main>
  );
}
