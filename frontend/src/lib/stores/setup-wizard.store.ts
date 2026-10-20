import { useState, useEffect } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  SpaceDimensions,
  ContainerCheckInputs,
  WasteInputItem,
  MaintenanceCapacity,
  SmellSensitivity,
} from "@cust-post/backend";
import {
  spaceProfileSchema,
  containerCheckSchema,
} from "@cust-post/backend";
import { wasteInputItemSchema } from "@cust-post/backend";

export const STORAGE_KEY = "cust_post_setup_wizard";

export interface SetupPreferences {
  maintenanceCapacity: MaintenanceCapacity;
  smellSensitivity: SmellSensitivity;
  interestedInWorms: boolean;
}

export interface SetupWizardState {
  currentStep: number;
  spaceProfile: SpaceDimensions | null;
  containerInputs: ContainerCheckInputs | null;
  wasteItems: WasteInputItem[];
  preferences: SetupPreferences;
  isHydrated: boolean;

  setCurrentStep: (step: number) => void;
  setSpaceProfile: (data: SpaceDimensions) => void;
  setContainerInputs: (data: ContainerCheckInputs) => void;
  setWasteItems: (items: WasteInputItem[]) => void;
  setPreferences: (data: Partial<SetupPreferences>) => void;
  resetWizard: () => void;
  setHydrated: (val: boolean) => void;
  loadSampleSetup: () => void;
}

export const defaultPreferences: SetupPreferences = {
  maintenanceCapacity: "weekly_turning",
  smellSensitivity: "medium",
  interestedInWorms: false,
};

export const SAMPLE_BALCONY_SETUP = {
  currentStep: 5,
  spaceProfile: {
    locationType: "balcony" as const,
    lengthCm: 120,
    widthCm: 80,
    maxHeightCm: 120,
  },
  containerInputs: {
    shape: "cylindrical" as const,
    internalHeightCm: 40,
    diameterCm: 30,
    externalHeightCm: 42,
    externalDiameterCm: 32,
    material: "plastic_bucket" as const,
    previousUse: "food" as const,
    condition: "good" as const,
    hasLid: true,
    hasVentilationHoles: true,
    hasDrainageHoles: true,
    isFoodGrade: "food_grade" as const,
  },
  wasteItems: [
    {
      category: "greens" as const,
      name: "vegetable_peels",
      quantityWeekly: 2.5,
      unit: "kg" as const,
    },
    {
      category: "browns" as const,
      name: "dry_leaves",
      quantityWeekly: 1.5,
      unit: "kg" as const,
    },
    {
      category: "greens" as const,
      name: "coffee_grounds",
      quantityWeekly: 0.5,
      unit: "kg" as const,
    },
  ],
  preferences: {
    maintenanceCapacity: "weekly_turning" as const,
    smellSensitivity: "medium" as const,
    interestedInWorms: false,
  },
};

/**
 * Safe client-side storage accessor ensuring guest-mode privacy (100% on-device).
 * Gracefully degrades to a dummy memory store in SSR or restricted privacy modes.
 */
