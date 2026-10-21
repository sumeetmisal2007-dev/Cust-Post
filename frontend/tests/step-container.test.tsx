import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { StepContainer } from "@/components/setup/step-container";
import { useSetupWizardStore } from "@/lib/stores/setup-wizard.store";

describe("Setup Wizard Step 2: ContainerCheck (Task 17)", () => {
  beforeEach(() => {
    useSetupWizardStore.getState().setSpaceProfile({
      locationType: "balcony",
      lengthCm: 100,
      widthCm: 80,
      maxHeightCm: 120,
    });
  });

  it("calculates and displays live geometric volume as user enters dimensions", async () => {
    render(<StepContainer onNext={vi.fn()} onBack={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/internal length/i), {
      target: { value: "50" },
    });
    fireEvent.change(screen.getByLabelText(/internal width/i), {
      target: { value: "40" },
    });
    fireEvent.change(screen.getByLabelText(/internal height/i), {
      target: { value: "30" },
    });

    await waitFor(() => {
      expect(screen.getByText(/60(\.0)?\s*L/i)).toBeInTheDocument();
      expect(screen.getByText(/geometric volume only/i)).toBeInTheDocument();
    });
  });

  it("warns user if container exceeds available space from Step 1", async () => {
    render(<StepContainer onNext={vi.fn()} onBack={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/internal length/i), {
      target: { value: "110" },
    });
    fireEvent.change(screen.getByLabelText(/internal width/i), {
      target: { value: "50" },
    });
    fireEvent.change(screen.getByLabelText(/internal height/i), {
      target: { value: "50" },
    });

    await waitFor(() => {
      expect(
        screen.getByText(/exceeds available length/i)
      ).toBeInTheDocument();
    });
  });

  it("captures previous use including unknown and saves to store", async () => {
    const handleNext = vi.fn();
    render(<StepContainer onNext={handleNext} onBack={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/internal length/i), {
      target: { value: "40" },
    });
    fireEvent.change(screen.getByLabelText(/internal width/i), {
      target: { value: "30" },
    });
    fireEvent.change(screen.getByLabelText(/internal height/i), {
      target: { value: "40" },
    });

    fireEvent.change(screen.getByLabelText(/previous contents/i), {
      target: { value: "unknown" },
    });

    fireEvent.click(screen.getByRole("button", { name: /continue to materials/i }));

    await waitFor(() => {
      expect(handleNext).toHaveBeenCalled();
    });

    const store = useSetupWizardStore.getState();
    expect(store.containerInputs?.previousUse).toBe("unknown");
    expect(store.containerInputs?.material).toBeDefined();
  });
});
