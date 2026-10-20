"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Activity } from "lucide-react";
import { CompostBatch } from "@cust-post/backend";

interface BatchHeaderProps {
  batch: CompostBatch;
}

export function BatchHeader({ batch }: BatchHeaderProps) {
  const methodNames: Record<string, string> = {
    aerobic_bin: "Aerobic Bin Composting",
    vermicomposting: "Vermicomposting (Worms)",
    bokashi: "Bokashi Fermentation",
  };

  const statusColors: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800 border-emerald-300",
    curing: "bg-amber-100 text-amber-800 border-amber-300",
    completed: "bg-blue-100 text-blue-800 border-blue-300",
    abandoned: "bg-stone-100 text-stone-700 border-stone-300",
  };

  const calculateDaysOld = (startDateStr: string) => {
    try {
      const start = new Date(startDateStr).getTime();
      const now = Date.now();
      const diffDays = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
      return diffDays;
    } catch {
      return 0;
    }
  };

  const daysOld = calculateDaysOld(batch.startDate);

  return (
    <div className="space-y-4 text-left">
      <Link
        href="/setup"
        className="inline-flex items-center text-xs font-semibold text-muted hover:text-ink transition-colors"
      >
        <ArrowLeft className="mr-1 h-3.5 w-3.5" />
        <span>Back to Setups</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span
              className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full border ${
                statusColors[batch.status] || statusColors.active
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Activity className="h-3 w-3" />
                <span className="capitalize">{batch.status}</span>
              </span>
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface border border-border text-ink">
              <Tag className="h-3 w-3 text-action" />
              <span>{methodNames[batch.method] || batch.method}</span>
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            {batch.batchName}
          </h1>
        </div>

        <div className="text-xs sm:text-right text-muted space-y-1">
          <div className="flex items-center sm:justify-end gap-1.5 font-medium text-ink">
            <Calendar className="h-3.5 w-3.5 text-action" />
            <span>Started: {batch.startDate}</span>
          </div>
          <div>
            <span>Pile Age: </span>
            <strong className="text-ink">{daysOld} days old</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
