"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  Scale,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOURCES_REGISTRY } from "@cust-post/backend";
import { FeedbackModal } from "@/components/feedback/feedback-modal";

export default function SourcesPage() {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const sources = Object.values(SOURCES_REGISTRY);

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 space-y-8 text-left">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <span className="text-xs font-mono text-muted uppercase">Rule Provenance v1.0</span>
      </div>

      {/* Hero Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-action/10 text-action border border-action/30">
          <ShieldCheck className="h-4 w-4" />
          <span>Transparent & Testable Guidelines</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">
          Open Literature & Rule Provenance Registry
        </h1>
        <p className="text-sm text-muted leading-relaxed max-w-2xl">
          Cust-Post uses deterministic rule engines instead of black-box language model verdicts for all safety-critical advice. Every container verdict, volume threshold, and symptom fix is cited directly from verified open literature.
        </p>
      </div>

      {/* SDG Trust Strip */}
      <div className="p-4 rounded-card border border-emerald-300 bg-emerald-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-white shadow-xs text-action">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              UN Sustainable Development Goal 12
            </div>
            <div className="text-sm font-semibold text-ink">
              Target 12.5: Substantially reduce waste generation through prevention, reduction, recycling, and reuse.
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setIsFeedbackOpen(true)}
          className="shrink-0"
        >
          <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
          <span>Suggest Source / Correction</span>
        </Button>
      </div>

      {/* Sources Grid */}
      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold text-ink flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-action" />
          <span>Active Citation Index ({sources.length} Rules)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((src) => (
            <div
              key={src.ruleId}
              className="p-5 rounded-card border border-border bg-surface shadow-xs space-y-3 text-left flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-action-soft text-action border border-action/20">
                    {src.ruleId}
                  </span>
                  <span className="text-[11px] text-muted">v{src.version}</span>
                </div>

                <h3 className="font-semibold text-sm text-ink leading-snug">
                  {src.title}
                </h3>

                <div className="text-xs text-muted space-y-1 pt-1">
                  <div>
                    <span className="font-medium text-ink">Publishing Body: </span>
                    <span>{src.organization}</span>
                  </div>
                  {src.reviewer && (
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-accent-dark shrink-0" />
                      <span>
                        <strong className="text-ink">Peer Reviewer: </strong>
                        {src.reviewer}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <a
                  href={src.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-action hover:underline"
                >
                  <span>Read Source Literature</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        contextSnapshot={{ location: "/sources" }}
      />
    </div>
  );
}
