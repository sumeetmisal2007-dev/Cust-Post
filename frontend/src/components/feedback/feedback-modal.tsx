"use client";

import React, { useState } from "react";
import { X, MessageSquare, Check, AlertCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextSnapshot?: Record<string, unknown>;
}

export function FeedbackModal({
  isOpen,
  onClose,
  contextSnapshot,
}: FeedbackModalProps) {
  const [issueType, setIssueType] = useState<string>("confusing_guidance");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 5) {
      setError("Please provide at least 5 characters describing the issue.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueType,
          description: description.trim(),
          contextSnapshot,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit feedback");
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setDescription("");
        onClose();
      }, 150);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-lg bg-canvas border border-border rounded-card p-6 shadow-2xl space-y-6 text-left">

        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-action" aria-hidden="true" />
            <h3 id="feedback-title" className="font-display text-lg font-bold text-ink">
              Submit Rule or Guidance Feedback
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

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check className="h-6 w-6" />
            </div>
            <h4 className="font-display text-base font-bold text-ink">Thank you for your feedback!</h4>
            <p className="text-xs text-muted">
              Your report helps our agronomic advisory panel refine the rules and safety criteria.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-muted leading-relaxed">
              Did a recommendation seem unclear, unrealistic for your balcony, or miss a container type? Help us improve Cust-Post.
            </p>

            {error && (
              <div className="p-3 rounded-card bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="issue-type" className="text-xs font-semibold text-ink">
                What type of issue did you notice?
              </label>
              <select
                id="issue-type"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-input border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-action"
              >
                <option value="confusing_guidance">Confusing guidance or wording</option>
                <option value="unsuitable_for_space">Unsuitable for my space constraints</option>
                <option value="missing_option">Missing container material or scrap type</option>
                <option value="incorrect_assumption">Incorrect volume or time estimate</option>
                <option value="other">Other observation or feedback</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="feedback-desc" className="text-xs font-semibold text-ink">
                Detailed Feedback Description
              </label>
              <textarea
                id="feedback-desc"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what seemed confusing or could be improved..."
                className="w-full px-3 py-2 text-xs rounded-input border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-action"
              />
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
              <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                <span>{isSubmitting ? "Submitting..." : "Submit Feedback"}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
