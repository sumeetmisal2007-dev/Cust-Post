import React from "react";
import Link from "next/link";
import { Sprout, AlertTriangle, ArrowLeft, ShieldCheck } from "lucide-react";
import { PLANT_GUIDES } from "@/lib/data/plant-guides";
import { PlantCard } from "@/components/plants/plant-card";

export const metadata = {
  title: "Plant Care Guide | Cust-Post",
  description: "Curated plant guide with verified safe compost blending ratios for urban balconies.",
};

export default function PlantsPage() {
  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 space-y-8 text-left">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          <span>Home</span>
        </Link>
        <span className="text-xs font-mono text-muted uppercase">Curated Starter Plants</span>
      </div>

      {/* Hero Header */}
      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink flex items-center gap-2.5">
          <Sprout className="h-7 w-7 text-action" />
          <span>Plant Care & Safe Compost Hub</span>
        </h1>
        <p className="text-sm text-muted max-w-2xl leading-relaxed">
          Compost is a nutrient amendment and soil conditioner—not potting soil. Learn how to safely blend your finished compost into balcony pots without scorching roots.
        </p>
      </div>

      {/* Safety Notice Callout */}
      <div className="p-5 rounded-card border border-amber-300 bg-amber-50/70 space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0" />
          <span>Universal Agronomic Guardrail: 20–30% Maximum Compost Ratio</span>
        </div>
        <p className="text-xs text-amber-950 leading-relaxed font-medium">
          <strong>Never plant seeds, seedlings, or houseplants directly in 100% pure compost.</strong> Pure compost holds excessive moisture, can suffocate young roots, and contains high salt concentrations. Always blend 20–30% mature compost into 70–80% native garden soil, red earth, or coco peat.
        </p>
      </div>

      {/* Starter Plants Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ink">
            Urban Balcony Starter Plants
          </h2>
          <span className="text-xs text-muted">3 Expert-Reviewed Profiles</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANT_GUIDES.map((plant) => (
            <PlantCard key={plant.slug} plant={plant} />
          ))}
        </div>
      </div>
    </div>
  );
}
