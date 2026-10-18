import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-control text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-action text-white hover:bg-action-hover shadow-sm min-h-[48px] px-6 py-3",
        secondary:
          "bg-surface text-ink border border-border hover:bg-canvas min-h-[48px] px-6 py-3",
        outline:
          "border border-border bg-transparent hover:bg-surface text-ink min-h-[44px] px-4 py-2",
        ghost:
          "hover:bg-mint/40 text-ink min-h-[44px] px-4 py-2",
        link:
          "text-action underline-offset-4 hover:underline p-0 h-auto",
        destructive:
          "bg-error text-white hover:bg-error/90 min-h-[48px] px-6 py-3",
      },
      size: {
        default: "min-h-[48px] px-6 py-3",
        sm: "min-h-[40px] px-4 py-2 text-sm",
        lg: "min-h-[52px] px-8 py-4 text-lg",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, children, disabled, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
