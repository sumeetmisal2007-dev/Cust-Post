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
  reviewer: "Cust-Post Project Literature Review (Self-curated from official literature)",
  reviewDate: "2026-10-18",
};

export function evaluateContainer(inputs: ContainerCheckInputs): ContainerEvaluationResult {

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

  if (inputs.isFoodGrade === "non_food_grade") {
    let specificReason = `Non-food-grade ${inputs.material.replace("_", " ")} containers pose chemical leaching and contamination risks for biological compost.`;
    if (inputs.material === "plastic_bucket" || inputs.material === "other") {
      specificReason = "Non-food-grade plastic containers can leach plasticizers (phthalates, BPA), chemical stabilizers, or heavy metal pigments into the decomposing mass.";
    } else if (inputs.material === "metal_drum") {
      specificReason = "Non-food-grade metal drums often feature toxic anti-corrosion linings, industrial epoxy coats, or heavy metal residues that leach into compost.";
    } else if (inputs.material === "wooden_crate") {
      specificReason = "Non-food-grade or treated wood may contain chemical wood preservatives (such as copper chromium arsenate or creosote) that leach persistent toxins into soil biology.";
    } else if (inputs.material === "terracotta") {
      specificReason = "Glazed or decorative non-food-grade ceramics may contain lead or cadmium pigments that leach into soil under organic compost acidity.";
    }

    return {
      verdict: "unsuitable",
      reasons: [
        specificReason,
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

  if (
    inputs.isFoodGrade === "unknown" &&
    (inputs.material === "plastic_bucket" || inputs.material === "other" || inputs.material === "metal_drum")
  ) {
    return {
      verdict: "more_info_needed",
      reasons: [
        inputs.material === "metal_drum"
          ? "The food-grade certification and interior lining of this metal drum are unverified. Industrial metal drums often contain heavy metal rust-inhibitors or toxic chemical residues."
          : "The food-grade certification of this container is unverified.",
        "Under the precautionary principle, unverified synthetic or industrial vessels cannot be cleared because non-food-grade polymers or industrial linings risk leaching chemical additives during microbial decomposition.",
      ],
      requiredModifications: [],
      unresolvedChecks: [
        inputs.material === "metal_drum"
          ? "Check manufacturer markings or UN packaging codes to verify the drum was lined for food contact rather than chemicals, oils, or solvents."
          : "Inspect the underside of the vessel for resin identification stamps (HDPE #2 or PP #5).",
        "Check for a food-safe fork-and-cup symbol or manufacturer certification confirming food-contact safety.",
        "If food-grade provenance cannot be verified, substitute with a certified food-grade bucket, terracotta pot, or wooden crate.",
      ],
      ruleId: "RULE-CONT-UNKNOWN-FOOD-GRADE",
      ruleVersion: "1.0",
      sourceReference: {
        ...DEFAULT_SOURCE,
        ruleId: "RULE-CONT-UNKNOWN-FOOD-GRADE",
        title: "Precautionary Principle for Unverified Food-Grade Status",
      },
    };
  }

  const modifications: string[] = [];
  if (!inputs.hasDrainageHoles) {
    if (inputs.material === "terracotta") {
      modifications.push(
        "Ensure the pot has a bottom drainage hole (or drill carefully with a masonry bit) to prevent stagnant leachate pooling."
      );
    } else if (inputs.material !== "wooden_crate") {
      modifications.push(
        "Drill 6–8 drainage holes (6–8mm diameter) in the bottom base to allow excess leachate to drain and prevent foul anaerobic pooling."
      );
    }
  }

  if (!inputs.hasVentilationHoles && inputs.material !== "mesh_wire") {
    if (inputs.material === "terracotta") {
      modifications.push(
        "Terracotta is naturally porous, but ensure upper tiers or rim areas have aeration openings or loose stacking for aerobic oxygenation."
      );
    } else {
      modifications.push(
        "Drill 8–12 aeration holes (4–6mm diameter) around the top perimeter and sides to ensure aerobic microbial oxygenation."
      );
    }
  }

  if (!inputs.hasLid) {
    modifications.push(
      "Provide a loose-fitting lid, breathable terracotta plate, or insect-proof mesh cover to guard against monsoon rain and fruit flies."
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
