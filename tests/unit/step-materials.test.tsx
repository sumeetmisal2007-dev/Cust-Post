import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { StepMaterials } from "@/components/setup/step-materials";
import { useSetupWizardStore } from "@/lib/stores/setup-wizard.store";

describe("Setup Wizard Step 3: Waste Materials Inventory (Task 18)", () => {
  it("renders categorized materials and allows selecting items", async () => {
    render(<StepMaterials onNext={vi.fn()} onBack={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: /greens \(nitrogen & moisture\)/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /browns \(carbon & structure\)/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/vegetable scraps & fruit peels/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/dry leaves & garden clippings/i)
    ).toBeInTheDocument();
  });

  it("warns user if excluded materials like meat or plastic are selected", async () => {
    render(<StepMaterials onNext={vi.fn()} onBack={vi.fn()} />);

    const meatOption = screen.getByLabelText(/meat, bones, or dairy/i);
    fireEvent.click(meatOption);

    await waitFor(() => {
      expect(screen.getByText(/excluded item alert/i)).toBeInTheDocument();
    });
  });

  it("saves selected materials to store and calls onNext", async () => {
    const handleNext = vi.fn();
    render(<StepMaterials onNext={handleNext} onBack={vi.fn()} />);

    // Default items (veg scraps + dry leaves) are selected; click continue
    const continueBtn = screen.getByRole("button", { name: /continue to preferences/i });
    expect(continueBtn).not.toBeDisabled();

    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(handleNext).toHaveBeenCalled();
    });

    const items = useSetupWizardStore.getState().wasteItems;
    expect(items.length).toBeGreaterThanOrEqual(2);
  });
});
