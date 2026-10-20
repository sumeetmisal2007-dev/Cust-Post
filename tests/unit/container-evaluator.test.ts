import { describe, it, expect } from "vitest";
import { evaluateContainer } from "@/lib/compost-rules/container-evaluator";
import { ContainerCheckInputs } from "@/types/domain";

describe("ContainerCheck Suitability Engine (Task 06)", () => {
  it("rejects containers previously used for hazardous chemicals/paint (Safety Guardrail 1)", () => {
    const hazardousContainer: ContainerCheckInputs = {
      shape: "rectangular",
      internalLengthCm: 40,
      internalWidthCm: 30,
      internalHeightCm: 40,
      material: "plastic_bucket",
      previousUse: "paint_chemicals",
      condition: "good",
      hasLid: true,
      hasVentilationHoles: true,
      hasDrainageHoles: true,
    };

    const evalResult = evaluateContainer(hazardousContainer);
    expect(evalResult.verdict).toBe("unsuitable");
    expect(evalResult.reasons.some((r) => r.toLowerCase().includes("chemical"))).toBe(true);
    expect(evalResult.ruleId).toBe("RULE-CONT-HAZARDOUS");
  });

  it("returns 'more_info_needed' when previous container use is unknown (Safety Guardrail 2)", () => {
    const unknownHistoryContainer: ContainerCheckInputs = {
      shape: "cylindrical",
      diameterCm: 40,
      internalHeightCm: 50,
      material: "plastic_bucket",
      previousUse: "unknown",
      condition: "good",
      hasLid: true,
      hasVentilationHoles: true,
      hasDrainageHoles: true,
    };

    const evalResult = evaluateContainer(unknownHistoryContainer);
    expect(evalResult.verdict).toBe("more_info_needed");
    expect(evalResult.unresolvedChecks.length).toBeGreaterThan(0);
    expect(
      evalResult.unresolvedChecks.some((c) => c.toLowerCase().includes("previous contents"))
    ).toBe(true);
    expect(evalResult.ruleId).toBe("RULE-CONT-UNKNOWN-HISTORY");
  });

  it("returns 'suitable_with_changes' when drainage or aeration holes are missing", () => {
    const unventilatedPlasticBin: ContainerCheckInputs = {
      shape: "rectangular",
      internalLengthCm: 50,
      internalWidthCm: 40,
      internalHeightCm: 40,
      material: "plastic_bucket",
      previousUse: "food",
      condition: "good",
      hasLid: true,
      hasVentilationHoles: false, // No air
      hasDrainageHoles: false, // No drainage
    };

    const evalResult = evaluateContainer(unventilatedPlasticBin);
    expect(evalResult.verdict).toBe("suitable_with_changes");
    expect(evalResult.requiredModifications.length).toBeGreaterThanOrEqual(2);
    expect(
      evalResult.requiredModifications.some((m) => m.toLowerCase().includes("drill"))
    ).toBe(true);
  });

  it("marks severely damaged or cracked containers as unsuitable", () => {
    const crackedBin: ContainerCheckInputs = {
      shape: "rectangular",
      internalLengthCm: 40,
      internalWidthCm: 40,
      internalHeightCm: 40,
      material: "plastic_bucket",
      previousUse: "food",
      condition: "cracked_damaged",
      hasLid: true,
      hasVentilationHoles: true,
      hasDrainageHoles: true,
    };

    const evalResult = evaluateContainer(crackedBin);
    expect(evalResult.verdict).toBe("unsuitable");
    expect(evalResult.reasons.some((r) => r.toLowerCase().includes("crack"))).toBe(true);
  });

  it("marks a clean, food-grade or garden terracotta pot with drainage as 'suitable'", () => {
    const cleanTerracotta: ContainerCheckInputs = {
      shape: "cylindrical",
      diameterCm: 35,
      internalHeightCm: 45,
      material: "terracotta",
      previousUse: "soil_garden",
      condition: "good",
      hasLid: true,
      hasVentilationHoles: true,
      hasDrainageHoles: true,
    };

    const evalResult = evaluateContainer(cleanTerracotta);
    expect(evalResult.verdict).toBe("suitable");
    expect(evalResult.requiredModifications.length).toBe(0);
    expect(evalResult.reasons.length).toBeGreaterThan(0);
    expect(evalResult.sourceReference.organization).toBeDefined();
  });

  it("marks non-food-grade plastic containers as 'unsuitable' (Food Grade Safety Check)", () => {
    const nonFoodGradePlastic: ContainerCheckInputs = {
      shape: "rectangular",
      internalLengthCm: 45,
      internalWidthCm: 35,
      internalHeightCm: 40,
      material: "plastic_bucket",
      previousUse: "food",
      condition: "good",
      hasLid: true,
      hasVentilationHoles: true,
      hasDrainageHoles: true,
      isFoodGrade: "non_food_grade",
    };

    const evalResult = evaluateContainer(nonFoodGradePlastic);
    expect(evalResult.verdict).toBe("unsuitable");
    expect(evalResult.ruleId).toBe("RULE-CONT-NON-FOOD-GRADE");
    expect(
      evalResult.reasons.some((r) => r.toLowerCase().includes("non-food-grade"))
    ).toBe(true);
  });

  it("returns 'more_info_needed' when plastic container food-grade status is unknown", () => {
    const unknownPlastic: ContainerCheckInputs = {
      shape: "cylindrical",
      diameterCm: 40,
      internalHeightCm: 45,
      material: "plastic_bucket",
      previousUse: "food",
      condition: "good",
      hasLid: true,
      hasVentilationHoles: true,
      hasDrainageHoles: true,
      isFoodGrade: "unknown",
    };

    const evalResult = evaluateContainer(unknownPlastic);
    expect(evalResult.verdict).toBe("more_info_needed");
    expect(evalResult.ruleId).toBe("RULE-CONT-UNKNOWN-FOOD-GRADE");
    expect(evalResult.unresolvedChecks.length).toBeGreaterThan(0);
    expect(
      evalResult.unresolvedChecks.some((c) => c.toLowerCase().includes("hdpe"))
    ).toBe(true);
  });

  it("clears a confirmed food-grade plastic container with proper aeration and drainage", () => {
    const verifiedFoodGradePlastic: ContainerCheckInputs = {
      shape: "rectangular",
      internalLengthCm: 50,
      internalWidthCm: 40,
      internalHeightCm: 45,
      material: "plastic_bucket",
      previousUse: "food",
      condition: "good",
      hasLid: true,
      hasVentilationHoles: true,
      hasDrainageHoles: true,
      isFoodGrade: "food_grade",
    };

    const evalResult = evaluateContainer(verifiedFoodGradePlastic);
    expect(evalResult.verdict).toBe("suitable");
    expect(evalResult.ruleId).toBe("RULE-CONT-SUITABLE");
    expect(
      evalResult.reasons.some((r) => r.toLowerCase().includes("food-grade"))
    ).toBe(true);
  });
});
