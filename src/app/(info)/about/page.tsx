// src/app/(info)/about/page.tsx
import Link from "next/link";
import { SITE_NAME } from "@/shared/lib/site";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">About {SITE_NAME}</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-stone-700">
        <p>
          {SITE_NAME} is a student-built e-commerce demo focused on phones,
          tablets, and tech accessories for everyday life in the Philippines —
          transparent pricing, honest stock status, and familiar payment
          options in this prototype.
        </p>
        <p>
          <strong className="text-stone-900">Mission:</strong> make it easy to
          discover quality products with transparent pricing, honest stock
          status, and payment options that work in the Philippines (GCash, cash
          on delivery, and card on delivery in this prototype).
        </p>
        <h2 className="pt-4 text-lg font-semibold text-stone-900">Our team</h2>
        <p>
          Fictional roster for coursework: <em>Operations — Ana Reyes</em>,{" "}
          <em>Merchandising — Marco Santos</em>, <em>Support — Jamie Cruz</em>.
        </p>
        <p className="pt-2">
          <Link href="/strategy" className="font-medium text-emerald-800 hover:underline">
            Read our business strategy →
          </Link>
        </p>
      </div>
    </main>
  );
}
