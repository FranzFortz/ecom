// src/app/(info)/about/page.tsx
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">About BayanMart</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-stone-700">
        <p>
          BayanMart is a student-built e-commerce demo celebrating Filipino
          makers and practical goods for everyday life — from barong-inspired
          apparel to home accents and reliable electronics.
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
