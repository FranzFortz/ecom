import Link from "next/link";
import { SITE_NAME } from "@/shared/lib/site";

export default function AdminDeniedPage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-xl font-semibold text-stone-900">Admin access required</h1>
      <p className="mt-3 text-sm text-stone-600">
        You are signed in, but this account is not on the server{" "}
        <code className="rounded bg-stone-100 px-1 text-xs">ADMIN_EMAILS</code> allowlist,
        or that variable is missing in{" "}
        <code className="rounded bg-stone-100 px-1 text-xs">.env.local</code>.
      </p>
      <ul className="mt-4 list-inside list-disc text-sm text-stone-600">
        <li>
          Use the <strong>exact same email</strong> as in Supabase Authentication → Users.
        </li>
        <li>
          Set <code className="text-xs">ADMIN_EMAILS=you@example.com</code> (no spaces around{" "}
          <code className="text-xs">=</code>) and restart{" "}
          <code className="text-xs">npm run dev</code>.
        </li>
      </ul>
      <p className="mt-6 text-sm text-stone-600">
        See <code className="rounded bg-stone-100 px-1 text-xs">supabase/ADMIN_SETUP.md</code>{" "}
        for full steps.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-lg bg-emerald-700 px-4 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Back to {SITE_NAME}
        </Link>
        <Link
          href="/account"
          className="inline-flex min-h-11 items-center rounded-lg border border-stone-300 px-4 text-sm font-medium text-stone-800 hover:bg-stone-50"
        >
          My account
        </Link>
      </div>
    </main>
  );
}
