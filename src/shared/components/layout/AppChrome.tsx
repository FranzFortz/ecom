// src/shared/components/layout/AppChrome.tsx
"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/shared/components/layout/Footer";
import { Header } from "@/shared/components/layout/Header";

/**
 * Store header/footer must follow client navigations. Root layout reading
 * `x-pathname` stays stale after /admin → /, so we use usePathname() here.
 */
export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideStoreChrome = pathname.startsWith("/admin");

  return (
    <>
      {hideStoreChrome ? null : <Header />}
      <div className="flex-1">{children}</div>
      {hideStoreChrome ? null : <Footer />}
    </>
  );
}
