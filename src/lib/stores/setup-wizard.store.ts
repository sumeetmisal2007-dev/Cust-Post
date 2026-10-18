import { create } from "zustand";
import {
  SpaceDimensions,
  ContainerCheckInputs,
  WasteInputItem,
  MaintenanceCapacity,
  SmellSensitivity,
} from "@/types/domain";

export interface SetupPreferences {
  maintenanceCapacity: MaintenanceCapacity;
  smellSensitivity: SmellSensitivity;
  interestedInWorms: boolean;
}

interface SetupWizardState {
  currentStep: number;
  spaceProfile: SpaceDimensions | null;
  containerInputs: ContainerCheckInputs | null;
  wasteItems: WasteInputItem[];
  preferences: SetupPreferences;

  setCurrentStep: (step: number) => void;
  setSpaceProfile: (data: SpaceDimensions) => void;
  setContainerInputs: (data: ContainerCheckInputs) => void;
  setWasteItems: (items: WasteInputItem[]) => void;
  setPreferences: (data: Partial<SetupPreferences>) => void;
  resetWizard: () => void;
}

const defaultPreferences: SetupPreferences = {
  maintenanceCapacity: "weekly_turning",
  smellSensitivity: "medium",
  interestedInWorms: false,
};

export const useSetupWizardStore = create<SetupWizardState>((set) => ({
  currentStep: 1,
  spaceProfile: null,
  containerInputs: null,
  wasteItems: [],
  preferences: defaultPreferences,

  setCurrentStep: (step) => set({ currentStep: step }),
  setSpaceProfile: (data) => set({ spaceProfile: data }),
  setContainerInputs: (data) => set({ containerInputs: data }),
  setWasteItems: (items) => set({ wasteItems: items }),
  setPreferences: (data) =>
    set((state) => ({ preferences: { ...state.preferences, ...data } })),
  resetWizard: () =>
    set({
      currentStep: 1,
      spaceProfile: null,
      containerInputs: null,
      wasteItems: [],
      preferences: defaultPreferences,
    }),
}));
