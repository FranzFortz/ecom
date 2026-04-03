// src/shared/components/ui/Input.tsx
import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className, ...props },
  ref
) {
  const inputId = id ?? props.name;
  return (
    <div className="flex w-full flex-col gap-1">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-stone-800"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
});
