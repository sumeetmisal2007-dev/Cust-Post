import React from "react";
import { ShieldCheck, ClipboardList, Sparkles } from "lucide-react";
import { StatusChip } from "@/components/ui/status-chip";

export function FeatureCards() {
  return (
    <section className="py-12 bg-surface/50 border-y border-border">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
            Honest, explainable home composting
          </h2>
          <p className="text-sm text-muted">
            Every recommendation reveals its scientific reason, safety limits, and source citation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-card border border-border bg-surface text-text shadow-sm p-6 flex flex-col justify-between space-y-4 hover:border-action/40 transition-colors">
            <div className="space-y-2">
              <div className="h-12 w-12 rounded-control bg-mint flex items-center justify-center text-action mb-3">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-ink">
                Screen Your Container
              </h3>
              <p className="text-sm text-muted">
                Screen plastic buckets, crates, and terracotta pots for aeration, drainage, and toxic chemical history before starting.
              </p>
            </div>
            <div>
              <StatusChip status="estimated" label="Calculates geometric volume" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-card border border-border bg-surface text-text shadow-sm p-6 flex flex-col justify-between space-y-4 hover:border-action/40 transition-colors">
            <div className="space-y-2">
              <div className="h-12 w-12 rounded-control bg-mint flex items-center justify-center text-action mb-3">
                <ClipboardList className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-ink">
                Track Real Batches
              </h3>
              <p className="text-sm text-muted">
                Log weekly scrap additions, moisture checks, temperature readings, and turning actions with an honest chronological timeline.
              </p>
            </div>
            <div>
              <StatusChip status="measured" label="Direct measured weights" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-card border border-border bg-surface text-text shadow-sm p-6 flex flex-col justify-between space-y-4 hover:border-action/40 transition-colors">
            <div className="space-y-2">
              <div className="h-12 w-12 rounded-control bg-mint flex items-center justify-center text-action mb-3">
                <Sparkles className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-semibold leading-tight tracking-tight text-ink">
                Evidence-First Advice
              </h3>
              <p className="text-sm text-muted">
                Diagnose odor, excess moisture, or fruit flies with step-by-step conditional troubleshooting cited to EPA and MCGM handbooks.
              </p>
            </div>
            <div>
              <StatusChip status="user_reported" label="Cites EPA & MCGM guides" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
