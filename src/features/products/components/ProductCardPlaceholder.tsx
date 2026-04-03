// src/features/products/components/ProductCardPlaceholder.tsx
/** Visual placeholder for empty catalog / wireframes. */
export function ProductCardPlaceholder({ index = 0 }: { index?: number }) {
  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-xl border-2 border-dashed border-stone-300 bg-stone-50"
      aria-hidden
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-stone-200/80">
        <span className="text-xs font-medium uppercase tracking-wide text-stone-500">
          Image {index + 1}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="h-4 w-3/4 rounded bg-stone-200" />
        <div className="h-4 w-1/2 rounded bg-stone-200" />
        <div className="mt-auto h-10 w-full rounded-lg border border-dashed border-stone-400 bg-stone-100" />
      </div>
    </article>
  );
}
