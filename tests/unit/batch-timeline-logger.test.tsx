import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { BatchTimeline } from "@/components/dashboard/batch-timeline";
import { LogObservationModal } from "@/components/dashboard/log-observation-modal";
import { batchStorageService } from "@/lib/services/batch-storage.service";
import { BatchObservation } from "@/types/domain";

const mockObservations: BatchObservation[] = [
  {
    id: "obs-1",
    batchId: "batch-1",
    observedAt: "2026-10-18T09:30:00.000Z",
    moisture: "ideal",
    odour: "earthy",
    temperatureC: 45,
    temperatureStatus: "measured",
    wasteAddedKg: 1.2,
    wasteDataStatus: "measured",
    turned: true,
    notes: "Turned thoroughly, warm steam noticed.",
    createdAt: "2026-10-18T09:30:00.000Z",
  },
];

describe("Task 23: Batch Observation Logger & Timeline", () => {
  beforeEach(() => {
    batchStorageService.clearMemory();
  });

  describe("BatchTimeline", () => {
    it("renders empty state when no observations exist", () => {
      const handleLogFirst = vi.fn();
      render(<BatchTimeline observations={[]} onLogFirst={handleLogFirst} />);

      expect(screen.getByText(/no observations logged yet/i)).toBeInTheDocument();
      const btn = screen.getByRole("button", { name: /log first observation/i });
      fireEvent.click(btn);
      expect(handleLogFirst).toHaveBeenCalled();
    });

    it("renders timeline event rows with moisture, odour, and turned status", () => {
      render(<BatchTimeline observations={mockObservations} onLogFirst={vi.fn()} />);

      expect(screen.getByText(/batch observation timeline/i)).toBeInTheDocument();
      expect(screen.getByText(/ideal/i)).toBeInTheDocument();
      expect(screen.getByText(/earthy/i)).toBeInTheDocument();
      expect(screen.getByText(/turned & aerated/i)).toBeInTheDocument();
      expect(screen.getByText(/1\.2\s*kg/i)).toBeInTheDocument();
      expect(screen.getByText(/turned thoroughly, warm steam noticed/i)).toBeInTheDocument();
    });

    it("renders photo journal image when attached to observation", () => {
      const obsWithPhoto: BatchObservation = {
        ...mockObservations[0],
        id: "obs-photo",
        imageUrl: "data:image/jpeg;base64,samplepilephoto",
      };
      render(<BatchTimeline observations={[obsWithPhoto]} onLogFirst={vi.fn()} />);

      const img = screen.getByRole("img", { name: /compost pile on/i });
      expect(img).toBeInTheDocument();
      expect(screen.getByText(/photo journal/i)).toBeInTheDocument();
    });
  });

  describe("LogObservationModal", () => {
    it("renders modal form with moisture, odour, turning, photo journal, and note inputs", () => {
      render(
        <LogObservationModal
          isOpen={true}
          batchId="batch-1"
          onClose={vi.fn()}
          onSaved={vi.fn()}
        />
      );

      expect(screen.getByText(/log batch observation/i)).toBeInTheDocument();
      expect(screen.getByText(/moisture level/i)).toBeInTheDocument();
      expect(screen.getByText(/odour check/i)).toBeInTheDocument();
      expect(screen.getByText(/turned \/ mixed pile today/i)).toBeInTheDocument();
      expect(screen.getByText(/pile photo journal/i)).toBeInTheDocument();
    });

    it("saves observation and calls onSaved callback", async () => {
      const handleSaved = vi.fn();
      const handleClose = vi.fn();

      render(
        <LogObservationModal
          isOpen={true}
          batchId="batch-1"
          onClose={handleClose}
          onSaved={handleSaved}
        />
      );

      // Select 'dry' moisture
      fireEvent.click(screen.getByRole("button", { name: /dry/i }));

      // Click save button
      fireEvent.click(screen.getByRole("button", { name: /record observation/i }));

      await waitFor(() => {
        expect(handleSaved).toHaveBeenCalled();
        expect(handleClose).toHaveBeenCalled();
      });

      const obs = await batchStorageService.getObservations("batch-1");
      expect(obs.length).toBe(1);
      expect(obs[0].moisture).toBe("dry");
    });
  });
});
