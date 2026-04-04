"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { StorefrontSettings, ValueProp } from "@/shared/types/storefront";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { cn } from "@/shared/lib/utils";

export function StorefrontSettingsForm({ initial }: { initial: StorefrontSettings }) {
  const router = useRouter();
  const [s, setS] = useState<StorefrontSettings>(initial);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  const setVp = (i: number, field: keyof ValueProp, v: string) => {
    setS((prev) => {
      const valueProps = [...prev.valueProps];
      const row = { ...valueProps[i], [field]: v };
      valueProps[i] = row;
      return { ...prev, valueProps };
    });
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? "Save failed");
        return;
      }
      setOk(true);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Announcement bar
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Thin strip above the hero — use for promos or shipping notices.
        </p>
        <label className="mt-4 flex items-center gap-2 text-sm text-slate-800">
          <input
            type="checkbox"
            checked={s.showAnnouncement}
            onChange={(e) =>
              setS((p) => ({ ...p, showAnnouncement: e.target.checked }))
            }
            className="h-4 w-4 rounded border-slate-300"
          />
          Show announcement on the website
        </label>
        <div className="mt-3">
          <Input
            label="Announcement text"
            name="announcementText"
            value={s.announcementText}
            onChange={(e) =>
              setS((p) => ({ ...p, announcementText: e.target.value }))
            }
            placeholder="Free shipping this week — demo copy"
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Hero
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input
            label="Kicker (small label above title)"
            name="heroKicker"
            value={s.heroKicker}
            onChange={(e) => setS((p) => ({ ...p, heroKicker: e.target.value }))}
          />
          <Input
            label="Primary CTA link"
            name="heroCtaHref"
            value={s.heroCtaHref}
            onChange={(e) => setS((p) => ({ ...p, heroCtaHref: e.target.value }))}
            placeholder="/products"
          />
        </div>
        <div className="mt-4">
          <Input
            label="Headline"
            name="heroTitle"
            value={s.heroTitle}
            onChange={(e) => setS((p) => ({ ...p, heroTitle: e.target.value }))}
            required
          />
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <label htmlFor="heroSubtitle" className="text-sm font-medium text-stone-800">
            Subtitle
          </label>
          <textarea
            id="heroSubtitle"
            rows={3}
            value={s.heroSubtitle}
            onChange={(e) => setS((p) => ({ ...p, heroSubtitle: e.target.value }))}
            className={cn(
              "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            )}
          />
        </div>
        <div className="mt-4">
          <Input
            label="CTA button label"
            name="heroCtaLabel"
            value={s.heroCtaLabel}
            onChange={(e) => setS((p) => ({ ...p, heroCtaLabel: e.target.value }))}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Value strip
        </h2>
        <label className="mt-4 flex items-center gap-2 text-sm text-slate-800">
          <input
            type="checkbox"
            checked={s.showValueStrip}
            onChange={(e) =>
              setS((p) => ({ ...p, showValueStrip: e.target.checked }))
            }
            className="h-4 w-4 rounded border-slate-300"
          />
          Show three-column value strip under hero
        </label>
        <div className="mt-6 space-y-4">
          {s.valueProps.slice(0, 3).map((vp, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-100 bg-slate-50/80 p-4"
            >
              <p className="mb-2 text-xs font-medium text-slate-500">Column {i + 1}</p>
              <Input
                label="Title"
                value={vp.title}
                onChange={(e) => setVp(i, "title", e.target.value)}
              />
              <div className="mt-3 flex flex-col gap-1">
                <label className="text-sm font-medium text-stone-800">Description</label>
                <textarea
                  rows={2}
                  value={vp.description}
                  onChange={(e) => setVp(i, "description", e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Homepage sections
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Toggle entire blocks. Featured products still use the “featured” flag on each product.
        </p>
        <div className="mt-4 space-y-4">
          <label className="flex items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={s.showFeaturedSection}
              onChange={(e) =>
                setS((p) => ({ ...p, showFeaturedSection: e.target.checked }))
              }
              className="h-4 w-4 rounded border-slate-300"
            />
            Show featured products section
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Featured — small kicker"
              value={s.featuredSectionKicker}
              onChange={(e) =>
                setS((p) => ({ ...p, featuredSectionKicker: e.target.value }))
              }
            />
            <Input
              label="Featured — section title"
              value={s.featuredSectionTitle}
              onChange={(e) =>
                setS((p) => ({ ...p, featuredSectionTitle: e.target.value }))
              }
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={s.showCategorySection}
              onChange={(e) =>
                setS((p) => ({ ...p, showCategorySection: e.target.checked }))
              }
              className="h-4 w-4 rounded border-slate-300"
            />
            Show shop-by-category section
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Categories — small kicker"
              value={s.categorySectionKicker}
              onChange={(e) =>
                setS((p) => ({ ...p, categorySectionKicker: e.target.value }))
              }
            />
            <Input
              label="Categories — section title"
              value={s.categorySectionTitle}
              onChange={(e) =>
                setS((p) => ({ ...p, categorySectionTitle: e.target.value }))
              }
            />
          </div>
        </div>
      </section>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="text-sm text-emerald-700" role="status">
          Saved. Refresh the homepage to see changes.
        </p>
      ) : null}
      <Button type="submit" isLoading={loading}>
        Save storefront settings
      </Button>
    </form>
  );
}
