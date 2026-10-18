import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { MaturityChecklist } from "@/components/compost/maturity-checklist";
import { BatchCompletionModal } from "@/components/compost/batch-completion-modal";

describe("Task 25: Physical Maturity Checklist & Batch Completion Flow", () => {
  describe("MaturityChecklist", () => {
    it("renders all 4 physical verification checks", () => {
      render(
        <MaturityChecklist
          batchId="batch-123"
          onComplete={vi.fn()}
        />
      );

      expect(screen.getByText(/dark crumbly texture/i)).toBeInTheDocument();
      expect(screen.getByText(/earthy odor with zero rotting odor/i)).toBeInTheDocument();
      expect(screen.getByText(/ambient outdoor temperature/i)).toBeInTheDocument();
      expect(screen.getByText(/food scraps unrecognizable/i)).toBeInTheDocument();
    });

    it("displays 'not ready' warning when some checks are incomplete", () => {
      render(
        <MaturityChecklist
          batchId="batch-123"
          onComplete={vi.fn()}
        />
      );

      // Initially all false
      expect(screen.getByText(/compost not ready yet/i)).toBeInTheDocument();
      const confirmBtn = screen.getByRole("button", { name: /confirm batch ready/i });
      expect(confirmBtn).toBeDisabled();
    });

    it("enables 'Confirm Batch Ready' when all 4 checks are satisfied", async () => {
      const handleComplete = vi.fn();
      render(
        <MaturityChecklist
          batchId="batch-123"
          onComplete={handleComplete}
        />
      );

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes.length).toBe(4);

      // Check all 4
      checkboxes.forEach((cb) => fireEvent.click(cb));

      await waitFor(() => {
        expect(screen.getByText(/mature & ready for use/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/20–30% mature compost/i)).toBeInTheDocument();
      const confirmBtn = screen.getByRole("button", { name: /confirm batch ready/i });
      expect(confirmBtn).not.toBeDisabled();

      fireEvent.click(confirmBtn);
      expect(handleComplete).toHaveBeenCalled();
    });
  });

  describe("BatchCompletionModal", () => {
    it("renders completion celebratory modal and triggers onConfirm", () => {
      const handleConfirm = vi.fn();
      render(
        <BatchCompletionModal
          isOpen={true}
          batchName="Balcony Compost #1"
          onConfirm={handleConfirm}
          onClose={vi.fn()}
        />
      );

      expect(screen.getByText(/congratulations! batch completed/i)).toBeInTheDocument();
      expect(screen.getByText(/balcony compost #1/i)).toBeInTheDocument();

      const finishBtn = screen.getByRole("button", { name: /mark batch as completed/i });
      fireEvent.click(finishBtn);
      expect(handleConfirm).toHaveBeenCalled();
    });
  });
});
