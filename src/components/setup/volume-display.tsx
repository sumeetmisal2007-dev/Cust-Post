import React from "react";
import { Sparkles, AlertTriangle } from "lucide-react";
import { GeometricVolumeResult, SpaceFitResult } from "@/lib/compost-rules/volume-calculator";

interface VolumeDisplayProps {
  volumeResult: GeometricVolumeResult | null;
  spaceFitResult: SpaceFitResult | null;
}

export function VolumeDisplay({ volumeResult, spaceFitResult }: VolumeDisplayProps) {
  if (!volumeResult) return null;

  return (
    <div className="rounded-card border border-border bg-mint/20 p-4 space-y-3 text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Calculated Container Size
          </span>
        </div>
        <div className="text-2xl font-bold font-display text-ink">
          {volumeResult.volumeLitres} L
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed">
        <strong>Note:</strong> {volumeResult.disclaimer}
      </p>

      {/* Space clearance alerts */}
      {spaceFitResult && spaceFitResult.warnings.length > 0 && (
        <div className="pt-2 border-t border-border/60 space-y-1.5">
          {spaceFitResult.warnings.map((warning, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 text-xs p-2 rounded-control ${
                !spaceFitResult.fits
                  ? "bg-error/10 text-error font-medium"
                  : "bg-warning/15 text-warning font-medium"
              }`}
            >
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
