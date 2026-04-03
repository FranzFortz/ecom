// src/app/(info)/analytics/page.tsx
import { Card } from "@/shared/components/ui/Card";

const kpis = [
  {
    name: "Conversion rate",
    value: "2.4%",
    note: "Share of sessions that complete checkout — benchmark for funnel tuning.",
  },
  {
    name: "Bounce rate",
    value: "38%",
    note: "Single-page sessions; lower is usually better for landing pages.",
  },
  {
    name: "CAC",
    value: "₱120",
    note: "Customer acquisition cost — ad spend divided by new buyers (illustrative).",
  },
  {
    name: "LTV",
    value: "₱2,800",
    note: "Lifetime value — projected revenue per customer over 24 months (mock).",
  },
];

export default function AnalyticsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Analytics & KPIs</h1>
      <p className="mt-2 text-sm text-stone-600">
        Static mock dashboard for coursework — numbers are not live data.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {kpis.map((k) => (
          <Card key={k.name}>
            <p className="text-xs font-medium uppercase text-stone-500">{k.name}</p>
            <p className="mt-2 text-3xl font-bold text-emerald-900">{k.value}</p>
            <p className="mt-2 text-sm text-stone-600">{k.note}</p>
          </Card>
        ))}
      </div>
      <section className="mt-10 rounded-xl border border-stone-200 bg-stone-50 p-6">
        <h2 className="font-semibold text-stone-900">Growth plan (mock)</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-700">
          <li>Expand same-day metro fulfillment with additional courier slots.</li>
          <li>Launch loyalty points redeemable on shipping or accessories.</li>
          <li>A/B test checkout payment labels to lift GCash vs COD mix.</li>
        </ul>
      </section>
    </main>
  );
}
