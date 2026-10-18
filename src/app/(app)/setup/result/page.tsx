"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSetupWizardStore } from "@/lib/stores/setup-wizard.store";
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
  const { spaceProfile, containerInputs, wasteItems, preferences } = useSetupWizardStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

  if (!containerInputs || !spaceProfile) {
    return (
      <div className="py-16 max-w-lg mx-auto px-4 text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <AlertCircle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-bold text-ink">No Setup Data Found</h2>
          <p className="text-sm text-muted">
            Please run through our space and container evaluation wizard first to generate an evidence-backed composting plan.
          </p>
        </div>
        <div>
          <Link href="/setup">
            <Button size="lg">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Start Setup Wizard</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 1. Calculate geometric volume
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
