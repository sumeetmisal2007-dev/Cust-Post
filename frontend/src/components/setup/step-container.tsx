"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VolumeDisplay } from "@/components/setup/volume-display";
import {
  containerCheckSchema,
  ContainerCheckFormValues,
} from "@cust-post/backend";
import {
  calculateGeometricVolume,
  validateSpaceFit,
} from "@cust-post/backend";
import { useSetupWizardStore } from "@/lib/stores/setup-wizard.store";
import { ContainerShape, ContainerMaterial, PreviousUse, ContainerCheckInputs } from "@cust-post/backend";

interface StepContainerProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepContainer({ onNext, onBack }: StepContainerProps) {
  const { spaceProfile, containerInputs, setContainerInputs } = useSetupWizardStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContainerCheckFormValues>({
    resolver: zodResolver(containerCheckSchema),
    defaultValues: {
      shape: (containerInputs?.shape as ContainerShape) || "rectangular",
      internalLengthCm: containerInputs?.internalLengthCm || (undefined as unknown as number),
      internalWidthCm: containerInputs?.internalWidthCm || (undefined as unknown as number),
      internalHeightCm: containerInputs?.internalHeightCm || (undefined as unknown as number),
      diameterCm: containerInputs?.diameterCm || (undefined as unknown as number),
      externalLengthCm: containerInputs?.externalLengthCm,
      externalWidthCm: containerInputs?.externalWidthCm,
      externalHeightCm: containerInputs?.externalHeightCm,
      externalDiameterCm: containerInputs?.externalDiameterCm,
      material: (containerInputs?.material as ContainerMaterial) || "plastic_bucket",
      previousUse: (containerInputs?.previousUse as PreviousUse) || "food",
      condition: containerInputs?.condition || "good",
      hasLid: containerInputs?.hasLid ?? true,
      hasVentilationHoles: containerInputs?.hasVentilationHoles ?? false,
      hasDrainageHoles: containerInputs?.hasDrainageHoles ?? false,
      isFoodGrade: containerInputs?.isFoodGrade || "food_grade",
    },
  });

  const watchedShape = watch("shape");
  const watchedLength = watch("internalLengthCm");
  const watchedWidth = watch("internalWidthCm");
  const watchedHeight = watch("internalHeightCm");
  const watchedDiameter = watch("diameterCm");
  const watchedExtLength = watch("externalLengthCm");
  const watchedExtWidth = watch("externalWidthCm");
  const watchedExtHeight = watch("externalHeightCm");
  const watchedExtDiameter = watch("externalDiameterCm");

  const cleanNum = (val: unknown): number | undefined =>
    typeof val === "number" && !isNaN(val) && val > 0 ? val : undefined;

  // Calculate live geometric volume strictly based on internal capacity
  const volumeResult = useMemo(() => {
    try {
      const cleanH = cleanNum(watchedHeight);
      if (!cleanH) return null;
      if (
        (watchedShape === "rectangular" || watchedShape === "irregular") &&
        (!cleanNum(watchedLength) || !cleanNum(watchedWidth))
      ) {
        return null;
      }
      if (watchedShape === "cylindrical" && !cleanNum(watchedDiameter)) return null;

      return calculateGeometricVolume({
        shape: watchedShape,
        internalLengthCm: cleanNum(watchedLength),
        internalWidthCm: cleanNum(watchedWidth),
        internalHeightCm: cleanH,
        diameterCm: cleanNum(watchedDiameter),
      });
    } catch {
      return null;
    }
  }, [watchedShape, watchedLength, watchedWidth, watchedHeight, watchedDiameter]);

  // Calculate space fit using external dimensions (fallback to internal if external is blank)
  const spaceFitResult = useMemo(() => {
    const cleanH = cleanNum(watchedHeight);
    if (!spaceProfile || !cleanH) return null;
    try {
      return validateSpaceFit(spaceProfile, {
        shape: watchedShape,
        internalLengthCm: cleanNum(watchedLength),
        internalWidthCm: cleanNum(watchedWidth),
        internalHeightCm: cleanH,
        diameterCm: cleanNum(watchedDiameter),
        externalLengthCm: cleanNum(watchedExtLength),
        externalWidthCm: cleanNum(watchedExtWidth),
        externalHeightCm: cleanNum(watchedExtHeight),
        externalDiameterCm: cleanNum(watchedExtDiameter),
      });
    } catch {
      return null;
    }
  }, [
    spaceProfile,
    watchedShape,
    watchedLength,
    watchedWidth,
    watchedHeight,
    watchedDiameter,
    watchedExtLength,
    watchedExtWidth,
    watchedExtHeight,
    watchedExtDiameter,
  ]);

