import { CompostBatch, BatchObservation } from "../types/domain";
import { CreateBatchInput } from "../validation/batch.schema";
import { estimateReadinessWindow } from "../compost-rules/readiness-evaluator";

const BATCHES_KEY = "cust_post_batches";
const OBSERVATIONS_KEY = "cust_post_observations";

// Fallback in-memory store for SSR and tests
const inMemoryBatches = new Map<string, CompostBatch>();
const inMemoryObservations = new Map<string, BatchObservation[]>();

function getLocalStorageBatches(): CompostBatch[] {
  if (typeof window === "undefined") {
    return Array.from(inMemoryBatches.values());
  }
  try {
    const raw = localStorage.getItem(BATCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return Array.from(inMemoryBatches.values());
  }
}

function saveLocalStorageBatches(batches: CompostBatch[]): void {
  if (typeof window === "undefined") {
    batches.forEach((b) => inMemoryBatches.set(b.id, b));
    return;
  }
  try {
    localStorage.setItem(BATCHES_KEY, JSON.stringify(batches));
  } catch {
    batches.forEach((b) => inMemoryBatches.set(b.id, b));
  }
}

function getLocalStorageObservations(batchId: string): BatchObservation[] {
  if (typeof window === "undefined") {
    return inMemoryObservations.get(batchId) || [];
  }
  try {
    const raw = localStorage.getItem(`${OBSERVATIONS_KEY}_${batchId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return inMemoryObservations.get(batchId) || [];
  }
}

function saveLocalStorageObservations(batchId: string, obs: BatchObservation[]): void {
  if (typeof window === "undefined") {
    inMemoryObservations.set(batchId, obs);
    return;
  }
  try {
    localStorage.setItem(`${OBSERVATIONS_KEY}_${batchId}`, JSON.stringify(obs));
  } catch {
    inMemoryObservations.set(batchId, obs);
  }
}

export class BatchStorageService {
  async createBatch(input: CreateBatchInput, ownerId?: string): Promise<CompostBatch> {
    const id = crypto.randomUUID();
    const nowIso = new Date().toISOString();
    const startDateObj = new Date(input.startDate);

    // Calculate initial estimated readiness window
    const estimate = estimateReadinessWindow(startDateObj, input.method, 0);

    const newBatch: CompostBatch = {
      id,
      ownerId,
      containerId: input.containerId,
      batchName: input.batchName,
      method: input.method,
      startDate: input.startDate,
      status: "active",
      totalMeasuredInputKg: 0,
      totalEstimatedInputKg: 0,
      readinessWindowStart: estimate.earliestDate.split("T")[0],
      readinessWindowEnd: estimate.latestDate.split("T")[0],
      notes: input.notes,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const batches = getLocalStorageBatches();
    batches.unshift(newBatch);
    saveLocalStorageBatches(batches);

    return newBatch;
  }

  async getBatchById(id: string): Promise<CompostBatch | null> {
    const batches = getLocalStorageBatches();
    return batches.find((b) => b.id === id) || null;
  }

  async listBatches(ownerId?: string): Promise<CompostBatch[]> {
    const batches = getLocalStorageBatches();
    if (ownerId) {
      return batches.filter((b) => b.ownerId === ownerId);
    }
    return batches;
  }

  async updateBatch(id: string, updates: Partial<CompostBatch>): Promise<CompostBatch> {
    const batches = getLocalStorageBatches();
    const idx = batches.findIndex((b) => b.id === id);
    if (idx === -1) {
      throw new Error(`Batch with id ${id} not found`);
    }

    const updatedBatch: CompostBatch = {
      ...batches[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    batches[idx] = updatedBatch;
    saveLocalStorageBatches(batches);

    return updatedBatch;
  }

  async addObservation(
    observationInput: Omit<BatchObservation, "id" | "createdAt">
  ): Promise<BatchObservation> {
    const id = crypto.randomUUID();
    const newObs: BatchObservation = {
      ...observationInput,
      id,
      createdAt: new Date().toISOString(),
    };

    const observations = getLocalStorageObservations(observationInput.batchId);
    // Sort reverse chronological
    observations.unshift(newObs);
    saveLocalStorageObservations(observationInput.batchId, observations);

    // Update batch metrics if waste was added
    if (observationInput.wasteAddedKg && observationInput.wasteAddedKg > 0) {
      const batch = await this.getBatchById(observationInput.batchId);
      if (batch) {
        if (observationInput.wasteDataStatus === "measured") {
          await this.updateBatch(batch.id, {
            totalMeasuredInputKg: Number((batch.totalMeasuredInputKg + observationInput.wasteAddedKg).toFixed(2)),
          });
        } else {
          await this.updateBatch(batch.id, {
            totalEstimatedInputKg: Number((batch.totalEstimatedInputKg + observationInput.wasteAddedKg).toFixed(2)),
          });
        }
      }
    }

    return newObs;
  }

  async getObservations(batchId: string): Promise<BatchObservation[]> {
    return getLocalStorageObservations(batchId);
  }

  // Clear memory stores (useful for tests)
  clearMemory(): void {
    inMemoryBatches.clear();
    inMemoryObservations.clear();
  }
}

export const batchStorageService = new BatchStorageService();
