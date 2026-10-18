import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  unit?: string;
  error?: string;
  label?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, unit, error, label, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            type={type}
            id={inputId}
            className={cn(
              "flex min-h-[48px] w-full rounded-control border bg-surface px-4 py-2 text-base text-text transition-colors",
              "placeholder:text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action",
              "disabled:cursor-not-allowed disabled:opacity-50",
              unit ? "pr-14" : "",
              error
                ? "border-error focus-visible:ring-error"
                : "border-border hover:border-muted",
              className
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            ref={ref}
            {...props}
          />
          {unit && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-sm font-medium text-muted">
              {unit}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="text-sm font-medium text-error">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={helperId} className="text-sm text-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
