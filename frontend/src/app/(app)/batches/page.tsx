"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sprout,
  PlusCircle,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Home,
  ShieldCheck,
  TrendingUp,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompostBatch } from "@cust-post/backend";
import { batchStorageService } from "@cust-post/backend";
import { StatusChip } from "@/components/ui/status-chip";

export default function BatchesIndexPage() {
  const [batches, setBatches] = useState<CompostBatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await batchStorageService.listBatches();
        setBatches(list);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalMeasured = batches.reduce(
    (sum, b) => sum + (b.totalMeasuredInputKg || 0),
    0
  );
  const totalEstimated = batches.reduce(
    (sum, b) => sum + (b.totalEstimatedInputKg || 0),
    0
  );
  const activeBatches = batches.filter((b) => b.status === "active");

  if (loading) {
    return (
      <div className="py-20 max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-surface border border-border shadow-soft text-muted text-sm font-medium">
          <div className="h-4 w-4 rounded-full border-2 border-action border-t-transparent animate-spin" />
          <span>Loading your composting dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 space-y-10 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint border border-border text-xs font-semibold text-action">
            <Sprout className="h-3.5 w-3.5" />
            <span>Apartment Composting Tracker</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            My Composting Batches
          </h1>
          <p className="text-sm text-muted">
            Track active bins, log kitchen additions, and monitor biological readiness for your balcony plants.
          </p>
        </div>

        <div>
          <Button asChild size="default">
            <Link href="/setup">
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Start New Batch</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* When Batches Exist: Overview Dashboard */}
      {batches.length > 0 ? (
        <div className="space-y-8">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-card border border-border bg-surface shadow-soft space-y-1.5">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                Active Bins
              </span>
              <div className="text-3xl font-display font-bold text-ink">
                {activeBatches.length}
                <span className="text-sm font-normal text-muted ml-2">
                  of {batches.length} total
                </span>
              </div>
              <p className="text-xs text-muted">
                {activeBatches.length > 0
                  ? "Aeration & turning schedule active"
                  : "All current batches completed"}
              </p>
            </div>

            <div className="p-5 rounded-card border border-border bg-surface shadow-soft space-y-1.5">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                Measured Kitchen Waste
              </span>
              <div className="text-3xl font-display font-bold text-action">
                {totalMeasured.toFixed(1)}
                <span className="text-sm font-normal text-muted ml-1.5">kg</span>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <StatusChip status="measured" label="Weighed input" className="py-0.5 px-2 text-[10px]" />
              </div>
            </div>

            <div className="p-5 rounded-card border border-border bg-surface shadow-soft space-y-1.5">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                Estimated Organic Inputs
              </span>
              <div className="text-3xl font-display font-bold text-earth">
                {totalEstimated.toFixed(1)}
                <span className="text-sm font-normal text-muted ml-1.5">kg</span>
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <StatusChip status="estimated" label="Calculated" className="py-0.5 px-2 text-[10px]" />
              </div>
            </div>
          </div>

          {/* Batches Grid */}
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-ink">
              Your Batch Registry
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {batches.map((batch) => {
                const isActive = batch.status === "active";
                const methodLabel =
                  batch.method === "aerobic_bin"
                    ? "Aerobic Balcony Bin"
                    : (batch.method as string) === "vermicompost" || batch.method === "vermicomposting"
                    ? "Worm Vermicompost"
                    : batch.method === "bokashi"
                    ? "Airtight Bokashi"
                    : "Terracotta Pot Composting";

                return (
                  <div
                    key={batch.id}
                    className="p-6 rounded-card border border-border bg-surface shadow-soft hover:border-action/40 transition-all flex flex-col justify-between space-y-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-full border ${
                              isActive
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : "bg-muted/15 text-muted border-border"
                            }`}
                          >
                            {batch.status}
                          </span>
                          <h3 className="font-display text-xl font-bold text-ink leading-snug">
                            {batch.batchName}
                          </h3>
                        </div>
                        <span className="text-xs font-mono text-muted bg-canvas px-2.5 py-1 rounded-control border border-border">
                          {methodLabel}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-muted pt-2 border-t border-border/70">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-action" />
                          <span>Started {batch.startDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Scale className="h-3.5 w-3.5 text-action" />
                          <span>
                            {(batch.totalMeasuredInputKg + batch.totalEstimatedInputKg).toFixed(1)} kg total
                          </span>
                        </div>
                      </div>

                      {batch.readinessWindowStart && (
                        <div className="p-3 rounded-control bg-canvas/70 border border-border text-xs space-y-1">
                          <span className="font-semibold text-ink">
                            Estimated Window:
                          </span>{" "}
                          <span className="text-muted">
                            {batch.readinessWindowStart} to {batch.readinessWindowEnd}
                          </span>
                          <p className="text-[11px] text-muted italic">
                            *Subject to 4-point physical maturity verification before application
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-border">
                      <Link
                        href={`/batches/${batch.id}/troubleshoot`}
                        className="text-xs font-medium text-muted hover:text-earth underline-offset-2 hover:underline"
                      >
                        Troubleshoot
                      </Link>

                      <Button asChild size="sm">
                        <Link href={`/batches/${batch.id}`}>
                          <span>View Dashboard</span>
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State for Apartment Beginners */
        <div className="space-y-8">
          <div className="p-8 sm:p-12 rounded-panel border border-border bg-gradient-to-br from-surface via-surface to-mint/20 shadow-soft text-center space-y-6 max-w-2xl mx-auto">
            <div className="h-16 w-16 rounded-full bg-mint/80 border border-border text-action flex items-center justify-center mx-auto shadow-sm">
              <Sprout className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                No composting batches yet
              </h2>
              <p className="text-sm sm:text-base text-muted max-w-lg mx-auto leading-relaxed">
                Living in an apartment? You don&apos;t need a backyard. A 20-litre bucket or clay pot on your balcony can divert 3–5 kg of food scraps weekly with zero odor when properly aerated.
              </p>
            </div>

            <div className="pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/setup">
                  <span>Start Your First Setup</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Beginner Apartment Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-card border border-border bg-surface shadow-soft space-y-2.5">
              <div className="h-9 w-9 rounded-control bg-mint text-action font-display font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="font-display font-bold text-base text-ink">
                Screen Your Vessel
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Check whether a plastic bucket, terracotta khamba, or wooden crate fits your balcony space and has proper aeration holes.
              </p>
            </div>

            <div className="p-5 rounded-card border border-border bg-surface shadow-soft space-y-2.5">
              <div className="h-9 w-9 rounded-control bg-earth-subtle text-earth font-display font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="font-display font-bold text-base text-ink">
                Balance Wet & Dry
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Layer 2 parts dry browns (cardboard, dry leaves) for every 1 part wet kitchen peels to prevent sour ammonia odor.
              </p>
            </div>

            <div className="p-5 rounded-card border border-border bg-surface shadow-soft space-y-2.5">
              <div className="h-9 w-9 rounded-control bg-accent/20 text-accent font-display font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="font-display font-bold text-base text-ink">
                Feed Your Potted Plants
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Verify the 4-point maturity check, then blend 20–30% compost safely into balcony containers for lush basil, mint, and tomatoes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
