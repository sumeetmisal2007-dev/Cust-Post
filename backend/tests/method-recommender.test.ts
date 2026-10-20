import { describe, it, expect } from "vitest";
import {
  recommendCompostingMethod,
  MethodRecommendationInputs,
} from "../src/compost-rules/method-recommender";
import {
  evaluateStartingMixture,
} from "../src/compost-rules/mixture-evaluator";
import { WasteInputItem } from "../src/types/domain";

describe("Method & Mixture Recommendation Engine (Task 07)", () => {
  describe("recommendCompostingMethod", () => {
    it("recommends Aerobic Bin composting for balcony with standard kitchen scraps and ventilated container", () => {
      const inputs: MethodRecommendationInputs = {
        locationType: "balcony",
        containerVolumeLitres: 45,
        containerVerdict: "suitable",
        materials: [
          { category: "greens", name: "vegetable_peels", quantityWeekly: 2, unit: "kg" },
          { category: "browns", name: "dry_leaves", quantityWeekly: 1, unit: "kg" },
        ],
        maintenanceCapacity: "weekly_turning",
        smellSensitivity: "medium",
      };

      const result = recommendCompostingMethod(inputs);
      expect(result.chosenMethod).toBe("aerobic_bin");
      expect(result.rationale.length).toBeGreaterThan(0);
      expect(result.startingSequence.length).toBeGreaterThan(0);
      expect(result.sourceId).toBe("RULE-METHOD-AEROBIC");
    });

    it("recommends Bokashi or indoor system for indoor setup with cooked scraps and high smell sensitivity", () => {
      const inputs: MethodRecommendationInputs = {
        locationType: "indoor",
        containerVolumeLitres: 20,
        containerVerdict: "suitable",
        materials: [
          { category: "caution", name: "cooked_food", quantityWeekly: 1, unit: "kg" },
          { category: "greens", name: "fruit_scraps", quantityWeekly: 1, unit: "kg" },
        ],
        maintenanceCapacity: "minimal_effort",
        smellSensitivity: "high",
      };

      const result = recommendCompostingMethod(inputs);
      expect(result.chosenMethod).toBe("bokashi");
      expect(result.limitations.some((l) => l.toLowerCase().includes("fermentation"))).toBe(true);
    });

    it("recommends Vermicomposting for shaded balcony/indoor with moderate scraps and regular care", () => {
      const inputs: MethodRecommendationInputs = {
        locationType: "balcony",
        containerVolumeLitres: 35,
        containerVerdict: "suitable",
        materials: [
          { category: "greens", name: "vegetable_peels", quantityWeekly: 1.5, unit: "kg" },
          { category: "browns", name: "cardboard", quantityWeekly: 1, unit: "kg" },
        ],
        maintenanceCapacity: "weekly_turning",
        smellSensitivity: "high",
        interestedInWorms: true,
      };

      const result = recommendCompostingMethod(inputs);
      expect(result.chosenMethod).toBe("vermicomposting");
      expect(result.startingSequence.some((s) => s.toLowerCase().includes("bedding"))).toBe(true);
    });
  });

  describe("evaluateStartingMixture", () => {
    it("identifies a balanced brown-to-green ratio", () => {
      const materials: WasteInputItem[] = [
        { category: "greens", name: "fruit_veg_scraps", quantityWeekly: 2, unit: "kg" },
        { category: "browns", name: "dry_leaves", quantityWeekly: 2, unit: "kg" },
      ];

      const balance = evaluateStartingMixture(materials);
      expect(balance.status).toBe("balanced");
      expect(balance.excludedItemsFound.length).toBe(0);
    });

    it("flags excess greens when brown volume is insufficient", () => {
      const materials: WasteInputItem[] = [
        { category: "greens", name: "fruit_veg_scraps", quantityWeekly: 5, unit: "kg" },
        { category: "browns", name: "cardboard", quantityWeekly: 0.5, unit: "kg" },
      ];

      const balance = evaluateStartingMixture(materials);
      expect(balance.status).toBe("excess_greens");
      expect(balance.advice).toMatch(/add dry browns/i);
    });

    it("detects and flags excluded toxic or pest-attracting items", () => {
      const materials: WasteInputItem[] = [
        { category: "greens", name: "vegetable_scraps", quantityWeekly: 2, unit: "kg" },
        { category: "excluded", name: "meat_and_dairy", quantityWeekly: 0.5, unit: "kg" },
        { category: "excluded", name: "plastic_packaging", quantityWeekly: 0.1, unit: "kg" },
      ];

      const balance = evaluateStartingMixture(materials);
      expect(balance.excludedItemsFound.length).toBe(2);
      expect(balance.excludedItemsFound).toContain("meat_and_dairy");
    });
  });
});
