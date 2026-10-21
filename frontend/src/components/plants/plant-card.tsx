"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sun, Box, ArrowRight, Clock, Sparkles } from "lucide-react";
import { PlantGuide } from "@cust-post/backend";
import { BotanicalArt } from "@/components/plants/botanical-art";

interface PlantCardProps {
  plant: PlantGuide;
}

export function PlantCard({ plant }: PlantCardProps) {
  const [imageError, setImageError] = useState(false);

  const categoryStyles = {
    herb: "bg-emerald-950/85 text-emerald-200 border-emerald-400/50",
    vegetable: "bg-amber-950/85 text-amber-200 border-amber-400/50",
    fruit: "bg-rose-950/85 text-rose-200 border-rose-400/50",
  }[plant.category] || "bg-emerald-950/85 text-emerald-200 border-emerald-400/50";

  return (
    <div className="group relative rounded-[22px] border border-stone-800 bg-stone-900 overflow-hidden shadow-md hover:shadow-2xl amc-card-smooth min-h-[390px] sm:min-h-[420px] flex flex-col justify-between">

      <div className="absolute inset-0 z-0 overflow-hidden">
        {!imageError ? (
          <Image
            src={plant.imageUrl}
            alt={plant.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-950 via-stone-900 to-amber-950">
            <BotanicalArt slug={plant.slug} className="h-28 w-28 text-white/30" size={112} />
          </div>
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/75 to-stone-950/35 group-hover:via-stone-950/70 transition-colors duration-300"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-emerald-500/20 blur-2xl group-hover:bg-emerald-400/30 transition-all duration-500"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between gap-2">
        <span
          className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur-md font-semibold shadow-xs ${categoryStyles}`}
        >
          {plant.category}
        </span>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-stone-950/85 backdrop-blur-md border border-emerald-400/40 font-semibold text-emerald-300 shadow-xs">
          Max {plant.compostBlendRatioMaxPercent}% Compost
        </span>
      </div>

      <div className="relative z-10 p-5 sm:p-6 pt-0 space-y-3.5">

        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            <h3 className="font-display text-2xl font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors drop-shadow-xs">
              {plant.name}
            </h3>
            <p className="text-xs font-serif italic text-emerald-200/90 drop-shadow-2xs">
              {plant.botanicalName}
            </p>
            <p className="text-xs text-stone-200/90 leading-relaxed line-clamp-2 pt-0.5 font-normal">
              {plant.tagline}
            </p>
          </div>
          <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0 text-emerald-300 group-hover:bg-white/20 transition-all shadow-sm">
            <BotanicalArt slug={plant.slug} className="h-6 w-6 text-emerald-300 group-hover:scale-110 transition-transform" size={24} />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 text-[11px] text-stone-100 font-medium pt-1">
          <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15">
            <Box className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="whitespace-nowrap">{plant.containerMinLitres} L min</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-300/20 text-amber-100">
            <Sun className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="whitespace-nowrap">{plant.sunlightHoursMin} hrs sun</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-300/20 text-emerald-100">
            <Clock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="whitespace-nowrap">{plant.harvestDays}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/15 flex items-center justify-between">
          <Link
            href={`/plants/${plant.slug}`}
            className="inline-flex items-center text-xs font-semibold text-emerald-300 group-hover:text-emerald-200 gap-1.5 transition-colors focus:outline-none"
            aria-label={`View plant guide for ${plant.name}`}
          >
            <span>View Plant Guide</span>
            <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1.5 transition-transform" />
          </Link>
          <span className="text-[10px] font-mono text-stone-300/80 tracking-wide flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5 text-amber-400" />
            <span>Container-Friendly</span>
          </span>
        </div>
      </div>
    </div>
  );
}
