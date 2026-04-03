// src/app/(info)/contact/page.tsx
import { ContactForm } from "@/features/info/components/ContactForm";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Contact</h1>
      <p className="mt-2 text-sm text-stone-600">
        Questions about orders, returns, or partnerships? Reach out below.
      </p>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-semibold text-stone-900">Store details</h2>
          <p className="mt-3 text-sm text-stone-700">
            Email:{" "}
            <a
              href="mailto:hello@bayanmart.demo"
              className="text-emerald-800 hover:underline"
            >
              hello@bayanmart.demo
            </a>
          </p>
          <p className="mt-2 text-sm text-stone-700">
            Hours: Mon–Sat 9:00–18:00 (PHT), closed Sundays.
          </p>
          <p className="mt-2 text-sm text-stone-500">
            This is a demo inbox — messages from the form are not emailed.
          </p>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
