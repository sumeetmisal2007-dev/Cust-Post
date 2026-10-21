import { describe, it, expect } from "vitest";
import {
  evaluateStartingMixture,
  MATERIAL_DENSITIES,
} from "../src/compost-rules/mixture-evaluator";
import { WasteInputItem } from "../src/types/domain";

describe("Mixture Evaluator: Consistent Units, Quantities, and Ratios", () => {
  it("calculates both weight (kg) and volume (litres) using material bulk densities", () => {
    const materials: WasteInputItem[] = [
      { category: "greens", name: "vegetable_peels", quantityWeekly: 2.5, unit: "kg" },
      { category: "browns", name: "dry_leaves", quantityWeekly: 1.5, unit: "kg" },
    ];

    const result = evaluateStartingMixture(materials);
    expect(result.greensTotalKg).toBe(2.5);
    expect(result.brownsTotalKg).toBe(1.5);

    expect(result.greensTotalLitres).toBeGreaterThan(3);

    expect(result.brownsTotalLitres).toBeGreaterThan(10);

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

  it("handles empty materials list without falsely triggering excess_greens", () => {
    const result = evaluateStartingMixture([]);
    expect(result.status).toBe("balanced");
    expect(result.greensTotalKg).toBe(0);
    expect(result.brownsTotalKg).toBe(0);
    expect(result.volumeRatioBrownsToGreens).toBe(0);
    expect(result.advice).toMatch(/No compostable materials entered yet/i);
  });

  it("handles zero quantity items without falsely triggering excess_greens", () => {
    const materials: WasteInputItem[] = [
      { category: "greens", name: "vegetable_peels", quantityWeekly: 0, unit: "kg" },
      { category: "browns", name: "dry_leaves", quantityWeekly: 0, unit: "kg" },
    ];
    const result = evaluateStartingMixture(materials);
    expect(result.status).toBe("balanced");
    expect(result.greensTotalKg).toBe(0);
    expect(result.brownsTotalKg).toBe(0);
    expect(result.advice).toMatch(/No compostable materials entered yet/i);
  });

  it("describes balanced ratio as 'within recommended working range' rather than 'optimal'", () => {
    const materials: WasteInputItem[] = [
      { category: "greens", name: "vegetable_peels", quantityWeekly: 3, unit: "litres" },
      { category: "browns", name: "dry_leaves", quantityWeekly: 7.5, unit: "litres" },
    ];
    const result = evaluateStartingMixture(materials);
    expect(result.status).toBe("balanced");
    expect(result.advice).toMatch(/within recommended working range/i);
    expect(result.advice).not.toMatch(/\boptimal\b/i);
  });
});
