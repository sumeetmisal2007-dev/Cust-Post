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
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Clock,
  Layers,
  Leaf,
  Info,
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

export async function generateMetadata({ params }: PlantDetailPageProps) {
  const { slug } = await params;
  const plant = PLANT_GUIDES.find((p) => p.slug === slug);
  if (!plant) return { title: "Plant Not Found | Cust-Post" };
  return {
    title: `${plant.name} Balcony Guide & Safe Compost Blending | Cust-Post`,
    description: `${plant.tagline} Safe compost blending ratio: Max ${plant.compostBlendRatioMaxPercent}%.`,
  };
}

export default async function PlantDetailPage({ params }: PlantDetailPageProps) {
  const { slug } = await params;
  const plant = PLANT_GUIDES.find((p) => p.slug === slug);

  if (!plant) {
    notFound();
  }

  // Find adjacent plants for bottom next/prev links
  const currentIndex = PLANT_GUIDES.findIndex((p) => p.slug === slug);
  const nextPlant = PLANT_GUIDES[(currentIndex + 1) % PLANT_GUIDES.length];
  const prevPlant = PLANT_GUIDES[(currentIndex - 1 + PLANT_GUIDES.length) % PLANT_GUIDES.length];

  const categoryStyles = {
    herb: "bg-emerald-100/90 text-emerald-950 border-emerald-300",
    vegetable: "bg-amber-100/90 text-amber-950 border-amber-300",
    fruit: "bg-rose-100/90 text-rose-950 border-rose-300",
  }[plant.category] || "bg-emerald-100/90 text-emerald-950 border-emerald-300";

  return (
    <div className="py-8 sm:py-14 max-w-5xl mx-auto px-4 sm:px-6 space-y-12 text-left">
      {/* Top Breadcrumb & Status Ribbon */}
      <div className="flex items-center justify-between border-b border-border/70 pb-4">
        <Link
          href="/plants"
          className="group inline-flex items-center text-xs font-semibold text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>All Curated Plants</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-mono uppercase tracking-widest px-3 py-0.5 rounded-full border font-bold ${categoryStyles}`}>
            {plant.category}
          </span>
          <span className="hidden sm:inline-flex text-[11px] font-mono text-muted uppercase">
            Agronomic Profile
          </span>
        </div>
      </div>

      {/* Hero Display Section - AMC Natural Editorial Hierarchy */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold inline-flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-emerald-600" />
              Max {plant.compostBlendRatioMaxPercent}% Compost Ratio
            </span>
            <span className="text-sm font-serif italic text-muted">
              {plant.botanicalName}
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-ink tracking-tight leading-tight">
            {plant.name}
          </h1>
          <p className="text-lg sm:text-xl text-ink/80 font-medium max-w-3xl leading-relaxed">
            {plant.tagline}
          </p>
        </div>

        <p className="text-sm sm:text-base text-text leading-relaxed max-w-3xl">
          {plant.description}
        </p>
      </div>

      {/* Floating AMC Natural Radial Gradient Stat Orb Card */}
      <div className="relative overflow-hidden rounded-[32px] border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 via-surface/90 to-amber-50/60 p-6 sm:p-10 shadow-lg backdrop-blur-sm">
        {/* Ambient Glowing Orbs */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />

        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          <div className="space-y-1 sm:px-2 pt-2 sm:pt-0">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-medium flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-action" />
              <span>Compost Blend</span>
            </span>
            <div className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
              {plant.compostBlendRatioMaxPercent}%
            </div>
            <p className="text-[11px] text-muted">Maximum volume share in potting blend</p>
          </div>

          <div className="space-y-1 sm:px-4 pt-4 sm:pt-0">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-medium flex items-center gap-1">
              <Box className="h-3.5 w-3.5 text-action" />
              <span>Container Volume</span>
            </span>
            <div className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
              {plant.containerMinLitres} L
            </div>
            <p className="text-[11px] text-muted">Minimum pot capacity for roots</p>
          </div>

          <div className="space-y-1 sm:px-4 pt-4 sm:pt-0">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-medium flex items-center gap-1">
              <Sun className="h-3.5 w-3.5 text-amber-600" />
              <span>Daily Sunlight</span>
            </span>
            <div className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
              {plant.sunlightHoursMin}+ hrs
            </div>
            <p className="text-[11px] text-muted">Direct or bright balcony rays</p>
          </div>

          <div className="space-y-1 sm:px-4 pt-4 sm:pt-0">
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted font-medium flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-emerald-700" />
              <span>Harvest Time</span>
            </span>
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-ink truncate">
              {plant.harvestDays}
            </div>
            <p className="text-[11px] text-muted">From seed / cutting to harvest</p>
          </div>
        </div>
      </div>

      {/* Solid Dark Accreditation Badge Card (AMC Natural Style) */}
      <div className="relative rounded-[28px] bg-ink text-surface p-7 sm:p-9 shadow-md overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 w-80 h-80 bg-radial from-brand/20 to-transparent blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/10 text-emerald-200 text-[11px] font-mono uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              <span>Balcony-Certified Cultivar</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Scientifically Calibrated for Container Success
            </h2>
            <p className="text-xs sm:text-sm text-surface/80 leading-relaxed">
              Every cultivar in this registry has been verified for confined container root morphology, microclimate temperature resilience, and high uptake of natural compost humus without synthetic chemical boosters.
            </p>
          </div>

          <div className="flex sm:flex-col gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="block text-xs font-mono uppercase text-emerald-300">Target SDG</span>
              <span className="text-base font-bold text-white">SDG 12.5</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="block text-xs font-mono uppercase text-amber-300">Chemistry</span>
              <span className="text-base font-bold text-white">100% Organic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Editorial Care & Formulation Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Environmental & Growth Protocols */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-ink flex items-center gap-2 pb-2 border-b border-border">
            <Leaf className="h-5 w-5 text-action" />
            <span>Environmental Protocol</span>
          </h2>

          {/* Sowing Guidance */}
          <div className="p-5 rounded-[20px] border border-border/80 bg-surface/80 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-ink uppercase tracking-wider">
              <Sprout className="h-4 w-4 text-action" />
              <span>Sowing & Propagation Instructions</span>
            </div>
            <p className="text-xs sm:text-sm text-text leading-relaxed">
              {plant.sowingGuidance}
            </p>
          </div>

          {/* Watering Strategy */}
          <div className="p-5 rounded-[20px] border border-border/80 bg-surface/80 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-ink uppercase tracking-wider">
              <Droplets className="h-4 w-4 text-action" />
              <span>Watering & Moisture Strategy</span>
            </div>
            <p className="text-xs sm:text-sm text-text leading-relaxed">
              {plant.wateringGuidance}
            </p>
          </div>

          {/* Climate & Seasonality */}
          <div className="p-5 rounded-[20px] border border-border/80 bg-surface/80 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-ink uppercase tracking-wider">
              <Calendar className="h-4 w-4 text-action" />
              <span>Climate & Seasonality</span>
            </div>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              {plant.seasonNotes}
            </p>
          </div>

          {/* Harvesting Advice */}
          <div className="p-5 rounded-[20px] border border-border/80 bg-surface/80 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-ink uppercase tracking-wider">
              <Scissors className="h-4 w-4 text-action" />
              <span>Harvesting Advice</span>
            </div>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              {plant.harvestNotes}
            </p>
          </div>
        </div>

        {/* Right Column: Compost Blending & Agronomic Formulation */}
        <div className="space-y-6">
          <h2 className="font-display text-2xl font-bold text-ink flex items-center gap-2 pb-2 border-b border-border">
            <Sparkles className="h-5 w-5 text-action" />
            <span>Compost Formulation</span>
          </h2>

          {/* Safe Soil Recipe Card */}
          <div className="p-6 rounded-[24px] border border-emerald-300 bg-gradient-to-br from-emerald-50/90 to-surface/90 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-base">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              <span>Optimal Balcony Soil Recipe</span>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-emerald-200 text-xs font-mono space-y-2">
              <div className="flex justify-between items-center text-ink font-bold">
                <span>Mature Finished Compost:</span>
                <span className="text-action">{plant.compostBlendRatioMaxPercent}%</span>
              </div>
              <div className="flex justify-between items-center text-ink font-bold">
                <span>Potting Earth / Coco Peat:</span>
                <span className="text-muted">{100 - plant.compostBlendRatioMaxPercent}%</span>
              </div>
              <div className="w-full bg-border/50 h-2 rounded-full overflow-hidden flex">
                <div style={{ width: `${plant.compostBlendRatioMaxPercent}%` }} className="bg-action" />
                <div style={{ width: `${100 - plant.compostBlendRatioMaxPercent}%` }} className="bg-amber-200" />
              </div>
            </div>

            <div className="space-y-2 text-xs text-emerald-950">
              <span className="font-semibold block uppercase tracking-wider text-[11px] text-emerald-900">
                Safety & Blending Rules:
              </span>
              <ul className="space-y-2 pl-1">
                {plant.compostSafetyWarnings.map((warning, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-emerald-900 leading-relaxed">
                    <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Universal Agronomic Caution Banner */}
          <div className="p-5 rounded-[20px] border border-amber-300 bg-amber-50/80 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wide">
              <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
              <span>Universal Warning: No 100% Compost</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Compost is an organic soil conditioner with concentrated nutrients and biological activity. Planting directly in 100% pure compost will starve seedling roots of oxygen through pore collapse and induce salt stress. Always dilute with garden soil or perlite.
            </p>
          </div>

          {/* Root Zone & Container Requirements */}
          <div className="p-5 rounded-[20px] border border-border/80 bg-surface/80 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-ink uppercase tracking-wider">
              <Box className="h-4 w-4 text-action" />
              <span>Container & Drainage Setup</span>
            </div>
            <p className="text-xs text-text leading-relaxed">
              Ensure the container has active bottom drainage holes. Cover drainage holes with a layer of clay pebbles, coarse gravel, or mesh before adding the compost-soil blend to prevent drainage clogging and root rot.
            </p>
          </div>
        </div>
      </div>

      {/* Adjacent Plants Navigation */}
      <div className="pt-6 border-t border-border/80 flex items-center justify-between gap-4">
        <Link
          href={`/plants/${prevPlant.slug}`}
          className="group inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Previous:</span>
          <span className="text-ink font-bold">{prevPlant.name}</span>
        </Link>
        <Link
          href={`/plants/${nextPlant.slug}`}
          className="group inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-ink transition-colors"
        >
          <span className="hidden sm:inline">Next:</span>
          <span className="text-ink font-bold">{nextPlant.name}</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* AMC Natural Animated Marquee Ribbon */}
      <div className="overflow-hidden rounded-[20px] bg-surface/70 border border-border/80 py-4 px-2 shadow-xs">
        <div className="animate-marquee whitespace-nowrap text-xs font-mono font-semibold tracking-widest text-ink/75 uppercase flex items-center gap-8">
          <span className="flex items-center gap-2">✦ {plant.name.toUpperCase()}</span>
          <span className="flex items-center gap-2">✦ MAX {plant.compostBlendRatioMaxPercent}% COMPOST BLEND</span>
          <span className="flex items-center gap-2">✦ {plant.harvestDays.toUpperCase()} HARVEST</span>
          <span className="flex items-center gap-2">✦ NEVER USE 100% PURE COMPOST</span>
          <span className="flex items-center gap-2">✦ 100% BALCONY COMPATIBLE</span>
          <span className="flex items-center gap-2">✦ {plant.name.toUpperCase()}</span>
          <span className="flex items-center gap-2">✦ MAX {plant.compostBlendRatioMaxPercent}% COMPOST BLEND</span>
          <span className="flex items-center gap-2">✦ {plant.harvestDays.toUpperCase()} HARVEST</span>
          <span className="flex items-center gap-2">✦ NEVER USE 100% PURE COMPOST</span>
          <span className="flex items-center gap-2">✦ 100% BALCONY COMPATIBLE</span>
        </div>
      </div>
    </div>
  );
}
