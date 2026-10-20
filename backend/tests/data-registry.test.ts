import { describe, it, expect } from "vitest";
import { SOURCES_REGISTRY } from "../src/data/sources-registry";
import { PLANT_GUIDES } from "../src/data/plant-guides";

describe("Rule Sources & Curated Plant Registry (Task 10)", () => {
  describe("SOURCES_REGISTRY", () => {
    it("contains citations for all core rule IDs implemented across Tasks 05–09", () => {
      const requiredRuleIds = [
        "RULE-CONT-HAZARDOUS",
        "RULE-CONT-UNKNOWN-HISTORY",
        "RULE-CONT-MOD-NEEDED",
        "RULE-CONT-SUITABLE",
        "RULE-METHOD-AEROBIC",
        "RULE-METHOD-VERMI",
        "RULE-METHOD-BOKASHI",
        "RULE-TROUBLE-ODOR",
        "RULE-TROUBLE-MOISTURE",
        "RULE-TROUBLE-PESTS",
        "RULE-TROUBLE-SLOW",
        "RULE-TROUBLE-RODENT",
      ];

      for (const ruleId of requiredRuleIds) {
        const source = SOURCES_REGISTRY[ruleId];
        expect(source, `Missing source registry entry for ${ruleId}`).toBeDefined();
        expect(source.organization).toBeTruthy();
        expect(source.sourceUrl).toBeTruthy();
      }
    });

    it("includes SDG 12 Target 12.5 alignment citation", () => {
      expect(SOURCES_REGISTRY["SDG-12-TARGET-12-5"]).toBeDefined();
      expect(SOURCES_REGISTRY["SDG-12-TARGET-12-5"].title).toMatch(/SDG 12/i);
    });
  });

  describe("PLANT_GUIDES", () => {
    it("contains 20 reviewed plants across herbs, vegetables, and fruits", () => {
      expect(PLANT_GUIDES.length).toBe(20);
      const slugs = PLANT_GUIDES.map((p) => p.slug);
      expect(slugs).toContain("tulsi");
      expect(slugs).toContain("mint");
      expect(slugs).toContain("cherry-tomato");
      expect(slugs).toContain("curry-leaves");
      expect(slugs).toContain("okra-bhindi");
      expect(slugs).toContain("brinjal-baingan");
    });

    it("restricts compost application to maximum 20–30% in all plant guides", () => {
      for (const plant of PLANT_GUIDES) {
        expect(plant.compostBlendRatioMaxPercent).toBeLessThanOrEqual(30);
        expect(plant.compostSafetyWarnings.length).toBeGreaterThan(0);
        expect(
          plant.compostSafetyWarnings.some((w) =>
            w.toLowerCase().includes("100%") || w.toLowerCase().includes("immature")
          )
        ).toBe(true);
      }
    });

    it("specifies container volume, sunlight, and watering requirements for each plant", () => {
      for (const plant of PLANT_GUIDES) {
        expect(plant.containerMinLitres).toBeGreaterThan(0);
        expect(plant.sunlightHoursMin).toBeGreaterThan(0);
        expect(plant.wateringGuidance).toBeTruthy();
      }
    });
  });
});
