import {
  CompostingMethod,
  LocationType,
  MaintenanceCapacity,
  RecommendationVerdict,
  SmellSensitivity,
  WasteInputItem,
} from "../types/domain";

export interface MethodRecommendationInputs {
  locationType: LocationType;
  containerVolumeLitres: number;
  containerVerdict: RecommendationVerdict;
  materials: WasteInputItem[];
  maintenanceCapacity: MaintenanceCapacity;
  smellSensitivity: SmellSensitivity;
  interestedInWorms?: boolean;
}

export interface MethodPlanResult {
  chosenMethod: CompostingMethod;
  methodName: string;
  rationale: string[];
  limitations: string[];
  startingSequence: string[];
  excludedItems: string[];
  maintenanceSteps: string[];
  ruleVersion: string;
  sourceId: string;
}

export function recommendCompostingMethod(
  inputs: MethodRecommendationInputs
): MethodPlanResult {
  const hasCookedFood = inputs.materials.some(
    (m) => m.name.toLowerCase().includes("cooked") || m.category === "caution"
  );

  // Vermicomposting Rule: user wants worms or compact indoor/balcony setup with weekly maintenance
  if (
    inputs.interestedInWorms &&
    (inputs.locationType === "balcony" || inputs.locationType === "indoor") &&
    inputs.containerVolumeLitres >= 20
  ) {
    return {
      chosenMethod: "vermicomposting",
      methodName: "Vermicomposting (Red Wriggler Composting)",
      rationale: [
        "Worms accelerate organic breakdown in compact, shaded balcony or indoor spaces.",
        "Produces pathogen-free, high-grade vermicastings with near-zero foul odors when maintained properly.",
      ],
      limitations: [
        "Sensitive to temperature extremes (>35°C or direct sunlight will kill earthworms).",
        "Cannot accept citrus, pungent alliums (onions/garlic), spicy food, or oily residues.",
      ],
      startingSequence: [
        "Create moist bedding base: 10–15 cm of damp shredded corrugated cardboard or coco peat.",
        "Introduce Red Wrigglers (Eisenia fetida) and allow them 24 hours to burrow.",
        "Pocket feed: deposit finely chopped raw kitchen scraps into one quadrant and cover with 5 cm bedding.",
        "Rotate feeding quadrants each week to keep conditions fresh and avoid sour pockets.",
      ],
      excludedItems: [
        "Citrus peels and lemon rinds",
        "Onions, garlic, and hot chili peppers",
        "Meat, bones, dairy, and oily cooked food",
        "Dog or cat feces",
      ],
      maintenanceSteps: [
        "Check moisture weekly (should feel like a wrung-out sponge).",
        "Avoid turning vigorously to prevent harming worms; lightly fluff surface bedding.",
        "Harvest vermicompost from bottom after 10–12 weeks.",
      ],
      ruleVersion: "1.0",
      sourceId: "RULE-METHOD-VERMI",
    };
  }

  // Bokashi Fermentation Rule: indoor location, high smell sensitivity, or cooked scrap inclusion
  if (
    inputs.locationType === "indoor" ||
    (hasCookedFood && inputs.smellSensitivity === "high") ||
    inputs.containerVolumeLitres < 30
  ) {
    return {
      chosenMethod: "bokashi",
      methodName: "Bokashi Anaerobic Fermentation",
      rationale: [
        "Airtight fermentation prevents fruit fly attraction and foul decomposition odors indoors.",
        "Efficient for apartment kitchens and small floor plans.",
        "Tolerates moderate cooked food scraps and small dairy scraps with effective bran inoculation.",
      ],
      limitations: [
        "Anaerobic fermentation produces an acidic pickled pre-compost; requires secondary soil burying or curing before use on plants.",
        "Requires ongoing supply of active Bokashi bran (EM-1 inoculant).",
      ],
      startingSequence: [
        "Place perforated drainage plate at bottom of airtight bucket.",
        "Add fresh kitchen scraps compacted firmly to eliminate air pockets.",
        "Sprinkle 1–2 tablespoons of Bokashi bran evenly across each layer of scraps.",
        "Seal lid airtight after every addition.",
      ],
      excludedItems: [
        "Rotten or moldy scraps",
        "Large bones or hard shells",
        "Excess fluids or soup liquids (drain before adding)",
      ],
      maintenanceSteps: [
        "Drain Bokashi leachate liquid every 3–4 days via bottom spigot.",
        "When full, keep bucket sealed for 14 days to complete anaerobic fermentation.",
        "Bury fermented solids in a garden trench or curing bin with regular potting soil for 4 weeks.",
      ],
      ruleVersion: "1.0",
      sourceId: "RULE-METHOD-BOKASHI",
    };
  }

  // Aerobic Small-Batch Bin Composting (Default for balcony, terrace, garden)
  return {
    chosenMethod: "aerobic_bin",
    methodName: "Aerobic Small-Batch Bin Composting",
    rationale: [
      "Standard decomposition powered by aerobic bacteria and fungi suited for balconies and terraces.",
      "Cost-effective and requires no specialized starter organisms beyond garden soil/coco peat.",
      "Handles daily fruit, vegetable, and tea/coffee scrap outputs effectively.",
    ],
    limitations: [
      "Requires periodic manual turning to maintain oxygen levels.",
      "Sensitive to excess moisture; requires dedicated brown carbon additions.",
    ],
    startingSequence: [
      "Base layer: Place 5–7 cm of coarse browns (dry leaves, shredded cardboard, small twigs) at the bottom for drainage.",
      "Add fresh greens in small increments (max 1–2 kg per layer).",
      "Always cover fresh food additions with a generous dry brown cap (1:1 or 2:1 volume) to block fruit flies.",
      "Lightly sprinkle water only if dry leaves appear brittle or bone-dry.",
    ],
    excludedItems: [
      "Meat, chicken, fish, and whole bones",
      "Excess cooking oil or greasy gravies",
      "Diseased garden plants or weed roots",
      "Synthetic plastics or glossy magazines",
    ],
    maintenanceSteps: [
      "Turn or stir the top 15–20 cm twice weekly using a small garden trowel to inject oxygen.",
      "Perform the 'sponge squeeze test' weekly; if water drips freely, add more shredded dry paper immediately.",
      "Allow 8–12 weeks for curing once the container reaches full volume.",
    ],
    ruleVersion: "1.0",
    sourceId: "RULE-METHOD-AEROBIC",
  };
}
