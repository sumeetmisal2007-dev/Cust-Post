"use client";

import React, { useState } from "react";
import {
  Wind,
  Droplets,
  Flame,
  Bug,
  Clock,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import { CompostSymptom, TroubleshootingInputs } from "@/lib/compost-rules/troubleshooter";
import { cn } from "@/lib/utils";

interface SymptomSelectorProps {
  selectedSymptom: CompostSymptom | null;
  onSelectSymptom: (inputs: Omit<TroubleshootingInputs, "method">) => void;
}

export function SymptomSelector({
  selectedSymptom,
  onSelectSymptom,
}: SymptomSelectorProps) {
  const [standingWater, setStandingWater] = useState(false);
  const [surfaceFood, setSurfaceFood] = useState(false);
  const [dryState, setDryState] = useState(false);

  const symptomsList: Array<{
    id: CompostSymptom;
    label: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: "foul_odor_ammonia_rot",
      label: "Foul Rotten Egg or Ammonia Odor",
      desc: "Sour pungent smell indicating anaerobic stagnant conditions.",
      icon: Wind,
    },
    {
      id: "excess_moisture_soggy",
      label: "Excess Moisture & Soggy Sludge",
      desc: "Compost dripping wet, muddy or standing liquid in base.",
      icon: Droplets,
    },
    {
      id: "too_dry_no_breakdown",
      label: "Too Dry / Inactive & Cold",
      desc: "Material dusty, leaves not decomposing, pile cold.",
      icon: Flame,
    },
    {
      id: "pests_fruit_flies_maggots",
      label: "Pests, Fruit Flies & Maggots",
      desc: "Swarms of gnats, flies, or larvae on food scraps.",
      icon: Bug,
    },
    {
      id: "slow_decomposition",
      label: "Slow Decomposition / Stalled Pile",
      desc: "Scraps taking months without breaking down.",
      icon: Clock,
    },
    {
      id: "rodent_intrusion",
      label: "Rodent or Animal Signs",
      desc: "Chewed bin corners, burrowing, or gnaw marks.",
      icon: ShieldAlert,
    },
  ];

  const handleChoose = (symId: CompostSymptom) => {
    onSelectSymptom({
      symptom: symId,
      hasStandingWater: standingWater,
      surfaceFoodVisible: surfaceFood,
      isDry: dryState,
    });
  };

  const handleWaterToggle = (checked: boolean) => {
    setStandingWater(checked);
    if (selectedSymptom) {
      onSelectSymptom({
        symptom: selectedSymptom,
        hasStandingWater: checked,
        surfaceFoodVisible: surfaceFood,
        isDry: dryState,
      });
    }
  };

  const handleFoodToggle = (checked: boolean) => {
    setSurfaceFood(checked);
    if (selectedSymptom) {
      onSelectSymptom({
        symptom: selectedSymptom,
        hasStandingWater: standingWater,
        surfaceFoodVisible: checked,
        isDry: dryState,
      });
    }
  };

  const handleDryToggle = (checked: boolean) => {
    setDryState(checked);
    if (selectedSymptom) {
      onSelectSymptom({
        symptom: selectedSymptom,
        hasStandingWater: standingWater,
        surfaceFoodVisible: surfaceFood,
        isDry: checked,
      });
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="space-y-1">
        <h3 className="font-display text-lg font-bold text-ink">
          Select Observed Symptom
        </h3>
        <p className="text-xs text-muted">
          Choose the primary issue you are noticing in your bin. Every corrective action is cited from open composting research.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {symptomsList.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedSymptom === item.id;

          return (
            <button
              type="button"
              key={item.id}
              onClick={() => handleChoose(item.id)}
              className={cn(
                "p-4 rounded-card border text-left transition-all min-h-[56px] flex items-start gap-3",
                isSelected
                  ? "border-action bg-surface ring-2 ring-action/20 shadow-sm"
                  : "border-border bg-surface hover:bg-canvas"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-full shrink-0",
                  isSelected ? "bg-action/10 text-action" : "bg-canvas text-muted"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-ink">{item.label}</div>
                <div className="text-xs text-muted mt-0.5 leading-relaxed">
                  {item.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Conditional diagnostic questions */}
      {selectedSymptom === "excess_moisture_soggy" && (
        <div className="p-4 rounded-card border border-sky-200 bg-sky-50/60 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-sky-950">
            <input
              type="checkbox"
              checked={standingWater}
              onChange={(e) => handleWaterToggle(e.target.checked)}
              className="rounded text-action"
            />
            <span>Is standing water visible in the base or collection tray?</span>
          </label>
        </div>
      )}

      {selectedSymptom === "pests_fruit_flies_maggots" && (
        <div className="p-4 rounded-card border border-amber-200 bg-amber-50/60 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-amber-950">
            <input
              type="checkbox"
              checked={surfaceFood}
              onChange={(e) => handleFoodToggle(e.target.checked)}
              className="rounded text-action"
            />
            <span>Are fresh, uncovered surface food scraps visible?</span>
          </label>
        </div>
      )}

      {selectedSymptom === "too_dry_no_breakdown" && (
        <div className="p-4 rounded-card border border-amber-200 bg-amber-50/60 text-xs">
          <label className="flex items-center gap-2 cursor-pointer font-medium text-amber-950">
            <input
              type="checkbox"
              checked={dryState}
              onChange={(e) => handleDryToggle(e.target.checked)}
              className="rounded text-action"
            />
            <span>Does pile feel completely dry and dusty through the core?</span>
          </label>
        </div>
      )}
    </div>
  );
}
