import { describe, it, expect } from "vitest";
import {
  evaluateStartingMixture,
  MATERIAL_DENSITIES,
} from "@/lib/compost-rules/mixture-evaluator";
import { WasteInputItem } from "@/types/domain";

describe("Mixture Evaluator: Consistent Units, Quantities, and Ratios", () => {
  it("calculates both weight (kg) and volume (litres) using material bulk densities", () => {
    const materials: WasteInputItem[] = [
      { category: "greens", name: "vegetable_peels", quantityWeekly: 2.5, unit: "kg" },
      { category: "browns", name: "dry_leaves", quantityWeekly: 1.5, unit: "kg" },
    ];

    const result = evaluateStartingMixture(materials);
    expect(result.greensTotalKg).toBe(2.5);
    expect(result.brownsTotalKg).toBe(1.5);
    // 2.5 kg peels @ ~0.8 kg/L = ~3.1 L
    expect(result.greensTotalLitres).toBeGreaterThan(3);
    // 1.5 kg dry leaves @ ~0.12 kg/L = ~12.5 L
    expect(result.brownsTotalLitres).toBeGreaterThan(10);
    // Volume ratio of browns to greens should be ~4:1
    expect(result.volumeRatioBrownsToGreens).toBeGreaterThan(3);
  });

  it("handles materials input in litres and correctly computes weight and volume", () => {
    const materials: WasteInputItem[] = [
      { category: "greens", name: "vegetable_peels", quantityWeekly: 3, unit: "litres" },
      { category: "browns", name: "dry_leaves", quantityWeekly: 7.5, unit: "litres" },
    ];

    const result = evaluateStartingMixture(materials);
    expect(result.greensTotalLitres).toBe(3);
    expect(result.brownsTotalLitres).toBe(7.5);
    // 7.5 L / 3 L = 2.5:1 volume ratio
    expect(result.volumeRatioBrownsToGreens).toBeCloseTo(2.5, 1);
    expect(result.status).toBe("balanced");
    expect(result.advice).toMatch(/volume ratio/i);
  });

  it("flags excess greens when volume ratio of browns to greens is below 1.0", () => {
    const materials: WasteInputItem[] = [
      { category: "greens", name: "vegetable_peels", quantityWeekly: 6, unit: "kg" },
      { category: "browns", name: "dry_leaves", quantityWeekly: 0.2, unit: "kg" },
    ];

    const result = evaluateStartingMixture(materials);
    expect(result.status).toBe("excess_greens");
    // Advice should mention volume ratio and recommend specific volume of browns
    expect(result.advice).toMatch(/volume ratio/i);
    expect(result.advice).toMatch(/add dry browns/i);
  });

  it("flags excess browns when volume ratio is excessive (>6.0)", () => {
    const materials: WasteInputItem[] = [
      { category: "greens", name: "vegetable_peels", quantityWeekly: 0.5, unit: "kg" },
      { category: "browns", name: "dry_leaves", quantityWeekly: 4, unit: "kg" },
    ];

    const result = evaluateStartingMixture(materials);
    expect(result.status).toBe("excess_browns");
    expect(result.advice).toMatch(/excess carbon/i);
    expect(result.advice).toMatch(/volume ratio/i);
  });

  it("flags excluded materials while computing active balance", () => {
    const materials: WasteInputItem[] = [
      { category: "greens", name: "vegetable_peels", quantityWeekly: 2, unit: "kg" },
      { category: "excluded", name: "meat_dairy", quantityWeekly: 0.5, unit: "kg" },
    ];

    const result = evaluateStartingMixture(materials);
    expect(result.excludedItemsFound).toContain("meat_dairy");
  });
});
