// src/shared/components/ui/Badge.tsx
import { cn } from "@/shared/lib/utils";

export type BadgeVariant = "success" | "warning" | "error" | "neutral";

const styles: Record<BadgeVariant, string> = {
  success: "bg-emerald-100 text-emerald-900",
  warning: "bg-amber-100 text-amber-900",
  error: "bg-red-100 text-red-900",
  neutral: "bg-stone-100 text-stone-700",
};

export function Badge({
  variant = "neutral",
  className,
  children,
}: {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
