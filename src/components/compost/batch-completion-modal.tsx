"use client";

import React from "react";
import { Sparkles, X, Sprout, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BatchCompletionModalProps {
  isOpen: boolean;
  batchName: string;
  onConfirm: () => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export function BatchCompletionModal({
  isOpen,
  batchName,
  onConfirm,
  onClose,
  isSubmitting = false,
}: BatchCompletionModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-md bg-canvas border border-border rounded-card p-6 shadow-2xl space-y-6 text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-action" aria-hidden="true" />
            <h3 id="completion-title" className="font-display text-lg font-bold text-ink">
              Congratulations! Batch Completed
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full text-muted hover:text-ink hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-text leading-relaxed">
            You have successfully guided <strong className="text-ink">{batchName}</strong> from raw kitchen scraps to nutrient-rich, biologically mature compost.
          </p>

          <div className="p-3.5 rounded-card bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <Sprout className="h-4 w-4 text-emerald-700" />
              <span>Safe Application Reminder</span>
            </div>
            <p className="leading-relaxed">
              Always mix 20–30% mature compost into 70–80% garden soil or coco peat. Never plant seeds directly in 100% pure compost.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isSubmitting}>
            <Check className="mr-2 h-4 w-4" />
            <span>{isSubmitting ? "Finalizing..." : "Mark Batch as Completed"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
