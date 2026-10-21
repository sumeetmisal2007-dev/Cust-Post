import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { StepSpace } from "@/components/setup/step-space";
import { useSetupWizardStore } from "@/lib/stores/setup-wizard.store";

describe("Setup Wizard Step 1: Space Profile (Task 16)", () => {
  it("renders location type choice tiles and dimension inputs", () => {
    render(<StepSpace onNext={vi.fn()} />);
    expect(screen.getByRole("button", { name: /balcony/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /indoor/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /terrace/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /garden/i })).toBeInTheDocument();

    expect(screen.getByLabelText(/available length/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/available width/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/maximum height/i)).toBeInTheDocument();
  });

  it("updates store and triggers onNext when valid dimensions are submitted", async () => {
    const handleNext = vi.fn();
    render(<StepSpace onNext={handleNext} />);

    fireEvent.click(screen.getByRole("button", { name: /balcony/i }));

    fireEvent.change(screen.getByLabelText(/available length/i), {
      target: { value: "120" },
    });
    fireEvent.change(screen.getByLabelText(/available width/i), {
      target: { value: "80" },
    });
    fireEvent.change(screen.getByLabelText(/maximum height/i), {
      target: { value: "150" },
    });

    fireEvent.click(screen.getByRole("button", { name: /continue to container/i }));

    await waitFor(() => {
      expect(handleNext).toHaveBeenCalled();
    });

    const store = useSetupWizardStore.getState();
    expect(store.spaceProfile?.locationType).toBe("balcony");
    expect(store.spaceProfile?.lengthCm).toBe(120);
  });

  it("displays validation error when entering 0 or negative numbers", async () => {
    render(<StepSpace onNext={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/available length/i), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByRole("button", { name: /continue to container/i }));

    await waitFor(() => {
      expect(screen.getByText(/length must be greater than 0/i)).toBeInTheDocument();
    });
  });
});
