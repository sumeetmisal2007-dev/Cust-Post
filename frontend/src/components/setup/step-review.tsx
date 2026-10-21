"use client";

import React from "react";
import { ArrowLeft, Sparkles, Pencil, MapPin, Box, Apple, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSetupWizardStore } from "@/lib/stores/setup-wizard.store";

interface StepReviewProps {
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function StepReview({ onEditStep, onSubmit, onBack }: StepReviewProps) {
  const { spaceProfile, containerInputs, wasteItems, preferences } = useSetupWizardStore();

  const formatText = (str?: string) => {
    if (!str) return "Not specified";
    return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto text-left">
      <div className="space-y-2">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          Setup Summary Review
        </h2>
        <p className="text-sm text-muted">
          Review your space, container, organic materials, and preferences before our deterministic rule engine evaluates your setup.
        </p>
      </div>

      <div className="space-y-4">

        <div className="p-4 rounded-card border border-border bg-surface">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-action" aria-hidden="true" />
              <span className="font-semibold text-sm text-ink">1. Space Profile</span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-action hover:underline"
              aria-label="Edit Space"
            >
              <Pencil className="h-3 w-3" />
              <span>Edit</span>
            </button>
          </div>
          <div className="mt-3 text-sm text-muted space-y-1">
            <div>
              <span className="font-medium text-ink">Location: </span>
              <span>{formatText(spaceProfile?.locationType || "Balcony")}</span>
            </div>
            {spaceProfile && (
              <div>
                <span className="font-medium text-ink">Footprint: </span>
                <span>
                  {spaceProfile.lengthCm} cm × {spaceProfile.widthCm} cm
                  {spaceProfile.maxHeightCm ? ` (Max Height: ${spaceProfile.maxHeightCm} cm)` : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 rounded-card border border-border bg-surface">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Box className="h-4 w-4 text-action" aria-hidden="true" />
              <span className="font-semibold text-sm text-ink">2. Container Details</span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-action hover:underline"
              aria-label="Edit Container"
            >
              <Pencil className="h-3 w-3" />
              <span>Edit</span>
            </button>
          </div>
          <div className="mt-3 text-sm text-muted space-y-1">
            <div>
              <span className="font-medium text-ink">Material & Type: </span>
              <span>{formatText(containerInputs?.material || "Plastic Bucket")}</span>
            </div>
            {containerInputs && (
              <>
                <div>
                  <span className="font-medium text-ink">Dimensions: </span>
                  <span>
                    {containerInputs.shape === "cylindrical"
                      ? `Diameter ${containerInputs.diameterCm} cm × Height ${containerInputs.internalHeightCm} cm`
                      : `${containerInputs.internalLengthCm} × ${containerInputs.internalWidthCm} × ${containerInputs.internalHeightCm} cm`}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-ink">Previous Use: </span>
                  <span>{formatText(containerInputs.previousUse)}</span>
                </div>
                <div>
                  <span className="font-medium text-ink">Drainage & Ventilation: </span>
                  <span>
                    {containerInputs.hasDrainageHoles ? "Drainage holes present" : "No drainage holes"},{" "}
                    {containerInputs.hasVentilationHoles ? "Aeration holes present" : "No aeration holes"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-4 rounded-card border border-border bg-surface">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Apple className="h-4 w-4 text-action" aria-hidden="true" />
              <span className="font-semibold text-sm text-ink">3. Organic Waste Inputs</span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-action hover:underline"
              aria-label="Edit Materials"
            >
              <Pencil className="h-3 w-3" />
              <span>Edit</span>
            </button>
          </div>
          <div className="mt-3 text-sm text-muted">
            {wasteItems.length === 0 ? (
              <p className="italic">No waste items recorded</p>
            ) : (
              <ul className="space-y-1">
                {wasteItems.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{formatText(item.name)}</span>
                    <span className="text-ink font-medium">
                      {item.quantityWeekly} {item.unit}/week
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="p-4 rounded-card border border-border bg-surface">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-action" aria-hidden="true" />
              <span className="font-semibold text-sm text-ink">4. Preferences</span>
            </div>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-action hover:underline"
              aria-label="Edit Preferences"
            >
              <Pencil className="h-3 w-3" />
              <span>Edit</span>
            </button>
          </div>
          <div className="mt-3 text-sm text-muted space-y-1">
            <div>
              <span className="font-medium text-ink">Maintenance Capacity: </span>
              <span>{formatText(preferences.maintenanceCapacity)}</span>
            </div>
            <div>
              <span className="font-medium text-ink">Smell Sensitivity: </span>
              <span>{formatText(preferences.smellSensitivity)}</span>
            </div>
            <div>
              <span className="font-medium text-ink">Vermicomposting interest: </span>
              <span>{preferences.interestedInWorms ? "Yes" : "No"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between gap-4 border-t border-border">
        <Button type="button" variant="secondary" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to Preferences</span>
        </Button>
        <Button type="button" size="lg" onClick={onSubmit}>
          <Sparkles className="mr-2 h-4 w-4" />
          <span>Generate Recommendation</span>
        </Button>
      </div>
    </div>
  );
}
