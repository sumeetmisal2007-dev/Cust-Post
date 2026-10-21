import React from "react";
import { Sparkles, AlertTriangle, CheckCircle2, Box } from "lucide-react";
import { GeometricVolumeResult, SpaceFitResult } from "@cust-post/backend";

interface VolumeDisplayProps {
  volumeResult: GeometricVolumeResult | null;
  spaceFitResult: SpaceFitResult | null;
}

export function VolumeDisplay({ volumeResult, spaceFitResult }: VolumeDisplayProps) {
  if (!volumeResult) return null;

  const litres = volumeResult.volumeLitres;
  const isApartmentIdeal = litres >= 15 && litres <= 45;

  return (
    <div className="rounded-card border border-border bg-gradient-to-br from-mint/30 via-surface to-earth-subtle/40 p-4 sm:p-5 space-y-3.5 text-left shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-control bg-mint text-action flex items-center justify-center shrink-0">
            <Box className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted block">
              Calculated Container Size
            </span>
            <span className="text-xs text-ink font-medium">
              {isApartmentIdeal ? "Optimal apartment balcony volume" : "Estimated internal volume"}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-bold font-display text-action">
            {litres} L
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs py-1.5 px-3 rounded-control bg-surface border border-border/80">
        <CheckCircle2 className="h-3.5 w-3.5 text-brand shrink-0" />
        <span className="text-muted">
          {litres < 15
            ? "Compact size: Great for 1 person kitchen scraps; fills quickly."
            : litres <= 45
            ? "Sweet spot: Ideal 2–4 person household size with easy turning."
            : "Large volume: Generous capacity; check balcony floor weight limits."}
        </span>
      </div>

      <p className="text-xs text-muted leading-relaxed">
        <strong>Note:</strong> {volumeResult.disclaimer}
      </p>

      {spaceFitResult && spaceFitResult.warnings.length > 0 && (
        <div className="pt-2 border-t border-border/60 space-y-1.5">
          {spaceFitResult.warnings.map((warning, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 text-xs p-2.5 rounded-control ${
                !spaceFitResult.fits
                  ? "bg-error/10 text-error border border-error/20 font-medium"
                  : "bg-warning/15 text-warning border border-warning/20 font-medium"
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
