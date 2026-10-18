import { WasteInputItem } from "@/types/domain";

export interface MixtureBalanceResult {
  greensTotalKg: number;
  brownsTotalKg: number;
  status: "balanced" | "excess_greens" | "excess_browns";
  advice: string;
  excludedItemsFound: string[];
}

export function evaluateStartingMixture(materials: WasteInputItem[]): MixtureBalanceResult {
  let greensTotalKg = 0;
  let brownsTotalKg = 0;
  const excludedItemsFound: string[] = [];

  for (const item of materials) {
    if (item.category === "excluded") {
      excludedItemsFound.push(item.name);
    } else if (item.category === "greens") {
      greensTotalKg += item.quantityWeekly;
    } else if (item.category === "browns") {
      brownsTotalKg += item.quantityWeekly;
    } else if (item.category === "caution") {
      // Caution items count towards wet greens
      greensTotalKg += item.quantityWeekly;
    }
  }

  let status: "balanced" | "excess_greens" | "excess_browns" = "balanced";
  let advice = "Initial brown-to-green balance is optimal for microbial decomposition.";

  if (greensTotalKg > brownsTotalKg * 2) {
    status = "excess_greens";
    advice =
      "Excess nitrogen and moisture detected. Add dry browns (shredded cardboard, dry leaves, coco peat) in a 2:1 volume ratio to prevent soggy compaction and foul odors.";
  } else if (brownsTotalKg > greensTotalKg * 3) {
    status = "excess_browns";
    advice =
      "Excess carbon detected. Decomposition will be very slow without adequate nitrogen and moisture. Add moist vegetable scraps or fresh coffee grounds.";
  }

  return {
    greensTotalKg,
    brownsTotalKg,
    status,
    advice,
    excludedItemsFound,
  };
}
