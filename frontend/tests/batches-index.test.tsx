import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import BatchesIndexPage from "@/app/(app)/batches/page";
import { batchStorageService } from "@cust-post/backend";
import { CompostBatch } from "@cust-post/backend";

describe("Batches Index Page (/batches)", () => {
  beforeEach(() => {
    batchStorageService.clearMemory();
  });

  it("renders empty state for apartment beginners when no batches exist", async () => {
    render(<BatchesIndexPage />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /no composting batches yet/i })
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("link", { name: /start your first setup/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/screen your vessel/i)).toBeInTheDocument();
    expect(screen.getByText(/balance wet & dry/i)).toBeInTheDocument();
    expect(screen.getByText(/feed your potted plants/i)).toBeInTheDocument();
  });

  it("renders dashboard of batches when batches exist in storage", async () => {
    const mockBatch: CompostBatch = {
      id: "batch-123",
      batchName: "Balcony Clay Pot #1",
      method: "aerobic_bin",
      startDate: "2026-10-15",
      status: "active",
      totalMeasuredInputKg: 3.5,
      totalEstimatedInputKg: 1.0,
      readinessWindowStart: "2026-12-01",
      readinessWindowEnd: "2026-12-20",
      createdAt: "2026-10-15T00:00:00.000Z",
      updatedAt: "2026-10-15T00:00:00.000Z",
    };

    vi.spyOn(batchStorageService, "listBatches").mockResolvedValue([mockBatch]);

    render(<BatchesIndexPage />);

    await waitFor(() => {
      expect(screen.getByText(/balcony clay pot #1/i)).toBeInTheDocument();
      expect(screen.getByText(/aerobic balcony bin/i)).toBeInTheDocument();
      expect(screen.getByText(/3\.5/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /view dashboard/i })).toBeInTheDocument();
    });
  });
});
