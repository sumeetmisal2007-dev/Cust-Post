"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sprout, AlertTriangle, ArrowLeft, Sparkles, Filter, Leaf, Carrot, Apple } from "lucide-react";
import { PlantGuide } from "@cust-post/backend";
import { PlantCard } from "@/components/plants/plant-card";

interface PlantsCatalogueViewProps {
  plants: PlantGuide[];
}

type CategoryFilter = "all" | "herb" | "vegetable" | "fruit";

export function PlantsCatalogueView({ plants }: PlantsCatalogueViewProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");

  const filteredPlants = activeCategory === "all"
    ? plants
    : plants.filter((p) => p.category === activeCategory);

  const counts = {
    all: plants.length,
    herb: plants.filter((p) => p.category === "herb").length,
    vegetable: plants.filter((p) => p.category === "vegetable").length,
    fruit: plants.filter((p) => p.category === "fruit").length,
  };

  return (
    <div className="py-8 sm:py-12 max-w-6xl mx-auto px-4 sm:px-6 space-y-10 text-left">

      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
      </div>

      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-muted">
          <span>SDG 12.5 • Urban Bio-Circular Registry</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-ink tracking-tight leading-tight">
          Curated Balcony Plants & Safe Compost Hub
        </h1>
        <p className="text-base text-muted leading-relaxed font-normal">
          Organic compost is an essential micro-nutrient amendment, not inert potting soil. Discover verified container varieties perfectly matched for urban apartments, balconies, and rooftops—with scientifically calibrated 20–30% compost blending ratios.
        </p>
      </div>

      <div className="relative overflow-hidden p-6 rounded-[22px] border border-amber-300/90 bg-gradient-to-br from-amber-50/90 via-amber-50/60 to-surface/90 shadow-sm backdrop-blur-xs amc-card-smooth amc-stagger-1">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-300/80 text-amber-800 shrink-0 mt-0.5 animate-amc-float">
            <AlertTriangle className="h-5 w-5 text-amber-700" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-sm font-bold text-amber-950 font-display">
              Universal Agronomic Guardrail: 20–30% Maximum Compost Ratio
            </h2>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              <strong>Never plant seeds, seedlings, or container varieties directly in 100% pure compost.</strong> Fresh or mature pure compost retains excessive moisture, creates air-void compression, and may burn delicate root hairs with concentrated bio-salts. Always incorporate 20–30% compost into 70–80% native soil, garden loam, or coco peat.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-action" />
            <h2 className="font-display text-lg font-bold text-ink">
              Filter by Plant Category
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide amc-pill-smooth cursor-pointer ${
                activeCategory === "all"
                  ? "bg-action text-white shadow-xs"
                  : "bg-surface text-muted hover:text-ink border border-border hover:bg-mint/30"
              }`}
            >
              All Plants ({counts.all})
            </button>
            <button
              onClick={() => setActiveCategory("herb")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide amc-pill-smooth cursor-pointer ${
                activeCategory === "herb"
                  ? "bg-emerald-800 text-white shadow-xs"
                  : "bg-surface text-emerald-900 border border-emerald-200/80 hover:bg-emerald-50"
              }`}
            >
              <Leaf className="h-3.5 w-3.5" />
              <span>Herbs ({counts.herb})</span>
            </button>
            <button
              onClick={() => setActiveCategory("vegetable")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide amc-pill-smooth cursor-pointer ${
                activeCategory === "vegetable"
                  ? "bg-amber-800 text-white shadow-xs"
                  : "bg-surface text-amber-900 border border-amber-200/80 hover:bg-amber-50"
              }`}
            >
              <Carrot className="h-3.5 w-3.5" />
              <span>Vegetables ({counts.vegetable})</span>
            </button>
            <button
              onClick={() => setActiveCategory("fruit")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide amc-pill-smooth cursor-pointer ${
                activeCategory === "fruit"
                  ? "bg-rose-800 text-white shadow-xs"
                  : "bg-surface text-rose-900 border border-rose-200/80 hover:bg-rose-50"
              }`}
            >
              <Apple className="h-3.5 w-3.5" />
              <span>Fruits ({counts.fruit})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 amc-stagger-2">
          {filteredPlants.map((plant) => (
            <PlantCard key={plant.slug} plant={plant} />
          ))}
        </div>
      </div>

      <div className="pt-8 overflow-hidden">
        <div className="rounded-[20px] bg-surface/70 border border-border/80 py-4 px-2 overflow-hidden shadow-xs">
          <div className="animate-marquee whitespace-nowrap text-xs font-mono font-semibold tracking-widest text-ink/75 uppercase flex items-center gap-8">
            <span className="flex items-center gap-2">✦ FRESH BALCONY HARVEST</span>
            <span className="flex items-center gap-2">✦ NOURISHED WITH 20–30% COMPOST</span>
            <span className="flex items-center gap-2">✦ ZERO SYNTHETIC PESTICIDES</span>
            <span className="flex items-center gap-2">✦ CONTAINER-OPTIMIZED GENETICS</span>
            <span className="flex items-center gap-2">✦ CIRCULAR NUTRIENT RECOVERY</span>
            <span className="flex items-center gap-2">✦ NEVER 100% PURE COMPOST</span>
            <span className="flex items-center gap-2">✦ FRESH BALCONY HARVEST</span>
            <span className="flex items-center gap-2">✦ NOURISHED WITH 20–30% COMPOST</span>
            <span className="flex items-center gap-2">✦ ZERO SYNTHETIC PESTICIDES</span>
            <span className="flex items-center gap-2">✦ CONTAINER-OPTIMIZED GENETICS</span>
            <span className="flex items-center gap-2">✦ CIRCULAR NUTRIENT RECOVERY</span>
            <span className="flex items-center gap-2">✦ NEVER 100% PURE COMPOST</span>
          </div>
        </div>
      </div>
    </div>
  );
}
