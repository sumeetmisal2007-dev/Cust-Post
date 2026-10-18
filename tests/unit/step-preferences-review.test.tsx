import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { StepPreferences } from "@/components/setup/step-preferences";
import { StepReview } from "@/components/setup/step-review";
import { useSetupWizardStore } from "@/lib/stores/setup-wizard.store";

describe("Setup Wizard Steps 4 & 5: Preferences and Review (Task 19)", () => {
  beforeEach(() => {
    const store = useSetupWizardStore.getState();
    store.setSpaceProfile({
      locationType: "balcony",
      lengthCm: 100,
      widthCm: 80,
      maxHeightCm: 120,
    });
    store.setContainerInputs({
      shape: "rectangular",
      internalLengthCm: 50,
      internalWidthCm: 40,
      internalHeightCm: 35,
      material: "plastic_bucket",
      previousUse: "food",
      condition: "good",
      hasLid: true,
      hasVentilationHoles: true,
      hasDrainageHoles: true,
    });
    store.setWasteItems([
      { category: "greens", name: "vegetable_peels", quantityWeekly: 2, unit: "kg" },
      { category: "browns", name: "dry_leaves", quantityWeekly: 1, unit: "kg" },
    ]);
  });

  describe("StepPreferences", () => {
    it("renders maintenance capacity and smell sensitivity options", () => {
      render(<StepPreferences onNext={vi.fn()} onBack={vi.fn()} />);
      expect(screen.getByText(/maintenance willingness/i)).toBeInTheDocument();
      expect(screen.getByText(/weekly turning/i)).toBeInTheDocument();
      expect(screen.getByText(/smell sensitivity/i)).toBeInTheDocument();
    });

    it("saves preferences to store and calls onNext", async () => {
      const handleNext = vi.fn();
      render(<StepPreferences onNext={handleNext} onBack={vi.fn()} />);

      fireEvent.click(screen.getByRole("button", { name: /review setup summary/i }));

      await waitFor(() => {
        expect(handleNext).toHaveBeenCalled();
      });
      const prefs = useSetupWizardStore.getState().preferences;
      expect(prefs.maintenanceCapacity).toBeDefined();
    });
  });

  describe("StepReview", () => {
    it("displays summary of space, container, materials, and provides edit links", () => {
      const handleEdit = vi.fn();
      const handleSubmit = vi.fn();

      render(<StepReview onEditStep={handleEdit} onSubmit={handleSubmit} onBack={vi.fn()} />);

      expect(screen.getByText(/setup summary review/i)).toBeInTheDocument();
      expect(screen.getByText(/balcony/i)).toBeInTheDocument();
      expect(screen.getByText(/plastic bucket/i)).toBeInTheDocument();
      expect(screen.getByText(/vegetable peels/i)).toBeInTheDocument();

      const editButtons = screen.getAllByRole("button", { name: /edit/i });
      expect(editButtons.length).toBeGreaterThanOrEqual(3);
    });

    it("triggers onSubmit when 'Generate My Recommendation' is clicked", async () => {
      const handleSubmit = vi.fn();
      render(<StepReview onEditStep={vi.fn()} onSubmit={handleSubmit} onBack={vi.fn()} />);

      const generateBtn = screen.getByRole("button", { name: /generate recommendation/i });
      fireEvent.click(generateBtn);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled();
      });
    });
  });
});
