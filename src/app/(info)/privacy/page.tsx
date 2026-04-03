// src/app/(info)/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Privacy policy</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-stone-700">
        <p>
          BayanMart (demo) explains how we handle personal data for this student
          project. A production store would align with the Philippines Data
          Privacy Act and publish a DPO contact.
        </p>
        <h2 className="text-lg font-semibold text-stone-900">What we collect</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Account identifiers (email, name) via Supabase Auth.</li>
          <li>Order details: shipping address, cart snapshot, payment method choice.</li>
          <li>Technical logs typical of hosting providers (e.g. Vercel).</li>
        </ul>
        <h2 className="text-lg font-semibold text-stone-900">How we use data</h2>
        <p>
          To fulfill orders, prevent fraud, improve the storefront, and comply
          with law. We do not sell personal data in this demo.
        </p>
        <h2 className="text-lg font-semibold text-stone-900">Retention</h2>
        <p>
          Order records may be kept for accounting and dispute resolution.
          Contact the course instructor for deletion requests in a classroom
          deployment.
        </p>
      </div>
    </main>
  );
}
