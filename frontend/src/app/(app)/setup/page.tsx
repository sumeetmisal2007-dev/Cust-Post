"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProgressStepper } from "@/components/ui/stepper";
import {
  useSetupWizardStore,
  useSetupWizardHydrated,
} from "@/lib/stores/setup-wizard.store";
import { StepSpace } from "@/components/setup/step-space";
import { StepContainer } from "@/components/setup/step-container";
import { StepMaterials } from "@/components/setup/step-materials";
import { StepPreferences } from "@/components/setup/step-preferences";
import { StepReview } from "@/components/setup/step-review";

const WIZARD_STEPS = [
  { id: 1, name: "Space" },
  { id: 2, name: "Container" },
  { id: 3, name: "Materials" },
  { id: 4, name: "Preferences" },
  { id: 5, name: "Review" },
];

export default function SetupWizardPage() {
  const router = useRouter();
  const isHydrated = useSetupWizardHydrated();
  const { currentStep, setCurrentStep, resetWizard } = useSetupWizardStore();

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleJumpToStep = (stepId: number) => {
    if (stepId >= 1 && stepId <= 5) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGenerateRecommendation = () => {
    router.push("/setup/result");
  };

  if (!isHydrated) {
    return (
      <div className="py-20 max-w-4xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-surface border border-border shadow-soft text-muted text-sm font-medium">
          <div className="h-4 w-4 rounded-full border-2 border-action border-t-transparent animate-spin" />
          <span>Restoring your setup progress...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4">
      {/* Stepper Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex-1">
          <ProgressStepper
            steps={WIZARD_STEPS}
            currentStep={currentStep}
            onStepClick={handleJumpToStep}
          />
        </div>
        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => {
              resetWizard();
            }}
            className="hidden sm:inline-flex items-center text-xs font-semibold text-muted hover:text-rose-600 transition-colors shrink-0"
            title="Clear saved setup inputs and start from step 1"
          >
            Start Fresh
          </button>
        )}
      </div>

      {/* Step Components */}
      <div className="bg-surface rounded-card p-6 sm:p-8 border border-border shadow-soft amc-card-smooth">
        <div key={currentStep} className="amc-page-enter">
          {currentStep === 1 && <StepSpace onNext={handleNext} />}
          {currentStep === 2 && <StepContainer onNext={handleNext} onBack={handleBack} />}
          {currentStep === 3 && <StepMaterials onNext={handleNext} onBack={handleBack} />}
          {currentStep === 4 && <StepPreferences onNext={handleNext} onBack={handleBack} />}
          {currentStep === 5 && (
            <StepReview
              onEditStep={handleJumpToStep}
              onSubmit={handleGenerateRecommendation}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}
