"use client";

import React, { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, AlertTriangle, Info } from "lucide-react";
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

interface MaterialQuantityState {
  quantity: number;
  unit: "kg" | "litres";
  isCustom: boolean;
}

export function StepMaterials({ onNext, onBack }: StepMaterialsProps) {
  const { wasteItems, setWasteItems } = useSetupWizardStore();

  // Initialize selected materials and quantities from store or default presets (veg peels + dry leaves)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (wasteItems.length > 0) {
      return PRESET_MATERIALS.filter((m) =>
        wasteItems.some((wi) => wi.name === m.name)
      ).map((m) => m.id);
    }
    return ["veg_peels", "dry_leaves"];
  });

  const [quantities, setQuantities] = useState<Record<string, MaterialQuantityState>>(() => {
    const initialMap: Record<string, MaterialQuantityState> = {};
    for (const def of PRESET_MATERIALS) {
      const existing = wasteItems.find((wi) => wi.name === def.name);
      if (existing) {
        initialMap[def.id] = {
          quantity: existing.quantityWeekly,
          unit: existing.unit,
          isCustom: existing.quantityWeekly !== def.defaultKgWeekly || existing.unit !== "kg",
        };
      } else {
        initialMap[def.id] = {
          quantity: def.defaultKgWeekly,
          unit: "kg",
          isCustom: false,
        };
      }
    }
    return initialMap;
  });

  const toggleMaterial = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleQuantityChange = (id: string, qty: number) => {
    setQuantities((prev) => {
      const current = prev[id] || {
        quantity: PRESET_MATERIALS.find((m) => m.id === id)?.defaultKgWeekly ?? 1,
        unit: "kg",
        isCustom: false,
      };
      return {
        ...prev,
        [id]: {
          ...current,
          quantity: qty > 0 ? qty : 0.1,
          isCustom: true,
        },
      };
    });
  };

  const handleUnitChange = (id: string, unit: "kg" | "litres") => {
    setQuantities((prev) => {
      const current = prev[id] || {
        quantity: PRESET_MATERIALS.find((m) => m.id === id)?.defaultKgWeekly ?? 1,
        unit: "kg",
        isCustom: false,
      };
      return {
        ...prev,
        [id]: {
          ...current,
          unit,
          isCustom: true,
        },
      };
    });
  };

  const selectedMaterialsArray = useMemo<WasteInputItem[]>(() => {
    return selectedIds.map((id) => {
      const def = PRESET_MATERIALS.find((m) => m.id === id)!;
      const qState = quantities[id];
      return {
        category: def.category,
        name: def.name,
        quantityWeekly: qState?.quantity ?? def.defaultKgWeekly,
        unit: qState?.unit ?? "kg",
      };
    });
  }, [selectedIds, quantities]);

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
          Select materials and adjust weekly amounts to match your household. Default amounts are labeled as estimates to help you get started.
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
            {PRESET_MATERIALS.filter((m) => m.category === "greens").map((m) => {
              const qState = quantities[m.id];
              return (
                <MaterialItemCard
                  key={m.id}
                  material={m}
                  isSelected={selectedIds.includes(m.id)}
                  quantity={qState?.quantity ?? m.defaultKgWeekly}
                  unit={qState?.unit ?? "kg"}
                  isCustom={qState?.isCustom ?? false}
                  onToggle={() => toggleMaterial(m.id)}
                  onQuantityChange={(qty) => handleQuantityChange(m.id, qty)}
                  onUnitChange={(unit) => handleUnitChange(m.id, unit)}
                />
              );
            })}
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
            {PRESET_MATERIALS.filter((m) => m.category === "browns").map((m) => {
              const qState = quantities[m.id];
              return (
                <MaterialItemCard
                  key={m.id}
                  material={m}
                  isSelected={selectedIds.includes(m.id)}
                  quantity={qState?.quantity ?? m.defaultKgWeekly}
                  unit={qState?.unit ?? "kg"}
                  isCustom={qState?.isCustom ?? false}
                  onToggle={() => toggleMaterial(m.id)}
                  onQuantityChange={(qty) => handleQuantityChange(m.id, qty)}
                  onUnitChange={(unit) => handleUnitChange(m.id, unit)}
                />
              );
            })}
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
            ).map((m) => {
              const qState = quantities[m.id];
              return (
                <MaterialItemCard
                  key={m.id}
                  material={m}
                  isSelected={selectedIds.includes(m.id)}
                  quantity={qState?.quantity ?? m.defaultKgWeekly}
                  unit={qState?.unit ?? "kg"}
                  isCustom={qState?.isCustom ?? false}
                  onToggle={() => toggleMaterial(m.id)}
                  onQuantityChange={(qty) => handleQuantityChange(m.id, qty)}
                  onUnitChange={(unit) => handleUnitChange(m.id, unit)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Mixture Balance Feedback Box */}
      <div className="rounded-card border border-border bg-mint/20 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              Live Mixture Balance
            </span>
            <div className="text-[11px] text-muted">
              Calculated from your entered amounts using material bulk density
            </div>
          </div>
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0",
              mixtureBalance.status === "balanced"
                ? "bg-action/10 text-action"
                : "bg-warning/20 text-warning"
            )}
          >
            {mixtureBalance.status === "balanced" ? "Balanced Ratio" : "Adjustment Advised"}
          </span>
        </div>

        <p className="text-xs text-text leading-relaxed font-medium">{mixtureBalance.advice}</p>

        {/* Detailed Breakdown by Weight and Volume */}
        <div className="pt-2 border-t border-border/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded bg-surface border border-border/80">
            <span className="text-muted block text-[11px]">Total Greens:</span>
            <span className="font-semibold text-ink">
              ~{mixtureBalance.greensTotalKg} kg/wk (~{mixtureBalance.greensTotalLitres} L)
            </span>
          </div>
          <div className="p-2.5 rounded bg-surface border border-border/80">
            <span className="text-muted block text-[11px]">Total Browns:</span>
            <span className="font-semibold text-ink">
              ~{mixtureBalance.brownsTotalKg} kg/wk (~{mixtureBalance.brownsTotalLitres} L)
            </span>
          </div>
          <div className="p-2.5 rounded bg-surface border border-border/80">
            <span className="text-muted block text-[11px]">Est. Volume Ratio:</span>
            <span className="font-semibold text-ink">
              ~{mixtureBalance.volumeRatioBrownsToGreens}:1 (Browns : Greens)
            </span>
          </div>
        </div>

        <div className="text-[11px] text-muted flex items-start gap-1.5 pt-1">
          <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-action" aria-hidden="true" />
          <span>
            <strong>Why volume matters:</strong> Lightweight dry browns (leaves, cardboard) are ~6–8× lighter than wet kitchen scraps. A ~2:1 to 3:1 volume ratio provides the structural air pockets needed to prevent odor.
          </span>
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
  quantity,
  unit,
  isCustom,
  onToggle,
  onQuantityChange,
  onUnitChange,
}: {
  material: AvailableMaterialDef;
  isSelected: boolean;
  quantity: number;
  unit: "kg" | "litres";
  isCustom: boolean;
  onToggle: () => void;
  onQuantityChange: (qty: number) => void;
  onUnitChange: (unit: "kg" | "litres") => void;
}) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "flex flex-col justify-between p-3.5 rounded-card border text-left cursor-pointer transition-all min-h-[56px]",
        isSelected
          ? "border-action bg-surface ring-2 ring-action/20 shadow-sm"
          : "border-border bg-surface hover:bg-canvas"
      )}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggle}
          onClick={(e) => e.stopPropagation()}
          aria-label={material.label}
          className="mt-1 h-4 w-4 rounded text-action focus:ring-action shrink-0"
        />
        <div className="flex-1">
          <div className="font-semibold text-sm text-ink">{material.label}</div>
          <div className="text-xs text-muted leading-snug mt-0.5">
            {material.description}
          </div>
          {!isSelected && (
            <div className="text-[11px] text-muted/70 mt-1 font-medium">
              Default estimate: ~{material.defaultKgWeekly} kg/week
            </div>
          )}
        </div>
      </div>

      {/* Active Quantity Input Controls */}
      {isSelected && (
        <div
          className="mt-3 pt-2.5 border-t border-border/80 flex flex-wrap items-center justify-between gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <label
            htmlFor={`qty-${material.id}`}
            className="text-xs font-medium text-ink flex items-center gap-1.5"
          >
            <span>Weekly Quantity:</span>
            <span
              className={cn(
                "text-[10px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider",
                isCustom
                  ? "bg-action/15 text-action font-semibold"
                  : "bg-muted/15 text-muted"
              )}
            >
              {isCustom ? "Custom" : "Est. Default"}
            </span>
          </label>
          <div className="flex items-center gap-1.5">
            <input
              id={`qty-${material.id}`}
              type="number"
              step="0.1"
              min="0.1"
              max="50"
              value={quantity}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onQuantityChange(isNaN(val) ? 0.1 : val);
              }}
              aria-label={`${material.label} quantity in ${unit}`}
              className="w-20 px-2 py-1 text-xs font-semibold text-right rounded border border-border bg-surface text-ink focus:ring-1 focus:ring-action"
            />
            <select
              value={unit}
              onChange={(e) => onUnitChange(e.target.value as "kg" | "litres")}
              aria-label={`${material.label} unit`}
              className="px-1.5 py-1 text-xs rounded border border-border bg-surface text-ink font-medium focus:ring-1 focus:ring-action"
            >
              <option value="kg">kg/wk</option>
              <option value="litres">L/wk</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
