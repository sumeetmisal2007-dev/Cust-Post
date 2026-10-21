"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Layers,
  Wind,
  Thermometer,
  Apple,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhysicalMaturityChecks } from "@cust-post/backend";
import { evaluateMaturityChecklist } from "@cust-post/backend";

interface MaturityChecklistProps {
  batchId: string;
  onComplete: () => void;
}

export function MaturityChecklist({ batchId, onComplete }: MaturityChecklistProps) {
  const [checks, setChecks] = useState<PhysicalMaturityChecks>({
    darkCrumblyTexture: false,
    earthyOdorNoRot: false,
    ambientTemperature: false,
    foodScrapsDecomposed: false,
  });

  const verdict = evaluateMaturityChecklist(checks);

  const toggleCheck = (key: keyof PhysicalMaturityChecks) => {
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const checklistItems: Array<{
    key: keyof PhysicalMaturityChecks;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      key: "darkCrumblyTexture",
      label: "Dark Crumbly Texture",
      description:
        "Color is deep brown or black. The texture is crumbly, granular, and spongy like potting soil, not muddy sludge.",
      icon: Layers,
    },
    {
      key: "earthyOdorNoRot",
      label: "Earthy Odor with Zero Rotting Odor",
      description:
        "Smells like rich forest rain or pleasant damp earth. Zero sour, vinegary, sulfur, or ammonia smell remains.",
      icon: Wind,
    },
    {
      key: "ambientTemperature",
      label: "Ambient Outdoor Temperature",
      description:
        "The pile has completely cooled to match ambient outdoor air temperature for at least 7 consecutive days without reheating when turned.",
      icon: Thermometer,
    },
    {
      key: "foodScrapsDecomposed",
      label: "Food Scraps Unrecognizable",
      description:
        "Original fruit peels, vegetable scraps, and paper are completely decomposed and unrecognizable (tough avocado skins or small twigs can be sifted out).",
      icon: Apple,
    },
  ];

  return (
    <div className="space-y-6 text-left max-w-2xl mx-auto">
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-ink">
          Physical Maturity Verification Gate
        </h2>
        <p className="text-sm text-muted">
          Compost cannot be harvested by calendar time alone. Before applying compost to indoor or balcony plants, all 4 physical tests must be explicitly verified.
        </p>
      </div>

      <div className="space-y-3">
        {checklistItems.map((item) => {
          const Icon = item.icon;
          const isChecked = checks[item.key];

          return (
            <label
              key={item.key}
              className={`p-4 rounded-card border flex items-start gap-3.5 cursor-pointer transition-all ${
                isChecked
                  ? "border-emerald-400 bg-emerald-50/50 shadow-xs"
                  : "border-border bg-surface hover:bg-canvas"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleCheck(item.key)}
                className="mt-1 h-5 w-5 rounded text-action focus:ring-action"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Icon
                    className={`h-4 w-4 ${isChecked ? "text-emerald-700" : "text-muted"}`}
                  />
                  <span className="font-semibold text-sm text-ink">{item.label}</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{item.description}</p>
              </div>
            </label>
          );
        })}
      </div>

      {verdict.isReady ? (
        <div className="p-5 rounded-card border border-emerald-300 bg-emerald-50 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <CheckCircle2 className="h-5 w-5 text-emerald-700" />
            <span>Mature & Ready for Use! 🎉</span>
          </div>
          <p className="text-xs text-emerald-950 font-medium leading-relaxed">
            {verdict.safeApplicationGuidance}
          </p>
        </div>
      ) : (
        <div className="p-5 rounded-card border border-amber-200 bg-amber-50/80 space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertCircle className="h-5 w-5 text-amber-700" />
            <span>Compost Not Ready Yet — Keep Curing</span>
          </div>
          <p className="text-xs text-amber-950 leading-relaxed">
            Applying immature compost can starve plant roots of nitrogen and generate phytotoxins that cause root burn. Keep curing and re-check in 2 weeks.
          </p>
        </div>
      )}

      <div className="pt-4 flex items-center justify-between gap-4 border-t border-border">
        <div className="text-xs text-muted">
          <span>{Object.values(checks).filter(Boolean).length} of 4 criteria confirmed</span>
        </div>

        <Button
          type="button"
          size="lg"
          disabled={!verdict.isReady}
          onClick={onComplete}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          <span>Confirm Batch Ready</span>
        </Button>
      </div>
    </div>
  );
}
