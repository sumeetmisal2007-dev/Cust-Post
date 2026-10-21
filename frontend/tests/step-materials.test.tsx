import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { StepMaterials } from "@/components/setup/step-materials";
import { useSetupWizardStore } from "@/lib/stores/setup-wizard.store";

describe("Setup Wizard Step 3: Waste Materials Inventory (Task 18)", () => {
  beforeEach(() => {
    useSetupWizardStore.getState().resetWizard();
  });

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

  it("displays estimate labels for default quantities", () => {
    render(<StepMaterials onNext={vi.fn()} onBack={vi.fn()} />);

    expect(screen.getAllByText(/est\. default/i).length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText(/default estimate: ~0\.8 kg\/week/i)).toBeInTheDocument();
  });

  it("allows user to customize weekly quantity and unit", async () => {
    const handleNext = vi.fn();
    render(<StepMaterials onNext={handleNext} onBack={vi.fn()} />);

    const vegInput = screen.getByLabelText(/vegetable scraps & fruit peels quantity in kg/i);
    expect(vegInput).toHaveValue(2.5);

    fireEvent.change(vegInput, { target: { value: "4.2" } });
    expect(vegInput).toHaveValue(4.2);

    const unitSelect = screen.getByLabelText(/vegetable scraps & fruit peels unit/i);
    fireEvent.change(unitSelect, { target: { value: "litres" } });

    const continueBtn = screen.getByRole("button", { name: /continue to preferences/i });
    fireEvent.click(continueBtn);

    await waitFor(() => {
      expect(handleNext).toHaveBeenCalled();
    });

    const items = useSetupWizardStore.getState().wasteItems;
    const vegItem = items.find((i) => i.name === "vegetable_peels");
    expect(vegItem?.quantityWeekly).toBe(4.2);
    expect(vegItem?.unit).toBe("litres");
  });

  it("dynamically recalculates live mixture balance when user changes quantities", async () => {
    render(<StepMaterials onNext={vi.fn()} onBack={vi.fn()} />);

    expect(screen.getByText(/balanced ratio/i)).toBeInTheDocument();

    const vegInput = screen.getByLabelText(/vegetable scraps & fruit peels quantity in kg/i);
    fireEvent.change(vegInput, { target: { value: "20" } });

    await waitFor(() => {
      expect(screen.getByText(/adjustment advised/i)).toBeInTheDocument();
      expect(screen.getByText(/excess nitrogen and moisture detected/i)).toBeInTheDocument();
    });
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
