"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Wind, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSetupWizardStore } from "@/lib/stores/setup-wizard.store";
import { MaintenanceCapacity, SmellSensitivity } from "@cust-post/backend";
import { cn } from "@/lib/utils";

interface StepPreferencesProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepPreferences({ onNext, onBack }: StepPreferencesProps) {
  const { preferences, setPreferences } = useSetupWizardStore();

  const [capacity, setCapacity] = useState<MaintenanceCapacity>(
    preferences.maintenanceCapacity || "weekly_turning"
  );
  const [sensitivity, setSensitivity] = useState<SmellSensitivity>(
    preferences.smellSensitivity || "medium"
  );
  const [worms, setWorms] = useState<boolean>(preferences.interestedInWorms || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPreferences({
      maintenanceCapacity: capacity,
      smellSensitivity: sensitivity,
      interestedInWorms: worms,
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto text-left">
      <div className="space-y-2">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          Maintenance & Preferences
        </h2>
        <p className="text-sm text-muted">
          Your willingness to turn the compost and tolerance for odor guide our method recommendation.
        </p>
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Clock className="h-4 w-4 text-action" aria-hidden="true" />
          <span>Maintenance Willingness</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: "daily_stirring",
              label: "Daily Stirring",
              desc: "Quick 2-minute daily check or stir.",
            },
            {
              id: "weekly_turning",
              label: "Weekly Turning",
              desc: "10 minutes turning twice a week (Standard).",
            },
            {
              id: "minimal_effort",
              label: "Minimal Effort",
              desc: "Low-touch passive system.",
            },
          ].map((opt) => (
            <button
              type="button"
              key={opt.id}
              onClick={() => setCapacity(opt.id as MaintenanceCapacity)}
              className={cn(
                "p-3.5 rounded-card border text-left transition-all min-h-[48px]",
                capacity === opt.id
                  ? "border-action bg-surface ring-2 ring-action/20 shadow-sm"
                  : "border-border bg-surface hover:bg-canvas"
              )}
            >
              <div className="font-semibold text-sm text-ink">{opt.label}</div>
              <div className="text-xs text-muted mt-1">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-border">
        <label className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Wind className="h-4 w-4 text-action" aria-hidden="true" />
          <span>Smell Sensitivity</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "high", label: "High Sensitivity", desc: "Zero tolerance for sour odor indoors." },
            { id: "medium", label: "Medium Tolerance", desc: "Outdoor balcony with ambient breeze." },
            { id: "low", label: "Low Tolerance", desc: "Dedicated terrace/garden corner." },
          ].map((opt) => (
            <button
              type="button"
              key={opt.id}
              onClick={() => setSensitivity(opt.id as SmellSensitivity)}
              className={cn(
                "p-3.5 rounded-card border text-left transition-all min-h-[48px]",
                sensitivity === opt.id
                  ? "border-action bg-surface ring-2 ring-action/20 shadow-sm"
                  : "border-border bg-surface hover:bg-canvas"
              )}
            >
              <div className="font-semibold text-sm text-ink">{opt.label}</div>
              <div className="text-xs text-muted mt-1">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-border">
        <label className="flex items-start gap-3 p-4 rounded-card border border-border bg-surface cursor-pointer hover:bg-canvas">
          <input
            type="checkbox"
            checked={worms}
            onChange={(e) => setWorms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded text-action focus:ring-action"
          />
          <div>
            <div className="flex items-center gap-2 font-semibold text-sm text-ink">
              <Bug className="h-4 w-4 text-brand" aria-hidden="true" />
              <span>Interested in Vermicomposting (Worm Bin)?</span>
            </div>
            <div className="text-xs text-muted leading-relaxed mt-0.5">
              Red Wriggler worms create rich vermicastings in small balcony spaces. Requires keeping bin in shaded, moderate temperatures.
            </div>
          </div>
        </label>
      </div>

      <div className="pt-4 flex items-center justify-between gap-4 border-t border-border">
        <Button type="button" variant="secondary" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to Materials</span>
        </Button>
        <Button type="submit" size="lg">
          <span>Review Setup Summary</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
