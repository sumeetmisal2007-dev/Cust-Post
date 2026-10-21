import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  useSetupWizardStore,
  validateWizardState,
  STORAGE_KEY,
  SAMPLE_BALCONY_SETUP,
} from "@/lib/stores/setup-wizard.store";

describe("Setup Wizard Zustand Store with Persistence & Validation", () => {
  beforeEach(() => {
    localStorage.clear();
    useSetupWizardStore.getState().resetWizard();
  });

  it("initializes with default values", () => {
    const state = useSetupWizardStore.getState();
    expect(state.currentStep).toBe(1);
    expect(state.spaceProfile).toBeNull();
    expect(state.containerInputs).toBeNull();
    expect(state.wasteItems).toEqual([]);
    expect(state.preferences.maintenanceCapacity).toBe("weekly_turning");
  });

  it("persists updates to localStorage under the privacy-compliant key", () => {
    const store = useSetupWizardStore.getState();
    store.setSpaceProfile({
      locationType: "balcony",
      lengthCm: 150,
      widthCm: 90,
      maxHeightCm: 120,
    });

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.spaceProfile.locationType).toBe("balcony");
    expect(parsed.state.spaceProfile.lengthCm).toBe(150);
  });

  it("validates and filters corrupted spaceProfile without crashing", () => {
    const corruptedInput = {
      currentStep: 3,
      spaceProfile: {
        locationType: "outer_space",
        lengthCm: -50,
      },
    };

    const validated = validateWizardState(corruptedInput);
    expect(validated.spaceProfile).toBeNull();

    expect(validated.currentStep).toBe(1);
  });

  it("validates and filters corrupted containerInputs without crashing", () => {
    const corruptedInput = {
      currentStep: 4,
      spaceProfile: {
        locationType: "balcony",
        lengthCm: 100,
        widthCm: 80,
        maxHeightCm: 120,
      },
      containerInputs: {
        shape: "unknown_shape",
        internalHeightCm: "not_a_number",
      },
    };

    const validated = validateWizardState(corruptedInput);
    expect(validated.spaceProfile).not.toBeNull();
    expect(validated.containerInputs).toBeNull();

    expect(validated.currentStep).toBe(2);
  });

  it("filters out invalid wasteItems while keeping valid ones", () => {
    const inputWithMixedItems = {
      wasteItems: [
        { category: "greens", name: "veg_peels", quantityWeekly: 2, unit: "kg" },
        { category: "radioactive_waste", name: "uranium", quantityWeekly: -99 },
      ],
    };

    const validated = validateWizardState(inputWithMixedItems);
    expect(validated.wasteItems.length).toBe(1);
    expect(validated.wasteItems[0].name).toBe("veg_peels");
  });

  it("falls back to default preferences when corrupted", () => {
    const inputWithCorruptedPrefs = {
      preferences: {
        maintenanceCapacity: "never_touch",
        smellSensitivity: "super_extreme",
      },
    };

    const validated = validateWizardState(inputWithCorruptedPrefs);
    expect(validated.preferences.maintenanceCapacity).toBe("weekly_turning");
    expect(validated.preferences.smellSensitivity).toBe("medium");
  });

  it("clears localStorage and resets in-memory state on resetWizard()", () => {
    const store = useSetupWizardStore.getState();
    store.setSpaceProfile({
      locationType: "indoor",
      lengthCm: 60,
      widthCm: 60,
      maxHeightCm: 90,
    });
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

    store.resetWizard();

    const state = useSetupWizardStore.getState();
    expect(state.spaceProfile).toBeNull();
    expect(state.currentStep).toBe(1);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("populates verified sample balcony setup when loadSampleSetup() is called", () => {
    const store = useSetupWizardStore.getState();
    store.loadSampleSetup();

    const state = useSetupWizardStore.getState();
    expect(state.spaceProfile?.locationType).toBe(SAMPLE_BALCONY_SETUP.spaceProfile.locationType);
    expect(state.containerInputs?.shape).toBe(SAMPLE_BALCONY_SETUP.containerInputs.shape);
    expect(state.wasteItems.length).toBeGreaterThan(0);
    expect(state.currentStep).toBe(5);

    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.state.containerInputs.isFoodGrade).toBe("food_grade");
  });
});
