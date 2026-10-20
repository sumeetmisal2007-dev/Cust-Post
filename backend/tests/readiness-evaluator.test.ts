import { describe, it, expect } from "vitest";
import {
  estimateReadinessWindow,
  evaluateMaturityChecklist,
} from "../src/compost-rules/readiness-evaluator";
import { PhysicalMaturityChecks } from "../src/types/domain";

describe("Readiness Window & Physical Maturity Checklist Engine (Task 09)", () => {
  describe("estimateReadinessWindow", () => {
    it("returns a bounded window rather than a single fixed date", () => {
      const startDate = new Date("2026-10-01T00:00:00Z");
      const estimate = estimateReadinessWindow(startDate, "aerobic_bin", 15);

      expect(estimate.minWeeks).toBeGreaterThanOrEqual(8);
      expect(estimate.maxWeeks).toBeGreaterThanOrEqual(12);
      expect(estimate.earliestDate).toBeDefined();
      expect(estimate.latestDate).toBeDefined();
      expect(estimate.isConfirmedReady).toBe(false);
      expect(estimate.disclaimer).toMatch(/cautious estimate window/i);
    });

    it("adjusts window for vermicomposting vs bokashi", () => {
      const startDate = new Date("2026-10-01T00:00:00Z");
      const bokashi = estimateReadinessWindow(startDate, "bokashi", 10);
      // Bokashi is 2 weeks fermentation + 4 weeks soil curing = 6 weeks min
      expect(bokashi.minWeeks).toBe(6);
    });
  });

  describe("evaluateMaturityChecklist", () => {
    it("verifies readiness when all 4 physical tests pass", () => {
      const passingChecks: PhysicalMaturityChecks = {
        darkCrumblyTexture: true,
        earthyOdorNoRot: true,
        ambientTemperature: true,
        foodScrapsDecomposed: true,
      };

      const verdict = evaluateMaturityChecklist(passingChecks);
      expect(verdict.isReady).toBe(true);
      expect(verdict.failedChecks.length).toBe(0);
      expect(verdict.safeApplicationGuidance).toMatch(/mix 20–30%/i);
    });

    it("blocks completion if any physical check fails (e.g. still hot or rotting smell)", () => {
      const immatureChecks: PhysicalMaturityChecks = {
        darkCrumblyTexture: true,
        earthyOdorNoRot: false, // still smells sour
        ambientTemperature: false, // still generating heat
        foodScrapsDecomposed: true,
      };

      const verdict = evaluateMaturityChecklist(immatureChecks);
      expect(verdict.isReady).toBe(false);
      expect(verdict.failedChecks.length).toBe(2);
      expect(verdict.warnings.some((w) => w.toLowerCase().includes("immature"))).toBe(true);
    });

    it("warns explicitly against using unfinished compost on edible vegetables", () => {
      const failingCheck: PhysicalMaturityChecks = {
        darkCrumblyTexture: false,
        earthyOdorNoRot: true,
        ambientTemperature: true,
        foodScrapsDecomposed: true,
      };

      const verdict = evaluateMaturityChecklist(failingCheck);
      expect(verdict.isReady).toBe(false);
      expect(verdict.warnings.some((w) => w.toLowerCase().includes("edible"))).toBe(true);
    });
  });
});
