import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { BatchHeader } from "@/components/dashboard/batch-header";
import { MetricSummary } from "@/components/dashboard/metric-summary";
import { TurnReminderBanner } from "@/components/dashboard/turn-reminder-banner";
import { generateTurningCalendarIcs } from "@/lib/utils/calendar-export";
import { CompostBatch, BatchObservation } from "@cust-post/backend";

const mockBatch: CompostBatch = {
  id: "test-batch-123",
  batchName: "Balcony Bin #1",
  method: "aerobic_bin",
  startDate: "2026-10-01",
  status: "active",
  totalMeasuredInputKg: 4.5,
  totalEstimatedInputKg: 2.0,
  readinessWindowStart: "2026-11-26",
  readinessWindowEnd: "2026-12-24",
  createdAt: "2026-10-01T00:00:00.000Z",
  updatedAt: "2026-10-18T00:00:00.000Z",
};

const mockObservations: BatchObservation[] = [
  {
    id: "obs-1",
    batchId: "test-batch-123",
    observedAt: "2026-10-16T10:00:00.000Z",
    moisture: "ideal",
    odour: "earthy",
    turned: true,
    wasteAddedKg: 1.5,
    wasteDataStatus: "measured",
    createdAt: "2026-10-16T10:00:00.000Z",
  },
];

describe("Task 22: Active Batch Dashboard & Metric Tracking", () => {
  describe("BatchHeader", () => {
    it("renders batch name, method badge, and active status", () => {
      render(<BatchHeader batch={mockBatch} />);

      expect(screen.getByText(/balcony bin #1/i)).toBeInTheDocument();
      expect(screen.getByText(/aerobic/i)).toBeInTheDocument();
      expect(screen.getByText(/active/i)).toBeInTheDocument();
      expect(screen.getByText(/started/i)).toBeInTheDocument();
    });
  });

  describe("MetricSummary", () => {
    it("renders distinct measured and estimated organic waste inputs with data status", () => {
      render(
        <MetricSummary
          batch={mockBatch}
          observations={mockObservations}
          onLogObservation={vi.fn()}
        />
      );

      // Check measured inputs
      expect(screen.getByText(/4\.5\s*kg/i)).toBeInTheDocument();
      expect(screen.getByText(/measured/i)).toBeInTheDocument();

      // Check estimated inputs
      expect(screen.getByText(/2(\.0)?\s*kg/i)).toBeInTheDocument();
      expect(screen.getAllByText(/estimated/i).length).toBeGreaterThanOrEqual(2);
    });

    it("displays estimated readiness window with physical maturity disclaimer", () => {
      render(
        <MetricSummary
          batch={mockBatch}
          observations={mockObservations}
          onLogObservation={vi.fn()}
        />
      );

      expect(screen.getByText(/readiness window/i)).toBeInTheDocument();
      expect(screen.getByText(/2026-11-26/i)).toBeInTheDocument();
      expect(screen.getByText(/pending physical maturity checks/i)).toBeInTheDocument();
    });

    it("triggers onLogObservation when quick action button is clicked", () => {
      const handleLog = vi.fn();
      render(
        <MetricSummary
          batch={mockBatch}
          observations={mockObservations}
          onLogObservation={handleLog}
        />
      );

      const logBtn = screen.getByRole("button", { name: /log observation/i });
      fireEvent.click(logBtn);
      expect(handleLog).toHaveBeenCalled();
    });

    it("links to troubleshoot and maturity checklist pages", () => {
      render(
        <MetricSummary
          batch={mockBatch}
          observations={mockObservations}
          onLogObservation={vi.fn()}
        />
      );

      expect(screen.getByRole("link", { name: /troubleshoot/i })).toHaveAttribute(
        "href",
        "/batches/test-batch-123/troubleshoot"
      );
      expect(screen.getByRole("link", { name: /maturity checklist/i })).toHaveAttribute(
        "href",
        "/batches/test-batch-123/maturity"
      );
    });
  });

  describe("TurnReminderBanner & Push Notifications", () => {
    it("renders aeration reminder banner with cadence target and 1-tap quick turn", () => {
      const handleTurn = vi.fn();
      render(
        <TurnReminderBanner
          batch={mockBatch}
          observations={mockObservations}
          onTurnRecorded={handleTurn}
        />
      );

      expect(screen.getByText(/target cadence/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /1-tap quick turn/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /calendar/i })).toBeInTheDocument();
    });

    it("generates standard iCalendar .ics formatted turning schedule", () => {
      const ics = generateTurningCalendarIcs("Balcony Bin #1", "aerobic_bin");
      expect(ics).toContain("BEGIN:VCALENDAR");
      expect(ics).toContain("SUMMARY:Aerate Compost Batch: Balcony Bin #1");
      expect(ics).toContain("RRULE:FREQ=WEEKLY;INTERVAL=1");
      expect(ics).toContain("END:VCALENDAR");
    });
  });
});
