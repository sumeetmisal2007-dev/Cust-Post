"use client";

import React, { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRESET_MATERIALS, AvailableMaterialDef } from "@/components/setup/material-picker";
import { evaluateStartingMixture } from "@/lib/compost-rules/mixture-evaluator";
import { useSetupWizardStore } from "@/lib/stores/setup-wizard.store";
import { WasteInputItem } from "@/types/domain";
import { cn } from "@/lib/utils";

interface StepMaterialsProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepMaterials({ onNext, onBack }: StepMaterialsProps) {
  const { wasteItems, setWasteItems } = useSetupWizardStore();

  // Initialize selected materials from store or default presets (veg peels + dry leaves)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (wasteItems.length > 0) {
      return PRESET_MATERIALS.filter((m) =>
        wasteItems.some((wi) => wi.name === m.name)
      ).map((m) => m.id);
    }
    return ["veg_peels", "dry_leaves"];
  });

  const toggleMaterial = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedMaterialsArray = useMemo<WasteInputItem[]>(() => {
    return selectedIds.map((id) => {
      const def = PRESET_MATERIALS.find((m) => m.id === id)!;
      return {
        category: def.category,
        name: def.name,
        quantityWeekly: def.defaultKgWeekly,
        unit: "kg",
      };
    });
  }, [selectedIds]);

  const mixtureBalance = useMemo(() => {
    return evaluateStartingMixture(selectedMaterialsArray);
  }, [selectedMaterialsArray]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMaterialsArray.length === 0) return;
    setWasteItems(selectedMaterialsArray);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto text-left">
      <div className="space-y-2">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          What organic waste do you have?
        </h2>
        <p className="text-sm text-muted">
          Select what you produce each week. Composting requires a balance of wet nitrogen &quot;greens&quot; and dry carbon &quot;browns&quot;.
        </p>
      </div>

      {/* Excluded Item Alert Banner */}
      {mixtureBalance.excludedItemsFound.length > 0 && (
        <div className="rounded-card border border-error/30 bg-error-bg p-4 flex items-start gap-3 text-error">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-sm">Excluded Item Alert</h4>
            <p>
              You selected materials (<strong>{mixtureBalance.excludedItemsFound.join(", ")}</strong>) that are hazardous or attract vectors in household setups.
            </p>
            <p>
              Small-batch balcony composting should exclude meat, bones, pet feces, and non-biodegradable synthetics.
            </p>
          </div>
        </div>
      )}

      {/* Materials Picker Grid grouped by category */}
      <div className="space-y-6">
        {/* Greens Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-brand" aria-hidden="true" />
            <h3 className="font-display font-semibold text-base text-ink">
              Greens (Nitrogen & Moisture)
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESET_MATERIALS.filter((m) => m.category === "greens").map((m) => (
              <MaterialItemCard
                key={m.id}
                material={m}
                isSelected={selectedIds.includes(m.id)}
                onToggle={() => toggleMaterial(m.id)}
              />
            ))}
          </div>
        </div>

        {/* Browns Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#8B5A2B]" aria-hidden="true" />
            <h3 className="font-display font-semibold text-base text-ink">
              Browns (Carbon & Structure)
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESET_MATERIALS.filter((m) => m.category === "browns").map((m) => (
              <MaterialItemCard
                key={m.id}
                material={m}
                isSelected={selectedIds.includes(m.id)}
                onToggle={() => toggleMaterial(m.id)}
              />
            ))}
          </div>
        </div>

        {/* Caution & Excluded Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-warning" aria-hidden="true" />
            <h3 className="font-display font-semibold text-base text-ink">
              Caution & Excluded Items
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESET_MATERIALS.filter(
              (m) => m.category === "caution" || m.category === "excluded"
            ).map((m) => (
              <MaterialItemCard
                key={m.id}
                material={m}
                isSelected={selectedIds.includes(m.id)}
                onToggle={() => toggleMaterial(m.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mixture Balance Feedback Box */}
      <div className="rounded-card border border-border bg-mint/20 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Initial Brown/Green Balance
          </span>
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-0.5 rounded-full",
              mixtureBalance.status === "balanced"
                ? "bg-action/10 text-action"
                : "bg-warning/20 text-warning"
            )}
          >
            {mixtureBalance.status === "balanced" ? "Balanced" : "Adjustment Advised"}
          </span>
        </div>
        <p className="text-xs text-muted leading-relaxed">{mixtureBalance.advice}</p>
        <div className="flex gap-4 text-xs font-medium text-text pt-1">
          <span>Total Greens: ~{mixtureBalance.greensTotalKg} kg/wk</span>
          <span>Total Browns: ~{mixtureBalance.brownsTotalKg} kg/wk</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 flex items-center justify-between gap-4 border-t border-border">
        <Button type="button" variant="secondary" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to Container</span>
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={selectedMaterialsArray.length === 0}
        >
          <span>Continue to Preferences</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

function MaterialItemCard({
  material,
  isSelected,
  onToggle,
}: {
  material: AvailableMaterialDef;
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={cn(
        "flex items-start gap-3 p-3.5 rounded-card border text-left cursor-pointer transition-all min-h-[48px]",
        isSelected
          ? "border-action bg-surface ring-2 ring-action/20 shadow-sm"
          : "border-border bg-surface hover:bg-canvas"
      )}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggle}
        aria-label={material.label}
        className="mt-1 h-4 w-4 rounded text-action focus:ring-action"
      />
      <div>
        <div className="font-semibold text-sm text-ink">{material.label}</div>
        <div className="text-xs text-muted leading-snug mt-0.5">
          {material.description}
        </div>
      </div>
    </label>
  );
}
