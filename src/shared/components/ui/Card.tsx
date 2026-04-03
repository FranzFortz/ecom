// src/shared/components/ui/Card.tsx
import { cn } from "@/shared/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-stone-200 bg-white p-4 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
