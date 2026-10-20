"use client";

import React from "react";
import {
  Wrench,
  Search,
  ExternalLink,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TroubleshootingResolution } from "@cust-post/backend";

interface ResolutionViewProps {
  resolution: TroubleshootingResolution;
  onApplyLog: () => void;
  isApplying?: boolean;
}

export function ResolutionView({
  resolution,
  onApplyLog,
  isApplying = false,
}: ResolutionViewProps) {
  return (
    <div className="space-y-6 text-left border-t border-border pt-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-action/10 text-action border border-action/30">
          <Wrench className="h-3 w-3" />
          <span>Evidence-Based Corrective Guidance</span>
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
          {resolution.symptomTitle}
        </h2>
      </div>

      {/* Likely Causes */}
      <div className="p-4 rounded-card border border-border bg-surface space-y-2 shadow-xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted">
          Underlying Causes
        </h4>
        <ul className="space-y-1.5">
          {resolution.likelyCauses.map((cause, idx) => (
            <li key={idx} className="text-xs text-text leading-relaxed flex items-start gap-2">
              <span className="text-action font-bold leading-tight">•</span>
              <span>{cause}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* What to Inspect */}
      <div className="p-5 rounded-card border border-border bg-surface space-y-3 shadow-xs">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
          <Search className="h-4 w-4 text-action" />
          <span>What to Inspect</span>
        </h3>
        <ul className="space-y-2">
          {resolution.whatToInspect.map((point, idx) => (
            <li key={idx} className="text-xs sm:text-sm text-text leading-relaxed flex items-start gap-2">
              <span className="text-action font-bold leading-tight">🔍</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* What to Do Immediately */}
      <div className="p-5 rounded-card border border-emerald-300 bg-emerald-50/60 space-y-3 shadow-xs">
        <h3 className="font-display text-base font-bold text-emerald-950 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-700" />
          <span>What to Do Immediately</span>
        </h3>
        <ul className="space-y-2.5">
          {resolution.immediateAction.map((act, idx) => (
            <li
              key={idx}
              className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed flex items-start gap-2"
            >
              <span className="text-emerald-700 font-bold leading-tight">✓</span>
              <span>{act}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Source Citation */}
      <div className="p-4 rounded-card border border-border bg-canvas text-xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-semibold text-ink">
            <BookOpen className="h-3.5 w-3.5 text-action" />
            <span>Literature Provenance:</span>
          </div>
          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface border border-border text-muted">
            {resolution.sourceId}
          </span>
        </div>
        <p className="text-muted leading-relaxed">{resolution.sourceTitle}</p>
        <div>
          <a
            href={resolution.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-action hover:underline"
          >
            <span>Review Source Documentation</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Apply & Record Action */}
      <div className="p-4 rounded-card border border-action/30 bg-action-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-left">
          <div className="text-xs font-bold text-action flex items-center gap-1.5">
            <FileCheck className="h-4 w-4" />
            <span>Suggested Log Entry</span>
          </div>
          <p className="text-xs text-text">{resolution.suggestedLogAction}</p>
        </div>

        <Button type="button" size="lg" onClick={onApplyLog} disabled={isApplying}>
          <span>{isApplying ? "Recording..." : "Apply & Record in Batch Log"}</span>
        </Button>
      </div>
    </div>
  );
}
