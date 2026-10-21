import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { SymptomSelector } from "@/components/troubleshoot/symptom-selector";
import { ResolutionView } from "@/components/troubleshoot/resolution-view";
import { troubleshootCompost } from "@cust-post/backend";

describe("Task 24: Interactive Troubleshooting Assistant", () => {
  describe("SymptomSelector", () => {
    it("renders symptom choice tiles and allows selection", () => {
      const handleSelect = vi.fn();
      render(
        <SymptomSelector
          selectedSymptom={null}
          onSelectSymptom={handleSelect}
        />
      );

      expect(screen.getByText(/foul rotten egg or ammonia odor/i)).toBeInTheDocument();
      expect(screen.getByText(/excess moisture & soggy sludge/i)).toBeInTheDocument();
      expect(screen.getByText(/pests, fruit flies & maggots/i)).toBeInTheDocument();

      fireEvent.click(screen.getByText(/foul rotten egg or ammonia odor/i));
      expect(handleSelect).toHaveBeenCalledWith(
        expect.objectContaining({ symptom: "foul_odor_ammonia_rot" })
      );
    });

    it("displays conditional check when pests symptom is active", () => {
      render(
        <SymptomSelector
          selectedSymptom="pests_fruit_flies_maggots"
          onSelectSymptom={vi.fn()}
        />
      );

      expect(screen.getByText(/surface food scraps visible/i)).toBeInTheDocument();
    });
  });

  describe("ResolutionView", () => {
    it("renders inspection points, immediate corrective actions, and source citation", () => {
      const res = troubleshootCompost({
        symptom: "foul_odor_ammonia_rot",
        method: "aerobic_bin",
      });
      const handleApply = vi.fn();

      render(<ResolutionView resolution={res} onApplyLog={handleApply} />);

      expect(screen.getByText(/what to inspect/i)).toBeInTheDocument();
      expect(screen.getByText(/inspect bottom holes/i)).toBeInTheDocument();
      expect(screen.getByText(/what to do immediately/i)).toBeInTheDocument();
      expect(screen.getByText(/mix in 2–3 large handfuls of dry carbon/i)).toBeInTheDocument();
      expect(screen.getByText(/EPA Composting at Home/i)).toBeInTheDocument();

      const applyBtn = screen.getByRole("button", { name: /apply & record in batch log/i });
      fireEvent.click(applyBtn);
      expect(handleApply).toHaveBeenCalled();
    });
  });
});
