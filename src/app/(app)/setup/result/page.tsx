"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Compass,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useSetupWizardStore,
  useSetupWizardHydrated,
} from "@/lib/stores/setup-wizard.store";
import { calculateGeometricVolume } from "@/lib/compost-rules/volume-calculator";
import { evaluateContainer } from "@/lib/compost-rules/container-evaluator";
import { recommendCompostingMethod } from "@/lib/compost-rules/method-recommender";
import { getSourceByRuleId } from "@/lib/data/sources-registry";
import { RecommendationCard } from "@/components/compost/recommendation-card";
import { SourceDrawer } from "@/components/compost/source-drawer";
import { StartBatchModal } from "@/components/compost/start-batch-modal";
import { RuleSource } from "@/types/domain";

export default function SetupResultPage() {
  const router = useRouter();
  const isHydrated = useSetupWizardHydrated();
  const {
    spaceProfile,
    containerInputs,
    wasteItems,
    preferences,
    loadSampleSetup,
    resetWizard,
  } = useSetupWizardStore();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

  // 1. Loading state while restoring client-side local browser storage
  if (!isHydrated) {
    return (
      <div className="py-20 max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-surface border border-border shadow-soft text-muted text-sm font-medium">
          <div className="h-4 w-4 rounded-full border-2 border-action border-t-transparent animate-spin" />
          <span>Restoring your composting setup...</span>
        </div>
      </div>
    );
  }

  // 2. Clear recovery path when no saved setup exists in storage
  if (!containerInputs || !spaceProfile) {
    return (
      <div className="py-12 sm:py-16 max-w-xl mx-auto px-4 text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-bold text-ink">No Saved Setup Found</h2>
          <p className="text-sm text-muted leading-relaxed">
            We couldn&apos;t find an active setup session in your browser. Cust-Post stores all space and
            container evaluations directly in your browser&apos;s local storage for 100% privacy—no
            personal space data is sent to external servers.
          </p>
          <p className="text-xs text-muted/80">
            If you refreshed in private/incognito mode or cleared your browser data, you can start a new evaluation or load a verified sample plan below.
          </p>
        </div>

        {/* Clear Recovery Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            size="lg"
            onClick={() => {
              resetWizard();
              router.push("/setup");
            }}
            className="w-full sm:w-auto"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Start Setup Wizard</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              loadSampleSetup();
            }}
            className="w-full sm:w-auto"
          >
            <Compass className="mr-2 h-4 w-4 text-action" />
            <span>Load Sample Balcony Plan</span>
          </Button>
        </div>

        {/* Informative Guidance & Privacy Guarantee */}
        <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-muted">
          <Link
            href="/plants"
            className="hover:text-ink transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Browse Composting & Soil Guides</span>
          </Link>
          <div className="hidden sm:block text-border">•</div>
          <div className="flex items-center gap-1.5 text-brand">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>100% Client-Side Local Storage</span>
          </div>
        </div>
      </div>
    );
  }

  // 1. Calculate geometric volume strictly based on internal dimensions
  const volResult = calculateGeometricVolume(containerInputs);
  const volumeLitres = volResult.volumeLitres;

  // 2. Evaluate container suitability
  const containerResult = evaluateContainer(containerInputs);

  // 3. Recommend method if not completely unsuitable
  const methodPlan =
    containerResult.verdict !== "unsuitable"
      ? recommendCompostingMethod({
          locationType: spaceProfile.locationType,
          containerVolumeLitres: volumeLitres,
          containerVerdict: containerResult.verdict,
          materials: wasteItems,
          maintenanceCapacity: preferences.maintenanceCapacity,
          smellSensitivity: preferences.smellSensitivity,
          interestedInWorms: preferences.interestedInWorms,
        })
      : null;

  // 4. Gather verified literature sources for the drawer
  const sources: RuleSource[] = [containerResult.sourceReference];
  if (methodPlan?.sourceId) {
    const methodSrc = getSourceByRuleId(methodPlan.sourceId);
    if (methodSrc && methodSrc.ruleId !== containerResult.sourceReference.ruleId) {
      sources.push(methodSrc);
    }
  }

  const handleStartBatch = () => {
    setIsStartModalOpen(true);
  };

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 space-y-8">
      {/* Top Breadcrumb & Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/setup"
          className="inline-flex items-center text-xs font-semibold text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="mr-1 h-3.5 w-3.5" />
          <span>Edit Wizard Inputs</span>
        </Link>
        <span className="text-xs font-mono text-muted uppercase">Rule Engine v1.0 • Citations Active</span>
      </div>

      {/* Main Explainable Recommendation Card */}
      <RecommendationCard
        containerResult={containerResult}
        methodPlan={methodPlan}
        volumeLitres={volumeLitres}
        onViewSources={() => setIsDrawerOpen(true)}
        onStartBatch={handleStartBatch}
      />

      {/* Source Provenance Slide-over Drawer */}
      <SourceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sources={sources}
      />

      {/* Start Batch Modal */}
      <StartBatchModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        defaultMethod={methodPlan?.chosenMethod}
        containerVolumeLitres={volumeLitres}
      />
    </div>
  );
}
