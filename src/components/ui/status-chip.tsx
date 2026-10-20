import * as React from "react";
import { Scale, Sparkles, UserCheck, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type DataStatus = "measured" | "estimated" | "user_reported" | "unknown";

const statusClasses: Record<DataStatus, string> = {
  measured: "bg-action/10 text-action border border-action/30",
  estimated: "bg-accent/20 text-ink border border-accent/40",
  user_reported: "bg-mint text-ink border border-border",
  unknown: "bg-muted/15 text-muted border border-border",
};

export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: DataStatus;
  label?: string;
}

export function StatusChip({ status = "unknown", label, className, ...props }: StatusChipProps) {
  const defaultLabels: Record<DataStatus, string> = {
    measured: "Measured",
    estimated: "Estimated",
    user_reported: "User-Reported",
    unknown: "Not Measured / Unknown",
  };

  const icons: Record<DataStatus, React.ReactNode> = {
    measured: <Scale className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
    estimated: <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
    user_reported: <UserCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
    unknown: <HelpCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
        statusClasses[status] || statusClasses.unknown,
        className
      )}
      role="status"
      {...props}
    >
      {icons[status]}
      <span>{label || defaultLabels[status]}</span>
    </span>
  );
}