  const onSubmit = (data: ContainerCheckFormValues) => {
    const cleanedData: ContainerCheckInputs = {
      ...data,
      externalLengthCm: cleanNum(data.externalLengthCm),
      externalWidthCm: cleanNum(data.externalWidthCm),
      externalHeightCm: cleanNum(data.externalHeightCm),
      externalDiameterCm: cleanNum(data.externalDiameterCm),
    };
    setContainerInputs(cleanedData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto text-left">
      <div className="space-y-2">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">
          Check your container
        </h2>
        <p className="text-sm text-muted">
          Measure internal dimensions and screen the vessel material and prior use history.
        </p>
      </div>

      {/* Shape and Dimensions */}
      <div className="space-y-4">
        <div>
          <label htmlFor="container-shape" className="block text-sm font-semibold text-ink">
            Container Geometry Shape
          </label>
          <select
            id="container-shape"
            {...register("shape")}
            className="mt-1 flex min-h-[48px] w-full rounded-control border border-border bg-surface px-4 py-2 text-base text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action"
          >
            <option value="rectangular">Rectangular Box / Plastic Crate</option>
            <option value="cylindrical">Cylindrical Bucket / Drum / Pot</option>
            <option value="irregular">Irregular Shaped Vessel</option>
          </select>
        </div>

        {watchedShape === "cylindrical" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Diameter"
              unit="cm"
              type="number"
              placeholder="e.g. 40"
              error={errors.diameterCm?.message}
              {...register("diameterCm", { valueAsNumber: true })}
            />
            <Input
              label="Internal Height"
              unit="cm"
              type="number"
              placeholder="e.g. 50"
              error={errors.internalHeightCm?.message}
              {...register("internalHeightCm", { valueAsNumber: true })}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Internal Length"
              unit="cm"
              type="number"
              placeholder="e.g. 50"
              error={errors.internalLengthCm?.message}
              {...register("internalLengthCm", { valueAsNumber: true })}
            />
            <Input
              label="Internal Width"
              unit="cm"
              type="number"
              placeholder="e.g. 40"
              error={errors.internalWidthCm?.message}
              {...register("internalWidthCm", { valueAsNumber: true })}
            />
            <Input
              label="Internal Height"
              unit="cm"
              type="number"
              placeholder="e.g. 35"
              error={errors.internalHeightCm?.message}
              {...register("internalHeightCm", { valueAsNumber: true })}
            />
          </div>
        )}

        {/* External Outer Dimensions for Space Fit Check */}
        <div className="pt-2 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-left">
            <span className="text-xs font-semibold text-ink uppercase tracking-wider">
              Outer External Dimensions (Optional for Space Fit)
            </span>
            <span className="text-[11px] text-muted">
              Includes rim, handles & lid; prevents tight space overhang
            </span>
          </div>

          {watchedShape === "cylindrical" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="External Diameter"
                unit="cm"
                type="number"
                placeholder={watchedDiameter ? `e.g. ${watchedDiameter + 4}` : "e.g. 44"}
                error={errors.externalDiameterCm?.message}
                {...register("externalDiameterCm", {
                  setValueAs: (v) =>
                    v === "" || v === null || Number.isNaN(Number(v)) ? undefined : Number(v),
                })}
              />
              <Input
                label="External Height (With Lid)"
                unit="cm"
                type="number"
                placeholder={watchedHeight ? `e.g. ${watchedHeight + 5}` : "e.g. 55"}
                error={errors.externalHeightCm?.message}
                {...register("externalHeightCm", {
                  setValueAs: (v) =>
                    v === "" || v === null || Number.isNaN(Number(v)) ? undefined : Number(v),
                })}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="External Length"
                unit="cm"
                type="number"
                placeholder={watchedLength ? `e.g. ${watchedLength + 4}` : "e.g. 54"}
                error={errors.externalLengthCm?.message}
                {...register("externalLengthCm", {
                  setValueAs: (v) =>
                    v === "" || v === null || Number.isNaN(Number(v)) ? undefined : Number(v),
                })}
              />
              <Input
                label="External Width"
                unit="cm"
                type="number"
                placeholder={watchedWidth ? `e.g. ${watchedWidth + 4}` : "e.g. 44"}
                error={errors.externalWidthCm?.message}
                {...register("externalWidthCm", {
                  setValueAs: (v) =>
                    v === "" || v === null || Number.isNaN(Number(v)) ? undefined : Number(v),
                })}
              />
              <Input
                label="External Height (With Lid)"
                unit="cm"
                type="number"
                placeholder={watchedHeight ? `e.g. ${watchedHeight + 5}` : "e.g. 40"}
                error={errors.externalHeightCm?.message}
                {...register("externalHeightCm", {
                  setValueAs: (v) =>
                    v === "" || v === null || Number.isNaN(Number(v)) ? undefined : Number(v),
                })}
              />
            </div>
          )}
        </div>

