import {
  ContainerCheckInputs,
  RecommendationVerdict,
  RuleSource,
} from "../types/domain";

export interface ContainerEvaluationResult {
  verdict: RecommendationVerdict;
  reasons: string[];
  requiredModifications: string[];
  unresolvedChecks: string[];
  ruleId: string;
  ruleVersion: string;
  sourceReference: RuleSource;
}

const DEFAULT_SOURCE: RuleSource = {
  ruleId: "RULE-CONT-SUITABLE",
  version: "1.0",
  title: "Container Safety and Aeration Guidelines",
  organization: "US EPA / MCGM Citizen's Handbook",
  sourceUrl: "https://www.epa.gov/recycle/composting-home",
  reviewer: "Composting Advisory Panel",
  reviewDate: "2026-10-18",
};

export function evaluateContainer(inputs: ContainerCheckInputs): ContainerEvaluationResult {
  // Guardrail 1: Hazardous previous use is strictly Unsuitable
  if (inputs.previousUse === "paint_chemicals") {
    return {
      verdict: "unsuitable",
      reasons: [
        "Containers previously used for paint, industrial chemicals, automotive fluids, or pesticides cannot be cleared for composting.",
        "Chemical residues can leach persistent toxins into finished compost, making it unsafe for gardens and edible plants.",
      ],
      requiredModifications: [],
      unresolvedChecks: [],
      ruleId: "RULE-CONT-HAZARDOUS",
      ruleVersion: "1.0",
      sourceReference: {
        ...DEFAULT_SOURCE,
        ruleId: "RULE-CONT-HAZARDOUS",
        title: "Prohibition of Chemical and Hazardous Residue Containers",
      },
    };
  }

  // Guardrail 2: Severely damaged or contaminated condition
  if (inputs.condition === "cracked_damaged" || inputs.condition === "uncleanable_residue") {
    return {
      verdict: "unsuitable",
      reasons: [
        inputs.condition === "cracked_damaged"
          ? "Container has cracks or structural damage that will leak leachate, destabilize the batch, or permit pest intrusion."
          : "Container has stubborn or uncleanable residue that poses contamination risks.",
      ],
      requiredModifications: [],
      unresolvedChecks: [],
      ruleId: "RULE-CONT-CONDITION",
      ruleVersion: "1.0",
      sourceReference: DEFAULT_SOURCE,
    };
  }

  // Guardrail 3: Explicitly non-food-grade containers are strictly Unsuitable
  if (inputs.isFoodGrade === "non_food_grade") {
    return {
      verdict: "unsuitable",
      reasons: [
        inputs.material === "plastic_bucket" || inputs.material === "other"
          ? "Non-food-grade plastic containers can leach plasticizers (phthalates, BPA), chemical stabilizers, or heavy metal pigments into the decomposing mass."
          : `Non-food-grade ${inputs.material.replace("_", " ")} containers pose chemical leaching and contamination risks for biological compost.`,
        "Compost produced in non-food-grade containers is unsafe for application on edible herbs, vegetables, or garden soil.",
      ],
      requiredModifications: [],
      unresolvedChecks: [],
      ruleId: "RULE-CONT-NON-FOOD-GRADE",
      ruleVersion: "1.0",
      sourceReference: {
        ...DEFAULT_SOURCE,
        ruleId: "RULE-CONT-NON-FOOD-GRADE",
        title: "Prohibition of Non-Food-Grade Vessels in Biological Recovery",
      },
    };
  }

  // Guardrail 4: Unknown previous use must NEVER default to safe
  if (inputs.previousUse === "unknown") {
    return {
      verdict: "more_info_needed",
      reasons: [
        "The previous contents and usage history of this vessel are unknown.",
        "Compost safety cannot be verified without confirming the vessel was not used for toxic compounds.",
      ],
      requiredModifications: [],
      unresolvedChecks: [
        "Check with previous owner or label markings for previous contents.",
        "Verify if plastic has food-grade resin stamps (HDPE #2 or PP #5).",
        "If prior contents cannot be confirmed, select a fresh food-grade bucket or terracotta pot instead.",
      ],
      ruleId: "RULE-CONT-UNKNOWN-HISTORY",
      ruleVersion: "1.0",
      sourceReference: {
        ...DEFAULT_SOURCE,
        ruleId: "RULE-CONT-UNKNOWN-HISTORY",
        title: "Precautionary Principle for Unknown Vessel Provenance",
      },
    };
  }

  // Guardrail 5: Unverified / unknown food-grade status for plastic / synthetic containers
  if (
    inputs.isFoodGrade === "unknown" &&
    (inputs.material === "plastic_bucket" || inputs.material === "other")
  ) {
    return {
      verdict: "more_info_needed",
      reasons: [
        "The food-grade certification of this plastic container is unverified.",
        "Under the precautionary principle, unverified plastics cannot be cleared because non-food-grade polymers risk leaching chemical additives during microbial decomposition.",
      ],
      requiredModifications: [],
      unresolvedChecks: [
        "Inspect the underside of the vessel for resin identification stamps (HDPE #2 or PP #5).",
        "Check for a food-safe fork-and-cup symbol or manufacturer certification confirming food-contact safety.",
        "If food-grade provenance cannot be verified, substitute with a certified food-grade bucket, terracotta pot, or wooden crate.",
      ],
      ruleId: "RULE-CONT-UNKNOWN-FOOD-GRADE",
      ruleVersion: "1.0",
      sourceReference: {
        ...DEFAULT_SOURCE,
        ruleId: "RULE-CONT-UNKNOWN-FOOD-GRADE",
        title: "Precautionary Principle for Unverified Plastic Food-Grade Status",
      },
    };
  }

  // Check required physical modifications (Ventilation, Drainage, Lid)
  const modifications: string[] = [];
  if (!inputs.hasDrainageHoles && inputs.material !== "wooden_crate") {
    modifications.push(
      "Drill 6–8 drainage holes (6–8mm diameter) in the bottom base to allow excess leachate to drain and prevent foul anaerobic pooling."
    );
  }

  if (!inputs.hasVentilationHoles && inputs.material !== "mesh_wire") {
    modifications.push(
      "Drill 8–12 aeration holes (4–6mm diameter) around the top perimeter and sides to ensure aerobic microbial oxygenation."
    );
  }

  if (!inputs.hasLid && inputs.material !== "terracotta") {
    modifications.push(
      "Provide a loose-fitting lid, breathable burlap sack, or insect-proof mesh cover to guard against monsoon rain and fruit flies."
    );
  }

  if (modifications.length > 0) {
    return {
      verdict: "suitable_with_changes",
      reasons: [
        "The container material and size are viable, but essential airflow or drainage features are missing.",
        "Aerobic bacteria require both oxygen diffusion and moisture drainage to avoid rotting odors.",
      ],
      requiredModifications: modifications,
      unresolvedChecks: [],
      ruleId: "RULE-CONT-MOD-NEEDED",
      ruleVersion: "1.0",
      sourceReference: DEFAULT_SOURCE,
    };
  }

  // Fully suitable container
  return {
    verdict: "suitable",
    reasons: [
      `Container material (${inputs.material.replace("_", " ")}) is well-suited for small-scale household composting.`,
      inputs.material === "plastic_bucket"
        ? "Confirmed food-grade plastic material (safe, non-leaching resin)."
        : "Non-toxic material safe for soil biology.",
      "Adequate ventilation, drainage, and structural integrity confirmed.",
      "No hazardous chemical exposure history detected.",
    ],
    requiredModifications: [],
    unresolvedChecks: [],
    ruleId: "RULE-CONT-SUITABLE",
    ruleVersion: "1.0",
    sourceReference: DEFAULT_SOURCE,
  };
}
