"use client";

import React from "react";
import Link from "next/link";
import {
  Scale,
  Calendar,
  RotateCw,
  PlusCircle,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { CompostBatch, BatchObservation } from "@/types/domain";

interface MetricSummaryProps {
  batch: CompostBatch;
  observations: BatchObservation[];
  onLogObservation: () => void;
}

export function MetricSummary({ batch, observations, onLogObservation }: MetricSummaryProps) {
  // Calculate days since last aeration
  const lastTurnedObs = observations.find((o) => o.turned);
  let aerationStatusText = "Not yet turned";
  let isOverdue = false;
  if (lastTurnedObs) {
    const daysSince = Math.floor(
      (Date.now() - new Date(lastTurnedObs.observedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    aerationStatusText = daysSince === 0 ? "Turned today" : `${daysSince} days ago`;
    isOverdue = daysSince >= 4;
  }

  const windowStart = batch.readinessWindowStart || "Pending";
  const windowEnd = batch.readinessWindowEnd || "Pending";

  return (
    <div className="space-y-6 text-left">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Organic Inputs */}
        <div className="p-5 rounded-card border border-border bg-surface shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted text-xs">
            <span className="font-semibold uppercase tracking-wider text-ink flex items-center gap-1.5">
              <Scale className="h-4 w-4 text-action" />
              <span>Total Organic Inputs</span>
            </span>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <StatusChip status="measured" label="Measured" />
              </div>
              <span className="font-display text-lg font-bold text-ink">
                {batch.totalMeasuredInputKg} kg
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <StatusChip status="estimated" label="Estimated" />
              </div>
              <span className="font-display text-lg font-bold text-ink">
                {batch.totalEstimatedInputKg} kg
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border/80 text-[11px] text-muted flex items-center gap-1">
            <Info className="h-3 w-3 shrink-0" />
            <span>Tracked across dated observations</span>
          </div>
        </div>

        {/* Card 2: Readiness Window */}
        <div className="p-5 rounded-card border border-border bg-surface shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted text-xs">
            <span className="font-semibold uppercase tracking-wider text-ink flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-brand" />
              <span>Readiness Window</span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="font-display text-lg font-bold text-ink">
              {windowStart} – {windowEnd}
            </div>
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200/80 p-2 rounded-xs leading-relaxed font-medium">
              Estimated window; pending physical maturity checks before harvest.
            </p>
          </div>
        </div>

        {/* Card 3: Aeration & Turning */}
        <div className="p-5 rounded-card border border-border bg-surface shadow-xs space-y-3">
          <div className="flex items-center justify-between text-muted text-xs">
            <span className="font-semibold uppercase tracking-wider text-ink flex items-center gap-1.5">
              <RotateCw className="h-4 w-4 text-action" />
              <span>Pile Aeration</span>
            </span>
            {isOverdue && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">
                Turn Due
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="font-display text-xl font-bold text-ink">
              {aerationStatusText}
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Aerobic bins thrive with turning every 3–4 days to prevent sour anaerobic odor.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="p-4 rounded-card border border-border bg-surface flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="text-xs font-semibold text-ink">Quick Batch Actions:</div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button type="button" onClick={onLogObservation}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Log Observation</span>
          </Button>

          <Link href={`/batches/${batch.id}/troubleshoot`}>
            <Button type="button" variant="secondary">
              <AlertCircle className="mr-2 h-4 w-4 text-amber-600" />
              <span>Troubleshoot Issue</span>
            </Button>
          </Link>

          <Link href={`/batches/${batch.id}/maturity`}>
            <Button type="button" variant="secondary">
              <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
              <span>Maturity Checklist</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
