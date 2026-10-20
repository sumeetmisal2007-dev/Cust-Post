"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Sprout, Calendar, Tag, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompostingMethod } from "@cust-post/backend";
import { batchStorageService } from "@cust-post/backend";

interface StartBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMethod?: CompostingMethod;
  containerVolumeLitres?: number;
}

export function StartBatchModal({
  isOpen,
  onClose,
  defaultMethod = "aerobic_bin",
  containerVolumeLitres,
}: StartBatchModalProps) {
  const router = useRouter();
  const todayStr = new Date().toISOString().split("T")[0];

  const [batchName, setBatchName] = useState("Balcony Compost #1");
  const [startDate, setStartDate] = useState(todayStr);
  const [method, setMethod] = useState<CompostingMethod>(defaultMethod);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchName.trim()) {
      setError("Please provide a name for your batch");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const batch = await batchStorageService.createBatch({
        batchName: batchName.trim(),
        method,
        startDate,
        containerVolumeLitres,
        notes: notes.trim() || undefined,
      });

      onClose();
      router.push(`/batches/${batch.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to initialize batch";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-batch-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-lg bg-canvas border border-border rounded-card p-6 shadow-2xl space-y-6 text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-action" aria-hidden="true" />
            <h3 id="start-batch-title" className="font-display text-lg font-bold text-ink">
              Initialize Active Compost Batch
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

        {/* Guest note banner */}
        <div className="p-3.5 rounded-card bg-surface border border-border flex items-start gap-2.5 text-xs text-muted leading-relaxed">
          <Info className="h-4 w-4 text-action shrink-0 mt-0.5" />
          <div>
            <strong className="text-ink">No account required: </strong>
            Your batch and dated observations will be safely stored in your browser session. You can export or sync anytime.
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-card bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Batch Name */}
          <div className="space-y-1.5">
            <label htmlFor="batch-name" className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-action" />
              <span>Batch Nickname</span>
            </label>
            <Input
              id="batch-name"
              type="text"
              required
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              placeholder="e.g. Balcony Compost #1"
            />
          </div>

          {/* Start Date */}
          <div className="space-y-1.5">
            <label htmlFor="start-date" className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-action" />
              <span>Start Date</span>
            </label>
            <Input
              id="start-date"
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* Composting Method Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-ink">Selected Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as CompostingMethod)}
              className="w-full px-3 py-2 text-sm rounded-input border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-action"
            >
              <option value="aerobic_bin">Aerobic Pot / Bin Composting</option>
              <option value="vermicomposting">Vermicomposting (Worms)</option>
              <option value="bokashi">Bokashi Fermentation</option>
            </select>
          </div>

          {/* Optional Notes */}
          <div className="space-y-1.5">
            <label htmlFor="batch-notes" className="text-xs font-semibold text-ink flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-action" />
              <span>Initial Notes (Optional)</span>
            </label>
            <textarea
              id="batch-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Started with vegetable scraps and dried coconut coir..."
              className="w-full px-3 py-2 text-sm rounded-input border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-action"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Start Tracking Batch"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
