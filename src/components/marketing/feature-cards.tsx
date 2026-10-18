import React from "react";
import { ShieldCheck, ClipboardList, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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
          <Card className="hover:border-action/40 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-control bg-mint flex items-center justify-center text-action mb-3">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <CardTitle>Screen Your Container</CardTitle>
              <CardDescription>
                Screen plastic buckets, crates, and terracotta pots for aeration, drainage, and toxic chemical history before starting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatusChip status="estimated" label="Calculates geometric volume" />
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="hover:border-action/40 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-control bg-mint flex items-center justify-center text-action mb-3">
                <ClipboardList className="h-6 w-6" aria-hidden="true" />
              </div>
              <CardTitle>Track Real Batches</CardTitle>
              <CardDescription>
                Log weekly scrap additions, moisture checks, temperature readings, and turning actions with an honest chronological timeline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatusChip status="measured" label="Direct measured weights" />
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="hover:border-action/40 transition-colors">
            <CardHeader>
              <div className="h-12 w-12 rounded-control bg-mint flex items-center justify-center text-action mb-3">
                <Sparkles className="h-6 w-6" aria-hidden="true" />
              </div>
              <CardTitle>Evidence-First Advice</CardTitle>
              <CardDescription>
                Diagnose odor, excess moisture, or fruit flies with step-by-step conditional troubleshooting cited to EPA and MCGM handbooks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatusChip status="user_reported" label="Cites EPA & MCGM guides" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
