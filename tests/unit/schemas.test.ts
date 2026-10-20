import { describe, it, expect } from "vitest";
import {
  spaceProfileSchema,
  containerCheckSchema,
} from "@/lib/validation/space-container.schema";
import {
  wasteInputItemSchema,
  wasteInventorySchema,
} from "@/lib/validation/waste-materials.schema";
import {
  batchObservationSchema,
  physicalMaturityChecklistSchema,
} from "@/lib/validation/batch-observation.schema";

describe("Domain Validation Schemas (Task 04)", () => {
  describe("Space Profile Schema", () => {
    it("accepts valid space dimensions and location types", () => {
      const valid = {
        locationType: "balcony",
        lengthCm: 120,
        widthCm: 80,
        maxHeightCm: 150,
      };
      const result = spaceProfileSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects non-positive and zero space dimensions", () => {
      const invalid = {
        locationType: "indoor",
        lengthCm: 0,
        widthCm: -10,
        maxHeightCm: 100,
      };
      const result = spaceProfileSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThanOrEqual(2);
      }
    });

    it("rejects unsupported location types", () => {
      const invalid = {
        locationType: "rooftop_helipad",
        lengthCm: 100,
        widthCm: 100,
        maxHeightCm: 100,
      };
      const result = spaceProfileSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("ContainerCheck Schema", () => {
    it("accepts full container inputs including unknown previous use", () => {
      const valid = {
        shape: "rectangular",
        internalLengthCm: 45,
        internalWidthCm: 35,
        internalHeightCm: 40,
        material: "plastic_bucket",
        previousUse: "unknown",
        condition: "good",
        hasLid: true,
        hasVentilationHoles: false,
        hasDrainageHoles: false,
        isFoodGrade: "unknown",
      };
      const result = containerCheckSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects non-positive internal dimensions", () => {
      const invalid = {
        shape: "cylindrical",
        diameterCm: -5,
        internalHeightCm: 0,
        material: "terracotta",
        previousUse: "food",
        condition: "good",
        hasLid: true,
        hasVentilationHoles: true,
        hasDrainageHoles: true,
      };
      const result = containerCheckSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("requires footprint length and width for irregular shape containers", () => {
      const irregularWithoutFootprint = {
        shape: "irregular",
        internalHeightCm: 35,
        material: "plastic_bucket",
        previousUse: "food",
        condition: "good",
        hasLid: true,
        hasVentilationHoles: true,
        hasDrainageHoles: true,
      };
      const result = containerCheckSchema.safeParse(irregularWithoutFootprint);
      expect(result.success).toBe(false);

      const irregularWithFootprint = {
        ...irregularWithoutFootprint,
        internalLengthCm: 45,
        internalWidthCm: 35,
      };
      const validResult = containerCheckSchema.safeParse(irregularWithFootprint);
      expect(validResult.success).toBe(true);
    });

    it("accepts separate external dimensions for space fit checks", () => {
      const withExternal = {
        shape: "rectangular",
        internalLengthCm: 45,
        internalWidthCm: 35,
        internalHeightCm: 40,
        externalLengthCm: 50,
        externalWidthCm: 40,
        externalHeightCm: 45,
        material: "plastic_bucket",
        previousUse: "food",
        condition: "good",
        hasLid: true,
        hasVentilationHoles: true,
        hasDrainageHoles: true,
      };
      const result = containerCheckSchema.safeParse(withExternal);
      expect(result.success).toBe(true);
    });
  });

  describe("Waste Inputs Schema", () => {
    it("validates categorized waste inputs with positive quantities", () => {
      const item = {
        category: "greens",
        name: "vegetable_scraps",
        quantityWeekly: 2.5,
        unit: "kg",
      };
      expect(wasteInputItemSchema.safeParse(item).success).toBe(true);
    });

    it("flags excluded materials appropriately in waste inventory", () => {
      const inventory = {
        items: [
          {
            category: "excluded",
            name: "meat_and_bones",
            quantityWeekly: 1,
            unit: "kg",
          },
        ],
      };
      const parsed = wasteInventorySchema.safeParse(inventory);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.items[0].category).toBe("excluded");
      }
    });

    it("rejects zero or negative quantities", () => {
      const item = {
        category: "browns",
        name: "dry_leaves",
        quantityWeekly: 0,
        unit: "kg",
      };
      expect(wasteInputItemSchema.safeParse(item).success).toBe(false);
    });
  });

  describe("Batch Observation & Maturity Checklist Schemas", () => {
    it("validates observation logs with optional temperature and mandatory status tags", () => {
      const validLog = {
        batchId: "batch-123",
        timestamp: new Date().toISOString(),
        moisture: "ideal",
        odour: "earthy",
        temperatureC: 45.5,
        temperatureStatus: "measured",
        turnedToday: true,
        pestsObserved: "none",
        notes: "Compost warm and damp",
      };
      expect(batchObservationSchema.safeParse(validLog).success).toBe(true);
    });

    it("accepts observation logs without temperature when unmeasured", () => {
      const validLogWithoutTemp = {
        batchId: "batch-123",
        timestamp: new Date().toISOString(),
        moisture: "too_wet",
        odour: "sour",
        temperatureC: null,
        temperatureStatus: "unknown",
        turnedToday: false,
        pestsObserved: "fruit_flies",
      };
      expect(batchObservationSchema.safeParse(validLogWithoutTemp).success).toBe(true);
    });

    it("validates physical maturity checklist requiring 4 boolean confirmations", () => {
      const checklist = {
        darkCrumblyTexture: true,
        earthyOdorNoRot: true,
        ambientTemperature: true,
        foodScrapsDecomposed: true,
      };
      expect(physicalMaturityChecklistSchema.safeParse(checklist).success).toBe(true);
    });
  });
});
