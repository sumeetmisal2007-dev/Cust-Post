"use client";

import React from "react";
import Link from "next/link";
import { Sun, Box, ArrowRight, Clock, Sparkles } from "lucide-react";
import { PlantGuide } from "@/lib/data/plant-guides";
import { BotanicalArt } from "@/components/plants/botanical-art";

interface PlantCardProps {
  plant: PlantGuide;
}

export function PlantCard({ plant }: PlantCardProps) {
  const categoryStyles = {
    herb: "bg-emerald-100/80 text-emerald-900 border-emerald-300/80",
    vegetable: "bg-amber-100/80 text-amber-900 border-amber-300/80",
    fruit: "bg-rose-100/80 text-rose-900 border-rose-300/80",
  }[plant.category] || "bg-emerald-100/80 text-emerald-900 border-emerald-300/80";

  return (
    <div className="group relative rounded-[22px] border border-border/80 bg-surface/90 backdrop-blur-sm p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Soft ambient corner bloom */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl group-hover:bg-emerald-400/20 transition-all duration-500" />

      <div className="relative space-y-4">
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border font-semibold ${categoryStyles}`}
            >
              {plant.category}
            </span>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
              Max {plant.compostBlendRatioMaxPercent}% Compost
            </span>
          </div>
          <span className="text-xs text-muted font-serif italic truncate max-w-[130px]">
            {plant.botanicalName}
          </span>
        </div>

        {/* Title, Tagline & Botanical Artwork Emblem */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            <h3 className="font-display text-2xl font-bold text-ink tracking-tight group-hover:text-action transition-colors">
              {plant.name}
            </h3>
            <p className="text-xs text-muted leading-relaxed line-clamp-2">
              {plant.tagline}
            </p>
          </div>
          <div className="p-2 rounded-2xl bg-mint/50 border border-border/60 shrink-0 group-hover:bg-mint/80 transition-colors shadow-2xs">
            <BotanicalArt slug={plant.slug} className="h-7 w-7 text-action group-hover:scale-105 transition-transform" size={28} />
          </div>
        </div>

        {/* Quick Specs Pill Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-text font-medium">
          <div className="flex items-center gap-1.5 bg-mint/50 px-2.5 py-1.5 rounded-lg border border-border/60">
            <Box className="h-3.5 w-3.5 text-action shrink-0" />
            <span className="truncate">{plant.containerMinLitres} L min</span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50/70 px-2.5 py-1.5 rounded-lg border border-amber-200/60">
            <Sun className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{plant.sunlightHoursMin} hrs sun</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50/70 px-2.5 py-1.5 rounded-lg border border-emerald-200/60">
            <Clock className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
            <span className="truncate">{plant.harvestDays}</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA Link */}
      <div className="relative pt-5 mt-4 border-t border-border/70 flex items-center justify-between">
        <Link
          href={`/plants/${plant.slug}`}
          className="inline-flex items-center text-xs font-semibold text-action group-hover:text-brand gap-1.5 transition-colors focus:outline-none"
          aria-label={`View plant guide for ${plant.name}`}
        >
          <span>View Plant Guide</span>
          <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
        </Link>
        <span className="text-[10px] font-mono text-muted tracking-wide flex items-center gap-1">
          <Sparkles className="h-2.5 w-2.5 text-accent" />
          <span>Container-Friendly</span>
        </span>
      </div>
    </div>
  );
}
