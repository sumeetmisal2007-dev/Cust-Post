"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Info,
  Wrench,
  Layers,
  CalendarCheck,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContainerEvaluationResult } from "@/lib/compost-rules/container-evaluator";
import { MethodPlanResult } from "@/lib/compost-rules/method-recommender";
import { RecommendationVerdict } from "@/types/domain";

interface RecommendationCardProps {
  containerResult: ContainerEvaluationResult;
  methodPlan: MethodPlanResult | null;
  volumeLitres: number;
  onViewSources: () => void;
  onStartBatch: () => void;
}

export function RecommendationCard({
  containerResult,
  methodPlan,
  volumeLitres,
  onViewSources,
  onStartBatch,
}: RecommendationCardProps) {
  const verdictConfig: Record<
    RecommendationVerdict,
    {
      badgeLabel: string;
      title: string;
      icon: React.ComponentType<{ className?: string }>;
      colorClass: string;
    }
  > = {
    suitable: {
      badgeLabel: "Container Suitable",
      title: "Your Container is Ready for Composting",
      icon: CheckCircle2,
      colorClass: "bg-emerald-50 text-emerald-800 border-emerald-300",
    },
    suitable_with_changes: {
      badgeLabel: "Modifications Required",
      title: "Suitable with Required Modifications",
      icon: AlertTriangle,
      colorClass: "bg-amber-50 text-amber-800 border-amber-300",
    },
    unsuitable: {
      badgeLabel: "Container Unsuitable",
      title: "Container Cannot Be Cleared for Composting",
      icon: XCircle,
      colorClass: "bg-rose-50 text-rose-800 border-rose-300",
    },
    more_info_needed: {
      badgeLabel: "More Information Needed",
      title: "Cannot Clear Without Additional Verification",
      icon: HelpCircle,
      colorClass: "bg-sky-50 text-sky-800 border-sky-300",
    },
  };

  const currentVerdict = verdictConfig[containerResult.verdict] || verdictConfig.more_info_needed;
  const VerdictIcon = currentVerdict.icon;

  const canStartBatch =
    containerResult.verdict === "suitable" ||
    containerResult.verdict === "suitable_with_changes";

  return (
    <div className="space-y-8 max-w-3xl mx-auto text-left">
      {/* Verdict Header Banner */}
      <div
        className={`p-6 rounded-card border ${currentVerdict.colorClass} shadow-soft flex flex-col sm:flex-row items-start gap-4`}
      >
        <div className="p-3 rounded-full bg-white/70 shadow-xs shrink-0">
          <VerdictIcon className="h-7 w-7" />
        </div>
        <div className="space-y-1.5 flex-1">
          <span className="inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/80 border border-current/20">
            {currentVerdict.badgeLabel}
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold">{currentVerdict.title}</h2>
          <div className="text-xs text-muted font-medium pt-1">
            Geometric Volume: {volumeLitres} L (Geometric volume only; does not equal compost capacity)
          </div>
        </div>
      </div>

      {/* Reasons & Evaluation Rationale */}
      <div className="p-6 rounded-card border border-border bg-surface space-y-4 shadow-xs">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
          <Info className="h-4 w-4 text-action" />
          <span>Container Assessment Findings</span>
        </h3>
        <ul className="space-y-2">
          {containerResult.reasons.map((reason, idx) => (
            <li key={idx} className="text-sm text-text leading-relaxed flex items-start gap-2">
              <span className="text-action font-bold leading-tight">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Required Modifications if Suitable with Changes */}
      {containerResult.verdict === "suitable_with_changes" &&
        containerResult.requiredModifications.length > 0 && (
          <div className="p-6 rounded-card border border-amber-300 bg-amber-50/60 space-y-3">
            <h3 className="font-display text-base font-bold text-amber-900 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-amber-700" />
              <span>Required Modifications Before Starting</span>
            </h3>
            <ul className="space-y-2">
              {containerResult.requiredModifications.map((mod, idx) => (
                <li
                  key={idx}
                  className="text-sm text-amber-950 font-medium leading-relaxed flex items-start gap-2"
                >
                  <span className="text-amber-700 font-bold leading-tight">✓</span>
                  <span>{mod}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Unresolved Checks if More Info Needed */}
      {containerResult.verdict === "more_info_needed" &&
        containerResult.unresolvedChecks.length > 0 && (
          <div className="p-6 rounded-card border border-sky-300 bg-sky-50/60 space-y-3">
            <h3 className="font-display text-base font-bold text-sky-900 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-sky-700" />
              <span>Unresolved Questions to Verify</span>
            </h3>
            <ul className="space-y-2">
              {containerResult.unresolvedChecks.map((check, idx) => (
                <li
                  key={idx}
                  className="text-sm text-sky-950 font-medium leading-relaxed flex items-start gap-2"
                >
                  <span className="text-sky-700 font-bold leading-tight">?</span>
                  <span>{check}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Recommended Method Plan */}
      {methodPlan && (
        <div className="p-6 rounded-card border border-border bg-surface space-y-6 shadow-xs">
          <div className="border-b border-border pb-4">
            <div className="flex items-center gap-2 text-action text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Recommended Composting Method</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-ink mt-1">
              {methodPlan.methodName}
            </h3>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              {methodPlan.rationale.join(" ")}
            </p>
          </div>

          {/* Starting Setup Sequence */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-ink flex items-center gap-2">
              <Layers className="h-4 w-4 text-brand" />
              <span>Initial Setup Sequence</span>
            </h4>
            <ol className="space-y-2 pl-2">
              {methodPlan.startingSequence.map((step, idx) => (
                <li key={idx} className="text-sm text-text leading-relaxed flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Routine Maintenance */}
          <div className="space-y-3 pt-3 border-t border-border">
            <h4 className="font-semibold text-sm text-ink flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-action" />
              <span>Ongoing Maintenance Checklist</span>
            </h4>
            <ul className="space-y-1.5 pl-2">
              {methodPlan.maintenanceSteps.map((m, idx) => (
                <li key={idx} className="text-sm text-text leading-relaxed flex items-start gap-2">
                  <span className="text-action font-bold leading-tight">✓</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Excluded items */}
          {methodPlan.excludedItems.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-border">
              <h4 className="font-semibold text-sm text-ink flex items-center gap-2">
                <Ban className="h-4 w-4 text-rose-500" />
                <span>Items to Keep Out of this System</span>
              </h4>
              <p className="text-xs text-muted">
                {methodPlan.excludedItems.join(", ")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons & Source Drawer Trigger */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border">
        <button
          type="button"
          onClick={onViewSources}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-action hover:underline"
        >
          <BookOpen className="h-4 w-4" />
          <span>Why this recommendation? (Rule Provenance)</span>
        </button>

        {canStartBatch && (
          <Button type="button" size="lg" onClick={onStartBatch}>
            <span>Start Active Batch with this Setup</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
