import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import SetupResultPage from "@/app/(app)/setup/result/page";
import {
  useSetupWizardStore,
  SAMPLE_BALCONY_SETUP,
} from "@/lib/stores/setup-wizard.store";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("SetupResultPage Persistence & Recovery Path", () => {
  beforeEach(() => {
    localStorage.clear();
    useSetupWizardStore.getState().resetWizard();
    mockPush.mockClear();
  });

  it("renders recovery view with clear explanation and actions when no setup data exists", async () => {
    render(<SetupResultPage />);

    expect(screen.getByText(/no saved setup found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/stores all space and container evaluations directly in your browser's local storage/i)
    ).toBeInTheDocument();

    const startBtn = screen.getByRole("button", { name: /start setup wizard/i });
    const sampleBtn = screen.getByRole("button", { name: /load sample balcony plan/i });

    expect(startBtn).toBeInTheDocument();
    expect(sampleBtn).toBeInTheDocument();
  });

  it("clicking 'Start Setup Wizard' resets store and navigates to /setup", async () => {
    render(<SetupResultPage />);

    const startBtn = screen.getByRole("button", { name: /start setup wizard/i });
    fireEvent.click(startBtn);

    expect(mockPush).toHaveBeenCalledWith("/setup");
    expect(useSetupWizardStore.getState().currentStep).toBe(1);
  });

  it("clicking 'Load Sample Balcony Plan' immediately restores sample data and evaluates recommendation", async () => {
    render(<SetupResultPage />);

    const sampleBtn = screen.getByRole("button", { name: /load sample balcony plan/i });
    fireEvent.click(sampleBtn);

    await waitFor(() => {
      expect(screen.queryByText(/no saved setup found/i)).not.toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /your container is ready for composting/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/rule provenance/i)).toBeInTheDocument();
    });

    const state = useSetupWizardStore.getState();
    expect(state.spaceProfile?.locationType).toBe("balcony");
    expect(state.containerInputs?.shape).toBe("cylindrical");
  });

  it("renders recommendation directly when valid setup data is already present in store", () => {
    useSetupWizardStore.getState().setSpaceProfile(SAMPLE_BALCONY_SETUP.spaceProfile);
    useSetupWizardStore.getState().setContainerInputs(SAMPLE_BALCONY_SETUP.containerInputs);
    useSetupWizardStore.getState().setWasteItems(SAMPLE_BALCONY_SETUP.wasteItems);
    useSetupWizardStore.getState().setPreferences(SAMPLE_BALCONY_SETUP.preferences);

    render(<SetupResultPage />);

    expect(screen.queryByText(/no saved setup found/i)).not.toBeInTheDocument();
    expect(screen.getByText(/rule engine v1\.0/i)).toBeInTheDocument();
    expect(screen.getByText(/suitable/i)).toBeInTheDocument();
  });
});
