import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Sprout,
  Sun,
  Droplets,
  Box,
  AlertTriangle,
  Calendar,
  Scissors,
  CheckCircle2,
} from "lucide-react";
import { PLANT_GUIDES, PlantGuide } from "@/lib/data/plant-guides";

interface PlantDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PLANT_GUIDES.map((plant) => ({
    slug: plant.slug,
  }));
}

export default async function PlantDetailPage({ params }: PlantDetailPageProps) {
  const { slug } = await params;
  const plant = PLANT_GUIDES.find((p) => p.slug === slug);

  if (!plant) {
    notFound();
  }

  return (
    <div className="py-8 sm:py-12 max-w-3xl mx-auto px-4 space-y-8 text-left">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/plants"
          className="inline-flex items-center text-xs font-semibold text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          <span>All Plant Guides</span>
        </Link>
        <span className="text-xs font-mono text-muted uppercase">Verified Agronomic Guide</span>
      </div>

      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-border">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Max {plant.compostBlendRatioMaxPercent}% Compost Ratio
          </span>
          <span className="text-xs text-muted font-serif italic">
            {plant.botanicalName}
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">
          {plant.name}
        </h1>
        <p className="text-sm text-muted leading-relaxed font-medium">
          {plant.tagline}
        </p>
        <p className="text-xs text-text leading-relaxed pt-2">
          {plant.description}
        </p>
      </div>

      {/* Quick Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-card border border-border bg-surface space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink">
            <Box className="h-4 w-4 text-action" />
            <span>Recommended Pot Volume</span>
          </div>
          <div className="font-display text-lg font-bold text-ink">
            {plant.containerMinLitres} Litres minimum
          </div>
          <p className="text-[11px] text-muted">
            Allows root expansion without premature root-bounding.
          </p>
        </div>

        <div className="p-4 rounded-card border border-border bg-surface space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink">
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Daily Sunlight Requirement</span>
          </div>
          <div className="font-display text-lg font-bold text-ink">
            {plant.sunlightHoursMin}+ Hours direct sun
          </div>
          <p className="text-[11px] text-muted">
            Essential for robust photosynthesis and pest resistance.
          </p>
        </div>
      </div>

      {/* Watering & Sowing */}
      <div className="p-5 rounded-card border border-border bg-surface space-y-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-ink uppercase tracking-wider">
            <Droplets className="h-4 w-4 text-action" />
            <span>Watering & Moisture Strategy</span>
          </div>
          <p className="text-xs text-text leading-relaxed">
            {plant.wateringGuidance}
          </p>
        </div>

        <div className="pt-3 border-t border-border space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-ink uppercase tracking-wider">
            <Sprout className="h-4 w-4 text-brand" />
            <span>Sowing & Propagation Instructions</span>
          </div>
          <p className="text-xs text-text leading-relaxed">
            {plant.sowingGuidance}
          </p>
        </div>
      </div>

      {/* Using Compost With This Plant */}
      <div className="p-6 rounded-card border border-emerald-300 bg-emerald-50/60 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-950 font-bold text-base">
          <CheckCircle2 className="h-5 w-5 text-emerald-700" />
          <span>Using Compost with {plant.name}</span>
        </div>

        <div className="text-xs text-emerald-950 space-y-2">
          <p className="font-semibold">
            Optimal Soil Recipe: Blend {plant.compostBlendRatioMaxPercent}% fully cured compost with{" "}
            {100 - plant.compostBlendRatioMaxPercent}% regular potting earth or coco peat.
          </p>
          <ul className="space-y-1.5 pl-1 pt-1">
            {plant.compostSafetyWarnings.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2 text-emerald-900 leading-relaxed">
                <span className="text-emerald-700 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Season & Harvest Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-card border border-border bg-surface space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink">
            <Calendar className="h-4 w-4 text-action" />
            <span>Climate & Seasonality</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            {plant.seasonNotes}
          </p>
        </div>

        <div className="p-4 rounded-card border border-border bg-surface space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink">
            <Scissors className="h-4 w-4 text-action" />
            <span>Harvesting Advice</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            {plant.harvestNotes}
          </p>
        </div>
      </div>
    </div>
  );
}
