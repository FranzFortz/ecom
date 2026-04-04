// src/app/(info)/strategy/page.tsx
import { SITE_NAME } from "@/shared/lib/site";

export default function StrategyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Business strategy</h1>
      <p className="mt-2 text-sm text-stone-600">
        Coursework narrative for {SITE_NAME}.
      </p>
      <div className="mt-6 space-y-6 text-sm leading-relaxed text-stone-700">
        <section>
          <h2 className="text-lg font-semibold text-stone-900">Target market</h2>
          <p className="mt-2">
            {SITE_NAME} focuses on urban and suburban shoppers in the Philippines
            aged 22–45 who want trusted gadgets — phones, tablets, and accessories —
            with transparent pricing and flexible payment options including GCash
            and cash on delivery.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-stone-900">Business model</h2>
          <p className="mt-2">
            B2C e-commerce: curated catalog, owned merchandising story, and
            fulfillment via third-party logistics partners.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-stone-900">Revenue model</h2>
          <p className="mt-2">
            Gross merchandise value minus cost of goods sold, shipping
            subsidies, and payment fees. Long term: introduce private-label
            margin categories.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-stone-900">Pricing strategy</h2>
          <p className="mt-2">
            Competitive mid-market pricing with occasional compare-at anchors
            for featured items; free shipping threshold as a conversion lever.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-stone-900">Competitive positioning</h2>
          <p className="mt-2">
            “Trusted tech, local convenience” — {SITE_NAME} is not a generic
            marketplace, but a focused gadgets storefront with clear policies and
            modern checkout UX.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-stone-900">Marketing approach</h2>
          <p className="mt-2">
            Organic social (short-form video), SEO for product and category pages,
            and micro-influencer seeding in tech and student niches.
          </p>
        </section>
      </div>
    </main>
  );
}
