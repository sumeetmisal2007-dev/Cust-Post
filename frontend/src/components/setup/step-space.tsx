"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home, Sun, TreePine, Warehouse, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  spaceProfileSchema,
  SpaceProfileFormValues,
} from "@cust-post/backend";
import { useSetupWizardStore } from "@/lib/stores/setup-wizard.store";
import { LocationType } from "@cust-post/backend";
import { cn } from "@/lib/utils";

interface StepSpaceProps {
  onNext: () => void;
}

const LOCATION_OPTIONS: Array<{
  type: LocationType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    type: "balcony",
    label: "Balcony",
    description: "Covered or open outdoor apartment balcony with ambient airflow.",
    icon: Sun,
  },
  {
    type: "indoor",
    label: "Indoor",
    description: "Kitchen, utility room, or enclosed indoor area.",
    icon: Home,
  },
  {
    type: "terrace",
    label: "Terrace / Rooftop",
    description: "Open rooftop or large exposed terrace area.",
    icon: Warehouse,
  },
  {
    type: "garden",
    label: "Garden / Ground",
    description: "Direct ground soil, backyard, or shaded garden bed.",
    icon: TreePine,
  },
];

export function StepSpace({ onNext }: StepSpaceProps) {
  const { spaceProfile, setSpaceProfile } = useSetupWizardStore();
  const [selectedLocation, setSelectedLocation] = useState<LocationType>(
    spaceProfile?.locationType || "balcony"
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SpaceProfileFormValues>({
    resolver: zodResolver(spaceProfileSchema),
    defaultValues: {
      locationType: spaceProfile?.locationType || "balcony",
      lengthCm: spaceProfile?.lengthCm || (undefined as unknown as number),
      widthCm: spaceProfile?.widthCm || (undefined as unknown as number),
      maxHeightCm: spaceProfile?.maxHeightCm || (undefined as unknown as number),
    },
  });

  const onSubmit = (data: SpaceProfileFormValues) => {
    setSpaceProfile(data);
    onNext();
  };

  const handleSelectLocation = (type: LocationType) => {
    setSelectedLocation(type);
    setValue("locationType", type, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto text-left">
      <div className="space-y-2">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          Where will you compost?
        </h2>
        <p className="text-sm text-muted">
          Your location and available floor space determine which methods are practical and safe.
        </p>
      </div>

      {/* Location Selector Choice Tiles */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-ink">
          Select Location Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LOCATION_OPTIONS.map((loc) => {
            const isSelected = selectedLocation === loc.type;
            const Icon = loc.icon;
            return (
              <button
                type="button"
                key={loc.type}
                onClick={() => handleSelectLocation(loc.type)}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-card border text-left transition-all min-h-[48px]",
                  isSelected
                    ? "border-action bg-surface ring-2 ring-action/20 shadow-sm"
                    : "border-border bg-surface hover:bg-canvas"
                )}
                aria-pressed={isSelected}
              >
                <div
                  className={cn(
                    "p-2 rounded-control shrink-0 mt-0.5",
                    isSelected ? "bg-action text-white" : "bg-mint text-ink"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-ink text-sm sm:text-base">
                    {loc.label}
                  </div>
                  <div className="text-xs text-muted leading-relaxed mt-0.5">
                    {loc.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Space Dimensions */}
      <div className="space-y-4 pt-2 border-t border-border">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">
            Available Floor & Height Envelope
          </h3>
          <p className="text-xs text-muted">
            Enter the maximum space you can dedicate to your composting bin. Keep this distinct from any specific container size.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Available Length"
            unit="cm"
            type="number"
            placeholder="e.g. 100"
            error={errors.lengthCm?.message}
            {...register("lengthCm", { valueAsNumber: true })}
          />
          <Input
            label="Available Width"
            unit="cm"
            type="number"
            placeholder="e.g. 80"
            error={errors.widthCm?.message}
            {...register("widthCm", { valueAsNumber: true })}
          />
          <Input
            label="Maximum Height"
            unit="cm"
            type="number"
            placeholder="e.g. 120"
            error={errors.maxHeightCm?.message}
            {...register("maxHeightCm", { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Navigation CTA */}
      <div className="pt-4 flex justify-end">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          <span>Continue to Container</span>
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
