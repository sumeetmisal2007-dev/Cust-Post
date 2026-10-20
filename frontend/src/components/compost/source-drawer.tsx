"use client";

import React, { useEffect } from "react";
import { X, ExternalLink, ShieldCheck, BookOpen } from "lucide-react";
import { RuleSource } from "@cust-post/backend";

interface SourceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sources: RuleSource[];
}

export function SourceDrawer({ isOpen, onClose, sources }: SourceDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="source-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-xs transition-opacity"
    >
      {/* Backdrop click to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-md bg-canvas border-l border-border h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-action" aria-hidden="true" />
            <h3 id="source-drawer-title" className="font-display text-lg font-bold text-ink">
              Rule Provenance & Literature Citations
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-full hover:bg-surface text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-xs text-muted leading-relaxed">
          Cust-Post uses zero unverified AI verdicts. Every guideline, volume threshold, and safety check is derived from published agronomic and municipal composting literature.
        </p>

        <div className="mt-6 space-y-4 flex-1">
          {sources.map((src, idx) => (
            <div
              key={`${src.ruleId}-${idx}`}
              className="p-4 rounded-card border border-border bg-surface shadow-xs space-y-2 text-left"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-action-soft text-action border border-action/20">
                  {src.ruleId}
                </span>
                <span className="text-[11px] text-muted font-medium">v{src.version}</span>
              </div>

              <h4 className="font-semibold text-sm text-ink">{src.title}</h4>

              <div className="text-xs text-muted space-y-1">
                <div>
                  <span className="font-medium text-ink">Organization: </span>
                  <span>{src.organization}</span>
                </div>
                {src.reviewer && (
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent-dark shrink-0" aria-hidden="true" />
                    <span>
                      <strong className="text-ink">Peer Reviewer: </strong>
                      {src.reviewer}
                    </span>
                  </div>
                )}
              </div>

              {src.sourceUrl && (
                <div className="pt-2">
                  <a
                    href={src.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-action hover:underline"
                  >
                    <span>Read Open Literature Source</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-button bg-surface border border-border text-ink text-sm font-semibold hover:bg-canvas transition-colors"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
}
