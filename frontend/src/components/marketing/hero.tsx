import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, CheckCircle2, ShieldCheck, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-14 md:pt-16 md:pb-20">

      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-mint/50 via-earth-subtle/30 to-transparent blur-3xl -z-10"
        aria-hidden="true"
      />

      <div className="max-w-content mx-auto px-4 sm:px-6 text-center space-y-7">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mint border border-border text-ink text-xs font-semibold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand" aria-hidden="true" />
          <span>Space-aware composting for beginners</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-ink max-w-4xl mx-auto leading-[1.05]">
          Make room for better soil.
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          Tailored composting plans for your balcony or small space. Screen your container, balance
          your organic waste, and track real batches with explainable guidance and zero AI guesswork.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button asChild size="lg" className="w-full sm:w-auto shadow-md">
            <Link href="/setup">
              Start a setup
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto shadow-soft">
            <Link href="/plants">
              <BookOpen className="mr-2 h-4 w-4 text-action" aria-hidden="true" />
              Explore Plant Care
            </Link>
          </Button>
        </div>

        <div className="pt-6 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="flex items-center gap-2.5 p-3 rounded-control bg-surface/80 border border-border/80 shadow-soft">
            <Home className="h-4 w-4 text-earth shrink-0" aria-hidden="true" />
            <div className="text-xs text-text">
              <span className="font-semibold text-ink block">Balcony Sized</span>
              <span>Fits &lt; 0.5 m² floor space</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-control bg-surface/80 border border-border/80 shadow-soft">
            <CheckCircle2 className="h-4 w-4 text-brand shrink-0" aria-hidden="true" />
            <div className="text-xs text-text">
              <span className="font-semibold text-ink block">Odor Guard</span>
              <span>Aerobic browns layering</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-control bg-surface/80 border border-border/80 shadow-soft">
            <ShieldCheck className="h-4 w-4 text-action shrink-0" aria-hidden="true" />
            <div className="text-xs text-text">
              <span className="font-semibold text-ink block">Cited Rules</span>
              <span>Agronomic verified ratios</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
