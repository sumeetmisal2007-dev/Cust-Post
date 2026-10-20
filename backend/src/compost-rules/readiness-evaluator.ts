import { CompostingMethod, PhysicalMaturityChecks } from "../types/domain";

export interface ReadinessEstimate {
  minWeeks: number;
  maxWeeks: number;
  earliestDate: string;
  latestDate: string;
  curingAdvice: string;
  isConfirmedReady: boolean;
  disclaimer: string;
}

export interface MaturityVerdict {
  isReady: boolean;
  failedChecks: string[];
  safeApplicationGuidance: string;
  warnings: string[];
}

export function estimateReadinessWindow(
  startDate: Date,
  method: CompostingMethod,
  totalInputsKg: number
): ReadinessEstimate {
  let minWeeks = 8;
  let maxWeeks = 12;

  if (method === "vermicomposting") {
    minWeeks = 10;
    maxWeeks = 14;
  } else if (method === "bokashi") {
    minWeeks = 6;
    maxWeeks = 8;
  } else {
    // Aerobic bin
    if (totalInputsKg > 30) {
      minWeeks = 10;
      maxWeeks = 16;
    }
  }

  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const earliestDate = new Date(startDate.getTime() + minWeeks * msPerWeek).toISOString();
  const latestDate = new Date(startDate.getTime() + maxWeeks * msPerWeek).toISOString();

  const curingAdvice =
    method === "bokashi"
      ? "Bokashi pre-compost requires 2 weeks sealed container fermentation followed by 4 weeks curing buried in soil."
      : "Once the bin is full, stop adding fresh scraps and allow a 2–3 week undisturbed curing period for beneficial fungal humus formation.";

  return {
    minWeeks,
    maxWeeks,
    earliestDate,
    latestDate,
    curingAdvice,
    isConfirmedReady: false,
    disclaimer:
      "Cautious estimate window based on method and scrap inputs. Physical maturity checks must confirm readiness before application.",
  };
}

export function evaluateMaturityChecklist(
  checks: PhysicalMaturityChecks
): MaturityVerdict {
  const failedChecks: string[] = [];

  if (!checks.darkCrumblyTexture) {
    failedChecks.push("Texture is not yet dark, spongy, and crumbly like rich woodland soil.");
  }

  if (!checks.earthyOdorNoRot) {
    failedChecks.push("Compost retains a sour, acidic, or rotten ammonia odor.");
  }

  if (!checks.ambientTemperature) {
    failedChecks.push("Pile continues to generate internal heat; thermophilic bacteria are still active.");
  }

  if (!checks.foodScrapsDecomposed) {
    failedChecks.push("Original food scrap pieces remain recognizable (excluding tough avocado pits or twigs).");
  }

  const isReady = failedChecks.length === 0;

  if (isReady) {
    return {
      isReady: true,
      failedChecks: [],
      safeApplicationGuidance:
        "Mix 20–30% mature compost with 70–80% native soil or coco peat. Never pot plants in 100% pure compost.",
      warnings: [],
    };
  }

  return {
    isReady: false,
    failedChecks,
    safeApplicationGuidance: "Do not apply until curing is fully completed.",
    warnings: [
      "Compost is immature. Applying unfinished compost will rob nitrogen from plant roots and release phytotoxic volatile acids.",
      "Do not apply unfinished compost to edible plants or salad greens.",
      "Continue turning and curing for 2 additional weeks before re-running this physical maturity checklist.",
    ],
  };
}
