// src/shared/lib/admin-nav.ts
export const ADMIN_NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: "◆" },
  { href: "/admin/orders", label: "Orders", icon: "◎" },
  { href: "/admin/products", label: "Products", icon: "▤" },
  { href: "/admin/storefront", label: "Storefront", icon: "◇" },
] as const;
