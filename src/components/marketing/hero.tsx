import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Background soft botanical gradient bloom */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-mint/40 via-mint/10 to-transparent blur-3xl -z-10"
        aria-hidden="true"
      />

      <div className="max-w-content mx-auto px-4 sm:px-6 text-center space-y-6">
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

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/setup">
              Start a setup
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
            <Link href="/plants">
              <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />
              Explore Plant Care
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
