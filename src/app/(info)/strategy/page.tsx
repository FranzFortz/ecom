// src/app/(info)/strategy/page.tsx
export default function StrategyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Business strategy</h1>
      <div className="mt-6 space-y-6 text-sm leading-relaxed text-stone-700">
        <section>
          <h2 className="text-lg font-semibold text-stone-900">Target market</h2>
          <p className="mt-2">
            Urban and suburban shoppers in the Philippines aged 22–45 who value
            transparent pricing, local design touches, and flexible payment
            options including GCash and cash on delivery.
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
            “Thoughtful Filipino retail” — not the cheapest marketplace, but
            trustworthy copy, clear policies, and modern checkout UX.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-stone-900">Marketing approach</h2>
          <p className="mt-2">
            Organic social (short-form video), SEO for category pages, and
            micro-influencer seeding in fashion and home niches.
          </p>
        </section>
      </div>
    </main>
  );
}
