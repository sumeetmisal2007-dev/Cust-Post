import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepItem {
  id: number;
  name: string;
  description?: string;
}

export interface ProgressStepperProps {
  steps: StepItem[];
  currentStep: number;
  className?: string;
  onStepClick?: (stepId: number) => void;
}

export function ProgressStepper({
  steps,
  currentStep,
  className,
  onStepClick,
}: ProgressStepperProps) {
  return (
    <nav aria-label="Setup progress" className={cn("w-full py-4", className)}>
      <ol className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const isComplete = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isClickable = Boolean(onStepClick && isComplete);

          return (
            <li
              key={step.id}
              className={cn("flex flex-1 items-center", index === steps.length - 1 ? "flex-none" : "")}
            >
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(step.id)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action",
                    isComplete
                      ? "bg-action text-white hover:bg-action-hover"
                      : isCurrent
                      ? "border-2 border-action bg-surface text-action shadow-sm"
                      : "border border-border bg-canvas text-muted",
                    isClickable ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                  <span className="sr-only">
                    {isComplete ? "Completed: " : isCurrent ? "Current step: " : "Upcoming step: "}
                    {step.name}
                  </span>
                </button>
                <span
                  className={cn(
                    "hidden text-xs font-medium md:inline-block",
                    isCurrent ? "text-ink font-semibold" : isComplete ? "text-text" : "text-muted"
                  )}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 transition-colors",
                    isComplete ? "bg-action" : "bg-border"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