export const getSafeLocalStorage = () => {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  try {
    const testKey = "__cust_post_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
};

/**
 * Validates and sanitizes persisted wizard state on startup/rehydration.
 * Corrupted or outdated keys are filtered safely without crashing the engine.
 */
export function validateWizardState(persisted: unknown): {
  currentStep: number;
  spaceProfile: SpaceDimensions | null;
  containerInputs: ContainerCheckInputs | null;
  wasteItems: WasteInputItem[];
  preferences: SetupPreferences;
} {
  const result = {
    currentStep: 1,
    spaceProfile: null as SpaceDimensions | null,
    containerInputs: null as ContainerCheckInputs | null,
    wasteItems: [] as WasteInputItem[],
    preferences: { ...defaultPreferences },
  };

  if (!persisted || typeof persisted !== "object") {
    return result;
  }

  const p = persisted as Record<string, unknown>;

  // 1. Validate Space Profile
  if (p.spaceProfile) {
    const spaceParsed = spaceProfileSchema.safeParse(p.spaceProfile);
    if (spaceParsed.success) {
      result.spaceProfile = spaceParsed.data as SpaceDimensions;
    }
  }

  // 2. Validate Container Inputs
  if (p.containerInputs) {
    const contParsed = containerCheckSchema.safeParse(p.containerInputs);
    if (contParsed.success) {
      result.containerInputs = contParsed.data as ContainerCheckInputs;
    }
  }

  // 3. Validate Waste Materials
  if (Array.isArray(p.wasteItems)) {
    const validItems: WasteInputItem[] = [];
    for (const item of p.wasteItems) {
      const itemParsed = wasteInputItemSchema.safeParse(item);
      if (itemParsed.success) {
        validItems.push(itemParsed.data as WasteInputItem);
      }
    }
    result.wasteItems = validItems;
  }

  // 4. Validate Preferences
  if (p.preferences && typeof p.preferences === "object") {
    const prefObj = p.preferences as Record<string, unknown>;
    const validCapacities: MaintenanceCapacity[] = [
      "daily_stirring",
      "weekly_turning",
      "minimal_effort",
    ];
    const validSensitivities: SmellSensitivity[] = ["high", "medium", "low"];

    result.preferences = {
      maintenanceCapacity: validCapacities.includes(
        prefObj.maintenanceCapacity as MaintenanceCapacity
      )
        ? (prefObj.maintenanceCapacity as MaintenanceCapacity)
        : defaultPreferences.maintenanceCapacity,
      smellSensitivity: validSensitivities.includes(
        prefObj.smellSensitivity as SmellSensitivity
      )
        ? (prefObj.smellSensitivity as SmellSensitivity)
        : defaultPreferences.smellSensitivity,
      interestedInWorms:
        typeof prefObj.interestedInWorms === "boolean"
          ? prefObj.interestedInWorms
          : defaultPreferences.interestedInWorms,
    };
  }

  // 5. Validate Step Progression & Prerequisite Guardrails
  if (typeof p.currentStep === "number" && Number.isInteger(p.currentStep)) {
    let step = Math.max(1, Math.min(5, p.currentStep));
    if (step > 1 && !result.spaceProfile) {
      step = 1;
    } else if (step > 2 && !result.containerInputs) {
      step = 2;
    }
    result.currentStep = step;
  }

  return result;
}

export const useSetupWizardStore = create<SetupWizardState>()(
  persist(
    (set) => ({
      currentStep: 1,
      spaceProfile: null,
      containerInputs: null,
      wasteItems: [],
      preferences: defaultPreferences,
      isHydrated: false,

      setCurrentStep: (step) => set({ currentStep: step }),
      setSpaceProfile: (data) => set({ spaceProfile: data }),
      setContainerInputs: (data) => set({ containerInputs: data }),
      setWasteItems: (items) => set({ wasteItems: items }),
      setPreferences: (data) =>
        set((state) => ({ preferences: { ...state.preferences, ...data } })),
      setHydrated: (val) => set({ isHydrated: val }),

      loadSampleSetup: () =>
        set({
          ...SAMPLE_BALCONY_SETUP,
          isHydrated: true,
        }),

      resetWizard: () => {
        set({
          currentStep: 1,
          spaceProfile: null,
          containerInputs: null,
          wasteItems: [],
          preferences: defaultPreferences,
        });
        try {
          getSafeLocalStorage().removeItem(STORAGE_KEY);
        } catch {
          // Ignore removal errors
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => getSafeLocalStorage()),
      partialize: (state) => ({
        currentStep: state.currentStep,
        spaceProfile: state.spaceProfile,
        containerInputs: state.containerInputs,
        wasteItems: state.wasteItems,
        preferences: state.preferences,
      }),
      merge: (persistedState, currentState) => {
        const validated = validateWizardState(persistedState);
        return {
          ...currentState,
          ...validated,
          isHydrated: true,
        };
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);

/**
 * Hook to safely check whether Zustand setup wizard state has hydrated from localStorage.
 * Prevents SSR hydration mismatches and UI flashing in Next.js client components.
 */
export function useSetupWizardHydrated(): boolean {
  const isHydratedInStore = useSetupWizardStore((state) => state.isHydrated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (isHydratedInStore || useSetupWizardStore.persist?.hasHydrated?.()) {
      setHydrated(true);
      return;
    }
    const unsub = useSetupWizardStore.persist?.onFinishHydration?.(() => {
      setHydrated(true);
    });
    return () => {
      unsub?.();
    };
  }, [isHydratedInStore]);

  return hydrated || isHydratedInStore;
}
