import { describe, it, expect, beforeEach } from "vitest";
import { batchStorageService } from "@cust-post/backend";
import { POST, GET } from "@/app/api/batches/route";
import { NextRequest } from "next/server";

describe("Task 21: Batch Initialization & Persistence Layer", () => {
  beforeEach(() => {
    batchStorageService.clearMemory();
  });

  describe("BatchStorageService", () => {
    it("creates a new batch with calculated readiness window", async () => {
      const batch = await batchStorageService.createBatch({
        batchName: "Balcony Bin #1",
        method: "aerobic_bin",
        startDate: "2026-10-18",
        containerVolumeLitres: 45,
        notes: "First balcony run",
      });

      expect(batch.id).toBeDefined();
      expect(batch.batchName).toBe("Balcony Bin #1");
      expect(batch.status).toBe("active");
      expect(batch.totalMeasuredInputKg).toBe(0);
      expect(batch.totalEstimatedInputKg).toBe(0);
      expect(batch.readinessWindowStart).toBeDefined();
      expect(batch.readinessWindowEnd).toBeDefined();

      const fetched = await batchStorageService.getBatchById(batch.id);
      expect(fetched?.batchName).toBe("Balcony Bin #1");
    });

    it("records dated observations and updates batch input metrics", async () => {
      const batch = await batchStorageService.createBatch({
        batchName: "Test Batch",
        method: "vermicomposting",
        startDate: "2026-10-18",
      });

      const obs1 = await batchStorageService.addObservation({
        batchId: batch.id,
        observedAt: new Date().toISOString(),
        moisture: "ideal",
        odour: "earthy",
        turned: false,
        wasteAddedKg: 1.5,
        wasteDataStatus: "measured",
      });

      expect(obs1.id).toBeDefined();

      const updatedBatch = await batchStorageService.getBatchById(batch.id);
      expect(updatedBatch?.totalMeasuredInputKg).toBe(1.5);
      expect(updatedBatch?.totalEstimatedInputKg).toBe(0);

      // Add estimated waste
      await batchStorageService.addObservation({
        batchId: batch.id,
        observedAt: new Date().toISOString(),
        moisture: "ideal",
        odour: "earthy",
        turned: true,
        wasteAddedKg: 2.0,
        wasteDataStatus: "estimated",
      });

      const updatedBatch2 = await batchStorageService.getBatchById(batch.id);
      expect(updatedBatch2?.totalMeasuredInputKg).toBe(1.5);
      expect(updatedBatch2?.totalEstimatedInputKg).toBe(2.0);

      const allObs = await batchStorageService.getObservations(batch.id);
      expect(allObs.length).toBe(2);
    });
  });

  describe("API Route: /api/batches", () => {
    it("POST /api/batches creates batch on valid payload", async () => {
      const req = new NextRequest("http://localhost:3000/api/batches", {
        method: "POST",
        body: JSON.stringify({
          batchName: "API Test Bin",
          method: "aerobic_bin",
          startDate: "2026-10-18",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.batch.batchName).toBe("API Test Bin");
    });

    it("POST /api/batches returns 400 on invalid payload", async () => {
      const req = new NextRequest("http://localhost:3000/api/batches", {
        method: "POST",
        body: JSON.stringify({
          batchName: "", // invalid empty name
          method: "invalid_method",
          startDate: "not-a-date",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("Validation failed");
    });

    it("GET /api/batches lists created batches", async () => {
      await batchStorageService.createBatch({
        batchName: "Listed Bin",
        method: "bokashi",
        startDate: "2026-10-18",
      });

      const res = await GET();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.batches.some((b: { batchName: string }) => b.batchName === "Listed Bin")).toBe(true);
    });
  });
});
