"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Box, ArrowRight, Clock, Sparkles } from "lucide-react";
import { PlantGuide } from "@/lib/data/plant-guides";
import { BotanicalArt } from "@/components/plants/botanical-art";

interface PlantCardProps {
  plant: PlantGuide;
}

export function PlantCard({ plant }: PlantCardProps) {
  const [imageError, setImageError] = useState(false);

  const categoryStyles = {
    herb: "bg-emerald-100/90 text-emerald-950 border-emerald-300/90",
    vegetable: "bg-amber-100/90 text-amber-950 border-amber-300/90",
    fruit: "bg-rose-100/90 text-rose-950 border-rose-300/90",
  }[plant.category] || "bg-emerald-100/90 text-emerald-950 border-emerald-300/90";

  return (
    <div className="group relative rounded-[22px] border border-border/80 bg-surface/90 backdrop-blur-sm p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Soft ambient corner bloom */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl group-hover:bg-emerald-400/20 transition-all duration-500" />

      <div className="relative space-y-3.5">
        {/* Plant Photography Banner with Glass Chips */}
        <div className="relative h-44 w-full overflow-hidden rounded-[16px] bg-mint/30 border border-border/60">
          {!imageError ? (
            <Image
              src={plant.imageUrl}
              alt={plant.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-mint/40 via-surface to-amber-50/40">
              <BotanicalArt slug={plant.slug} className="h-16 w-16 text-action/60" size={64} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent pointer-events-none" />

          {/* Floating Category Badge & Compost Limit Chip */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span
              className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border backdrop-blur-md font-semibold shadow-xs ${categoryStyles}`}
            >
              {plant.category}
            </span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-ink/80 backdrop-blur-md border border-white/20 font-semibold text-emerald-300 shadow-xs">
              Max {plant.compostBlendRatioMaxPercent}% Compost
            </span>
          </div>
        </div>

        {/* Title, Botanical Name, Tagline & Botanical Artwork Emblem */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="font-display text-xl font-bold text-ink tracking-tight group-hover:text-action transition-colors truncate">
              {plant.name}
            </h3>
            <p className="text-xs font-serif italic text-muted truncate">
              {plant.botanicalName}
            </p>
            <p className="text-xs text-text/80 leading-relaxed line-clamp-2 pt-0.5">
              {plant.tagline}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-mint/50 border border-border/60 shrink-0 group-hover:bg-mint/80 transition-colors shadow-2xs">
            <BotanicalArt slug={plant.slug} className="h-6 w-6 text-action group-hover:scale-105 transition-transform" size={24} />
          </div>
        </div>

        {/* Quick Specs Pill Grid */}
        <div className="grid grid-cols-3 gap-2 text-[11px] text-text font-medium">
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
      <div className="relative pt-4 mt-3 border-t border-border/70 flex items-center justify-between">
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
