// src/app/(info)/terms/page.tsx
import { SITE_NAME } from "@/shared/lib/site";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-900">Terms of service</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-stone-700">
        <p>
          These terms govern use of the {SITE_NAME} demonstration website. They
          are for educational purposes and are not legal advice.
        </p>
        <h2 className="text-lg font-semibold text-stone-900">Use of the site</h2>
        <p>
          You agree not to misuse the service, attempt unauthorized access, or
          interfere with other users. We may suspend access for violations.
        </p>
        <h2 className="text-lg font-semibold text-stone-900">Products & pricing</h2>
        <p>
          Descriptions and prices are illustrative. Availability and stock
          levels may change. We may cancel orders we cannot fulfill.
        </p>
        <h2 className="text-lg font-semibold text-stone-900">Limitation of liability</h2>
        <p>
          The site is provided “as is” without warranties. To the maximum extent
          permitted by law, {SITE_NAME}&apos;s liability is limited for this student
          project.
        </p>
      </div>
    </main>
  );
}
