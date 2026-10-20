"use client";

import React, { useState } from "react";
import { Sparkles, AlertTriangle, Layers, Info } from "lucide-react";
import { PlantGuide } from "@cust-post/backend";

interface PotCalculatorProps {
  plant: PlantGuide;
}

export function PotCalculator({ plant }: PotCalculatorProps) {
  const [potLitres, setPotLitres] = useState<number>(plant.containerMinLitres);

  const compostRatio = plant.compostBlendRatioMaxPercent;
  const soilRatio = 100 - compostRatio;

  const compostVol = Number(((potLitres * compostRatio) / 100).toFixed(1));
  const soilVol = Number(((potLitres * soilRatio) / 100).toFixed(1));

  const presets = [5, 10, 15, 20, 25, 30];

  return (
    <div className="rounded-[28px] border border-emerald-200/90 bg-gradient-to-br from-emerald-50/70 via-surface/90 to-amber-50/50 p-6 sm:p-8 space-y-6 shadow-sm backdrop-blur-xs text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-action/10 text-action">
              <Layers className="h-4 w-4" />
            </span>
            <h3 className="font-display text-xl font-bold text-ink">
              Pot & Soil Blend Formulator
            </h3>
          </div>
          <p className="text-xs text-muted">
            Calibrate precise compost amendments tailored for {plant.name}&apos;s root profile.
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs font-mono text-muted uppercase">Selected Capacity</span>
          <div className="font-display text-2xl font-extrabold text-ink">
            {potLitres} Litres
          </div>
        </div>
      </div>

      {/* Interactive Controls & Presets */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium text-ink">
            <span>Adjust Container Volume (2L – 50L)</span>
            <span className="font-mono text-action font-bold">{potLitres} L</span>
          </div>

          <input
            type="range"
            min={2}
            max={50}
            step={1}
            value={potLitres}
            aria-label="Container volume"
            onChange={(e) => setPotLitres(Number(e.target.value))}
            className="w-full accent-action cursor-pointer h-2 bg-border/60 rounded-lg appearance-none"
          />
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono text-muted mr-1">Quick Presets:</span>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setPotLitres(preset)}
              className={`text-xs font-mono font-semibold px-3 py-1 rounded-full transition-all ${
                potLitres === preset
                  ? "bg-action text-white shadow-xs"
                  : "bg-surface text-ink border border-border hover:bg-mint/40"
              }`}
            >
              {preset}L
            </button>
          ))}
        </div>
      </div>

      {/* Visual Cross-Section & Ingredient Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
        {/* Ingredient Breakdown Card */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white/80 border border-emerald-200/90 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink">Mature Cured Compost</span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                {compostRatio}% Ratio
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span data-testid="compost-volume" className="font-display text-3xl font-extrabold text-action">
                {compostVol} L
              </span>
              <span className="text-xs text-muted">Microbial Humus Amendment</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-amber-200/90 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink">Native Loam / Coco Peat</span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                {soilRatio}% Ratio
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span data-testid="soil-volume" className="font-display text-3xl font-extrabold text-ink">
                {soilVol} L
              </span>
              <span className="text-xs text-muted">Base Substrate & Aeration</span>
            </div>
          </div>
        </div>

        {/* Visual AMC Natural Container Graphic */}
        <div className="relative p-5 rounded-2xl bg-surface/90 border border-border/80 flex flex-col items-center justify-center space-y-3 text-center">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-semibold">
            Substrate Layering Guide
          </span>

          <div className="w-full max-w-[220px] h-40 border-2 border-ink/40 rounded-b-3xl rounded-t-md p-1.5 flex flex-col justify-end bg-canvas/60 overflow-hidden shadow-inner">
            {/* Top Dressing Layer (Compost) */}
            <div
              style={{ height: `${compostRatio}%` }}
              className="w-full bg-action/85 text-[10px] text-white font-mono flex items-center justify-center font-bold tracking-tight rounded-t-sm transition-all duration-300"
            >
              Compost ({compostVol}L)
            </div>

            {/* Base Potting Mix Layer */}
            <div
              style={{ height: `${soilRatio - 15}%` }}
              className="w-full bg-amber-200/80 text-[10px] text-amber-950 font-mono flex items-center justify-center font-bold tracking-tight transition-all duration-300"
            >
              Soil / Peat ({soilVol}L)
            </div>

            {/* Drainage Layer at bottom */}
            <div className="h-[15%] w-full bg-slate-300/80 text-[9px] text-slate-700 font-mono flex items-center justify-center tracking-tight border-t border-slate-400/40">
              Drainage Gravel (15%)
            </div>
          </div>

          <div className="text-[11px] text-muted leading-tight">
            Capped pot with {plant.containerMinLitres}L minimum biological depth.
          </div>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-100/60 border border-amber-300/80 text-amber-950 text-xs leading-relaxed">
        <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          <strong>Universal Agronomic Rule:</strong> Never plant directly in 100% pure compost. Pure compost holds water without structural capillary pores, starving seedling roots of oxygen. Always blend {compostRatio}% mature compost with native potting soil.
        </span>
      </div>
    </div>
  );
}
