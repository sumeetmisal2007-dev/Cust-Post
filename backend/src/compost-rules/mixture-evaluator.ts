import { WasteInputItem } from "../types/domain";

export interface MixtureBalanceResult {
  greensTotalKg: number;
  brownsTotalKg: number;
  greensTotalLitres: number;
  brownsTotalLitres: number;
  volumeRatioBrownsToGreens: number;
  weightRatioBrownsToGreens: number;
  status: "balanced" | "excess_greens" | "excess_browns";
  advice: string;
  excludedItemsFound: string[];
}

export const MATERIAL_DENSITIES: Record<string, number> = {
  vegetable_peels: 0.8,
  fruit_veg_scraps: 0.8,
  vegetable_scraps: 0.8,
  coffee_and_tea: 0.6,
  dry_leaves: 0.12,
  cardboard_and_paper: 0.1,
  cardboard: 0.1,
  coco_peat: 0.25,
  cooked_food_with_oil: 0.85,
  meat_and_dairy: 0.9,
  plastic_and_synthetics: 0.2,
};

const DEFAULT_GREENS_DENSITY = 0.8;
const DEFAULT_BROWNS_DENSITY = 0.12;

export function evaluateStartingMixture(materials: WasteInputItem[]): MixtureBalanceResult {
  let greensTotalKg = 0;
  let brownsTotalKg = 0;
  let greensTotalLitres = 0;
  let brownsTotalLitres = 0;
  const excludedItemsFound: string[] = [];

  for (const item of materials) {
    if (item.category === "excluded") {
      excludedItemsFound.push(item.name);
      continue;
    }

    const density =
      MATERIAL_DENSITIES[item.name] ??
      (item.category === "browns" ? DEFAULT_BROWNS_DENSITY : DEFAULT_GREENS_DENSITY);

    let itemKg = 0;
    let itemLitres = 0;

    if (item.unit === "litres") {
      itemLitres = item.quantityWeekly;
      itemKg = item.quantityWeekly * density;
    } else {

      itemKg = item.quantityWeekly;
      itemLitres = density > 0 ? item.quantityWeekly / density : item.quantityWeekly;
    }

    if (item.category === "greens") {
      greensTotalKg += itemKg;
      greensTotalLitres += itemLitres;
    } else if (item.category === "browns") {
      brownsTotalKg += itemKg;
      brownsTotalLitres += itemLitres;
    } else if (item.category === "caution") {

      greensTotalKg += itemKg;
      greensTotalLitres += itemLitres;
    }
  }

  const roundedGreensKg = Math.round(greensTotalKg * 10) / 10;
  const roundedBrownsKg = Math.round(brownsTotalKg * 10) / 10;
  const roundedGreensLitres = Math.round(greensTotalLitres * 10) / 10;
  const roundedBrownsLitres = Math.round(brownsTotalLitres * 10) / 10;

  const volumeRatio =
    roundedGreensLitres > 0
      ? Math.round((roundedBrownsLitres / roundedGreensLitres) * 10) / 10
      : roundedBrownsLitres > 0
      ? 10
      : 0;

  const weightRatio =
    roundedGreensKg > 0
      ? Math.round((roundedBrownsKg / roundedGreensKg) * 100) / 100
      : roundedBrownsKg > 0
      ? 10
      : 0;

  if (roundedGreensLitres === 0 && roundedBrownsLitres === 0) {
    return {
      greensTotalKg: 0,
      brownsTotalKg: 0,
      greensTotalLitres: 0,
      brownsTotalLitres: 0,
      volumeRatioBrownsToGreens: 0,
      weightRatioBrownsToGreens: 0,
      status: "balanced",
      advice:
        "No compostable materials entered yet. Add kitchen greens and carbon-rich browns (aiming for a 2:1 to 3:1 volume ratio) to begin your batch.",
      excludedItemsFound,
    };
  }

  let status: "balanced" | "excess_greens" | "excess_browns" = "balanced";
  let advice = "";

  if (volumeRatio < 1.0) {
    status = "excess_greens";
    const recommendedBrownsLitres = Math.round(Math.max(2, roundedGreensLitres * 2) * 10) / 10;
    advice = `Excess nitrogen and moisture detected. Your current volume ratio is approximately ${volumeRatio}:1 (browns to greens). To prevent soggy compaction and foul anaerobic odors, add dry browns (shredded cardboard, dry leaves, coco peat) to achieve a 2:1 to 3:1 volume ratio (~${recommendedBrownsLitres} litres/week).`;
  } else if (volumeRatio > 7.0) {
    status = "excess_browns";
    const recommendedGreensKg = Math.round(Math.max(1, roundedBrownsKg / 2) * 10) / 10;
    advice = `Excess carbon detected. Your current volume ratio is approximately ${volumeRatio}:1 (browns to greens). Decomposition will be slow without adequate nitrogen and moisture. Add moist vegetable scraps or fresh coffee grounds (~${recommendedGreensKg} kg/week) to activate active composting.`;
  } else {
    status = "balanced";
    advice = `Initial brown-to-green balance is within recommended working range for aerobic composting (~${volumeRatio}:1 volume ratio; ${weightRatio}:1 weight ratio). This provides both the structural air pockets and the moisture needed for active aerobic decomposition.`;
  }

  return {
    greensTotalKg: roundedGreensKg,
    brownsTotalKg: roundedBrownsKg,
    greensTotalLitres: roundedGreensLitres,
    brownsTotalLitres: roundedBrownsLitres,
    volumeRatioBrownsToGreens: volumeRatio,
    weightRatioBrownsToGreens: weightRatio,
    status,
    advice,
    excludedItemsFound,
  };
}
