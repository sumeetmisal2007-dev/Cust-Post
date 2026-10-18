"use client";

import React from "react";
import Link from "next/link";
import { Sprout, Sun, Box, ArrowRight } from "lucide-react";
import { PlantGuide } from "@/lib/data/plant-guides";

interface PlantCardProps {
  plant: PlantGuide;
}

export function PlantCard({ plant }: PlantCardProps) {
  return (
    <div className="p-6 rounded-card border border-border bg-surface shadow-xs hover:shadow-soft transition-all text-left flex flex-col justify-between space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Max {plant.compostBlendRatioMaxPercent}% Compost
          </span>
          <span className="text-xs text-muted font-serif italic">
            {plant.botanicalName}
          </span>
        </div>

        <div>
          <h3 className="font-display text-xl font-bold text-ink">
            {plant.name}
          </h3>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            {plant.tagline}
          </p>
        </div>

        {/* Quick Specs */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-text">
          <span className="inline-flex items-center gap-1">
            <Box className="h-3.5 w-3.5 text-action" />
            <span>{plant.containerMinLitres} L min</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Sun className="h-3.5 w-3.5 text-amber-500" />
            <span>{plant.sunlightHoursMin} hrs sun</span>
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-border">
        <Link
          href={`/plants/${plant.slug}`}
          className="inline-flex items-center text-xs font-semibold text-action hover:underline gap-1.5"
          aria-label={`View plant guide for ${plant.name}`}
        >
          <span>View Plant Guide</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
