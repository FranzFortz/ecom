// src/shared/components/layout/Footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-emerald-900">BayanMart</p>
          <p className="mt-2 text-sm text-stone-600">
            Quality goods for homes across the Philippines. Free shipping on
            eligible orders nationwide.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-900">Explore</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-stone-600">
            <li>
              <Link href="/products" className="hover:text-emerald-800">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-emerald-800">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-emerald-800">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-emerald-800">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-900">Policies</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-stone-600">
            <li>
              <Link href="/shipping" className="hover:text-emerald-800">
                Shipping
              </Link>
            </li>
            <li>
              <Link href="/returns" className="hover:text-emerald-800">
                Returns
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-emerald-800">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-emerald-800">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/tracking" className="hover:text-emerald-800">
                Track order
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-200 py-4 text-center text-xs text-stone-500">
        <p>© {new Date().getFullYear()} BayanMart. Student demo store.</p>
        <p className="mt-1 flex justify-center gap-4">
          <span aria-hidden>🔒</span>
          <span>Secure checkout · GCash · Cash · Card on delivery</span>
        </p>
      </div>
    </footer>
  );
}
