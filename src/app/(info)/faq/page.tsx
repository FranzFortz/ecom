// src/app/(info)/faq/page.tsx
import { Accordion } from "@/shared/components/ui/Accordion";

const items = [
  {
    id: "ship-time",
    title: "How long does shipping take?",
    content:
      "Metro Manila and Luzon: about 2–5 business days after confirmation. Visayas and Mindanao: 5–10 business days depending on location.",
  },
  {
    id: "ship-cost",
    title: "How much is shipping?",
    content:
      "This demo shows free shipping on the cart summary. Real projects should tie rates to weight, zone, and promos.",
  },
  {
    id: "returns-window",
    title: "What is the return window?",
    content:
      "Contact us within 14 days of delivery. Items should be unused and in original packaging where possible.",
  },
  {
    id: "gcash",
    title: "How do I pay with GCash?",
    content:
      "Select GCash at checkout. In this student build, the order is saved as pending for manual verification — no live GCash API.",
  },
  {
    id: "cod",
    title: "Do you offer cash on delivery?",
    content:
      "Yes. Choose “Cash on delivery” at checkout. Have exact change ready for the courier when possible.",
  },
  {
    id: "card-delivery",
    title: "What does “card on delivery” mean?",
    content:
      "You can pay with a debit or credit card when the courier arrives — no online card capture in this demo.",
  },
  {
    id: "account",
    title: "Why do I need an account?",
    content:
      "Accounts let you save a wishlist, view order history, and speed through checkout with saved shipping details.",
  },
  {
    id: "track",
    title: "Where is my tracking number?",
    content:
      "When carriers provide a reference, it appears on your order confirmation email (simulated in this project). Use the Tracking page for a mock timeline.",
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">FAQ</h1>
      <p className="mt-2 text-sm text-stone-600">
        Shipping, returns, payments, and account questions.
      </p>
      <div className="mt-8">
        <Accordion items={items} />
      </div>
    </main>
  );
}
