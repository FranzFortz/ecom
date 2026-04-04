import type { Json } from "@/shared/types";
import { SITE_NAME } from "@/shared/lib/site";

export type ValueProp = {
  title: string;
  description: string;
};

/** Persisted in public.site_settings.settings (JSONB). */
export type StorefrontSettings = {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  showAnnouncement: boolean;
  announcementText: string;
  showValueStrip: boolean;
  valueProps: ValueProp[];
  showFeaturedSection: boolean;
  featuredSectionKicker: string;
  featuredSectionTitle: string;
  showCategorySection: boolean;
  categorySectionKicker: string;
  categorySectionTitle: string;
};

export const DEFAULT_STOREFRONT_SETTINGS: StorefrontSettings = {
  heroKicker: "Premier gadgets",
  heroTitle: SITE_NAME,
  heroSubtitle:
    "iPhone, iPad, and accessories — curated demo catalog for the Philippines.",
  heroCtaLabel: "Shop now",
  heroCtaHref: "/products",
  showAnnouncement: false,
  announcementText: "",
  showValueStrip: true,
  valueProps: [
    {
      title: "Free shipping",
      description: "Nationwide on qualifying orders (demo copy).",
    },
    {
      title: "Secure checkout",
      description: "GCash, cash on delivery, or card on delivery.",
    },
    {
      title: "Easy returns",
      description: `Policy summary placeholder — update in ${SITE_NAME} admin.`,
    },
  ],
  showFeaturedSection: true,
  featuredSectionKicker: "Featured products",
  featuredSectionTitle: "Featured picks",
  showCategorySection: true,
  categorySectionKicker: "Shop by category",
  categorySectionTitle: "Browse collections",
};

export function parseStorefrontSettings(raw: Json | null | undefined): StorefrontSettings {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ...DEFAULT_STOREFRONT_SETTINGS };
  }
  const o = raw as Record<string, unknown>;
  const base = { ...DEFAULT_STOREFRONT_SETTINGS };
  const mergeVp = (v: unknown): ValueProp[] => {
    if (!Array.isArray(v)) return [];
    return v
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const p = item as Record<string, unknown>;
        const title = typeof p.title === "string" ? p.title : "";
        const description =
          typeof p.description === "string" ? p.description : "";
        return { title, description };
      })
      .filter((x): x is ValueProp => x !== null && x.title.length > 0)
      .slice(0, 6);
  };
  const valuePropsMerged = mergeVp(o.valueProps);
  return {
    heroKicker:
      typeof o.heroKicker === "string" ? o.heroKicker : base.heroKicker,
    heroTitle: typeof o.heroTitle === "string" ? o.heroTitle : base.heroTitle,
    heroSubtitle:
      typeof o.heroSubtitle === "string" ? o.heroSubtitle : base.heroSubtitle,
    heroCtaLabel:
      typeof o.heroCtaLabel === "string" ? o.heroCtaLabel : base.heroCtaLabel,
    heroCtaHref:
      typeof o.heroCtaHref === "string" ? o.heroCtaHref : base.heroCtaHref,
    showAnnouncement:
      typeof o.showAnnouncement === "boolean"
        ? o.showAnnouncement
        : base.showAnnouncement,
    announcementText:
      typeof o.announcementText === "string"
        ? o.announcementText
        : base.announcementText,
    showValueStrip:
      typeof o.showValueStrip === "boolean"
        ? o.showValueStrip
        : base.showValueStrip,
    valueProps:
      valuePropsMerged.length > 0 ? valuePropsMerged : base.valueProps,
    showFeaturedSection:
      typeof o.showFeaturedSection === "boolean"
        ? o.showFeaturedSection
        : base.showFeaturedSection,
    featuredSectionKicker:
      typeof o.featuredSectionKicker === "string"
        ? o.featuredSectionKicker
        : base.featuredSectionKicker,
    featuredSectionTitle:
      typeof o.featuredSectionTitle === "string"
        ? o.featuredSectionTitle
        : base.featuredSectionTitle,
    showCategorySection:
      typeof o.showCategorySection === "boolean"
        ? o.showCategorySection
        : base.showCategorySection,
    categorySectionKicker:
      typeof o.categorySectionKicker === "string"
        ? o.categorySectionKicker
        : base.categorySectionKicker,
    categorySectionTitle:
      typeof o.categorySectionTitle === "string"
        ? o.categorySectionTitle
        : base.categorySectionTitle,
  };
}
