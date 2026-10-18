"use client";

import React from "react";
import {
  Clock,
  RotateCw,
  Droplets,
  Wind,
  PlusCircle,
  Thermometer,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { BatchObservation } from "@/types/domain";

interface BatchTimelineProps {
  observations: BatchObservation[];
  onLogFirst: () => void;
}

export function BatchTimeline({ observations, onLogFirst }: BatchTimelineProps) {
  if (observations.length === 0) {
    return (
      <div className="p-8 rounded-card border border-dashed border-border bg-surface text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-action/10 text-action">
          <Clock className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold text-ink">No observations logged yet</h3>
          <p className="text-xs text-muted max-w-sm mx-auto">
            Log regular observations on moisture, turning, and odor to keep your batch on track and catch issues early.
          </p>
        </div>
        <Button type="button" onClick={onLogFirst}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span>Log First Observation</span>
        </Button>
      </div>
    );
  }

  const moistureStyles: Record<string, { label: string; class: string }> = {
    dry: { label: "Dry", class: "bg-amber-100 text-amber-800 border-amber-300" },
    ideal: { label: "Ideal (Damp Sponge)", class: "bg-emerald-100 text-emerald-800 border-emerald-300" },
    too_wet: { label: "Too Wet", class: "bg-sky-100 text-sky-800 border-sky-300" },
  };

  const odourStyles: Record<string, { label: string; class: string }> = {
    earthy: { label: "Earthy / Forest", class: "bg-emerald-100 text-emerald-800 border-emerald-300" },
    none: { label: "None / Mild", class: "bg-stone-100 text-stone-700 border-stone-300" },
    sour: { label: "Sour / Vinegary", class: "bg-rose-100 text-rose-800 border-rose-300" },
    ammonia: { label: "Ammonia / Sharp", class: "bg-purple-100 text-purple-800 border-purple-300" },
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-ink flex items-center gap-2">
          <Clock className="h-5 w-5 text-action" />
          <span>Batch Observation Timeline ({observations.length})</span>
        </h3>
      </div>

      <div className="space-y-3">
        {observations.map((obs) => {
          const dateStr = new Date(obs.observedAt).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={obs.id}
              className="p-4 rounded-card border border-border bg-surface shadow-xs space-y-3"
            >
              {/* Header: Date + Waste Addition Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-border/80">
                <span className="text-xs font-semibold text-ink">{dateStr}</span>

                {obs.wasteAddedKg && obs.wasteAddedKg > 0 ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-action">
                      +{obs.wasteAddedKg} kg added
                    </span>
                    <StatusChip status={obs.wasteDataStatus || "measured"} />
                  </div>
                ) : null}
              </div>

              {/* Status Chips Row */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Moisture */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border font-medium ${
                    moistureStyles[obs.moisture]?.class || "bg-stone-100"
                  }`}
                >
                  <Droplets className="h-3 w-3 shrink-0" />
                  <span>{moistureStyles[obs.moisture]?.label || obs.moisture}</span>
                </span>

                {/* Odour */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border font-medium ${
                    odourStyles[obs.odour]?.class || "bg-stone-100"
                  }`}
                >
                  <Wind className="h-3 w-3 shrink-0" />
                  <span>{odourStyles[obs.odour]?.label || obs.odour}</span>
                </span>

                {/* Turning */}
                {obs.turned && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-action/10 text-action border border-action/30 font-semibold">
                    <RotateCw className="h-3 w-3 shrink-0" />
                    <span>Turned & Aerated</span>
                  </span>
                )}

                {/* Temperature */}
                {obs.temperatureC != null && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface border border-border text-ink font-medium">
                    <Thermometer className="h-3 w-3 text-brand shrink-0" />
                    <span>{obs.temperatureC}°C</span>
                  </span>
                )}

                {/* Pests */}
                {obs.pests && obs.pests !== "none" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-300 font-medium">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    <span className="capitalize">{obs.pests.replace("_", " ")}</span>
                  </span>
                )}
              </div>

              {/* Observation Notes */}
              {obs.notes && (
                <div className="pt-2 text-xs text-muted flex items-start gap-1.5 leading-relaxed bg-canvas/60 p-2.5 rounded-xs border border-border/60">
                  <FileText className="h-3.5 w-3.5 text-muted shrink-0 mt-0.5" />
                  <span>{obs.notes}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