        {/* Live Volume and Space Fit Display */}
        <VolumeDisplay volumeResult={volumeResult} spaceFitResult={spaceFitResult} />
      </div>

      {/* Material & History */}
      <div className="space-y-5 pt-6 border-t border-border">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">
            Vessel Material & Safety History
          </h3>
          <p className="text-xs text-muted">
            Ensure the container is non-toxic, safe for soil biology, and suited to small-space moisture retention.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-left">
            <label htmlFor="container-material" className="block text-sm font-semibold text-ink">
              Material Type
            </label>
            <select
              id="container-material"
              {...register("material")}
              className="flex min-h-[48px] w-full rounded-control border border-border bg-surface px-4 py-2.5 text-base text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action shadow-xs"
            >
              <option value="plastic_bucket">Plastic Bucket / Tub (Common &amp; Durable)</option>
              <option value="terracotta">Terracotta / Clay Pot (Natural Aeration)</option>
              <option value="wooden_crate">Wooden Crate / Box (High Aeration)</option>
              <option value="metal_drum">Metal Drum / Bin</option>
              <option value="mesh_wire">Wire Mesh Bin</option>
              <option value="other">Other Material</option>
            </select>
          </div>

          <div className="space-y-1.5 text-left">
            <label htmlFor="container-previous-use" className="block text-sm font-semibold text-ink">
              Previous Contents & Use
            </label>
            <select
              id="container-previous-use"
              {...register("previousUse")}
              className="flex min-h-[48px] w-full rounded-control border border-border bg-surface px-4 py-2.5 text-base text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action shadow-xs"
            >
              <option value="food">Food or Beverage Storage (Safe)</option>
              <option value="new_unused">Brand New / Unused</option>
              <option value="soil_garden">Soil or Garden Plants</option>
              <option value="unknown">Unknown Prior Use (Caution)</option>
              <option value="paint_chemicals">Paint, Motor Oil, or Chemicals (Hazardous)</option>
            </select>
            <p className="text-xs text-muted mt-1">
              Safety rule: Unknown containers are never assumed to be clean.
            </p>
          </div>

          <div className="space-y-1.5 text-left sm:col-span-2">
            <label htmlFor="container-food-grade" className="block text-sm font-semibold text-ink">
              Food-Grade Certification Status
            </label>
            <select
              id="container-food-grade"
              {...register("isFoodGrade")}
              className="flex min-h-[48px] w-full rounded-control border border-border bg-surface px-4 py-2.5 text-base text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action shadow-xs"
            >
              <option value="food_grade">Food-Grade Certified (e.g. #2 HDPE / #5 PP, Food-Safe Resin)</option>
              <option value="unknown">Unknown / Unverified Resin Grade (Caution)</option>
              <option value="non_food_grade">Non-Food-Grade (Industrial / Utility Plastic)</option>
            </select>
            <p className="text-xs text-muted mt-1">
              Safety rule: Non-food-grade containers risk leaching toxic chemical plasticizers.
            </p>
          </div>
        </div>

        {/* Physical Features Checkboxes */}
        <div className="space-y-3 pt-2">
          <label className="block text-sm font-semibold text-ink">
            Current Physical Features
          </label>
          <div className="space-y-2.5 text-sm text-text">
            <label className="flex items-center gap-3 p-3.5 rounded-control border border-border bg-surface cursor-pointer hover:bg-canvas transition-colors shadow-xs">
              <input
                type="checkbox"
                className="h-4 w-4 rounded text-action focus:ring-action border-border"
                {...register("hasLid")}
              />
              <div>
                <span className="font-medium text-ink block">Fitted Lid / Breathable Cover</span>
                <span className="text-xs text-muted">Keeps pests, flies, and rain out of your apartment setup</span>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3.5 rounded-control border border-border bg-surface cursor-pointer hover:bg-canvas transition-colors shadow-xs">
              <input
                type="checkbox"
                className="h-4 w-4 rounded text-action focus:ring-action border-border"
                {...register("hasVentilationHoles")}
              />
              <div>
                <span className="font-medium text-ink block">Side / Rim Ventilation Holes</span>
                <span className="text-xs text-muted">Essential for oxygen flow to prevent anaerobic odors</span>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3.5 rounded-control border border-border bg-surface cursor-pointer hover:bg-canvas transition-colors shadow-xs">
              <input
                type="checkbox"
                className="h-4 w-4 rounded text-action focus:ring-action border-border"
                {...register("hasDrainageHoles")}
              />
              <div>
                <span className="font-medium text-ink block">Base Drainage Holes</span>
                <span className="text-xs text-muted">Allows leachate drainage; place a tray underneath</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 flex items-center justify-between gap-4 border-t border-border">
        <Button type="button" variant="secondary" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to Space</span>
        </Button>
        <Button type="submit" size="lg">
          <span>Continue to Materials</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
