"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProgressStepper } from "@/components/ui/stepper";
import { useSetupWizardStore } from "@/lib/stores/setup-wizard.store";
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
  const { currentStep, setCurrentStep } = useSetupWizardStore();

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

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4">
      {/* Stepper Header */}
      <div className="mb-8">
        <ProgressStepper
          steps={WIZARD_STEPS}
          currentStep={currentStep}
          onStepClick={handleJumpToStep}
        />
      </div>

      {/* Step Components */}
      <div className="bg-surface rounded-card p-6 sm:p-8 border border-border shadow-soft">
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
  );
}
