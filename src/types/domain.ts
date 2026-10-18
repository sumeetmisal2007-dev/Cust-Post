export type LocationType = "indoor" | "balcony" | "terrace" | "garden";

export type ContainerShape = "rectangular" | "cylindrical" | "irregular";

export type ContainerMaterial =
  | "plastic_bucket"
  | "terracotta"
  | "wooden_crate"
  | "metal_drum"
  | "mesh_wire"
  | "other";

export type PreviousUse =
  | "food"
  | "paint_chemicals"
  | "soil_garden"
  | "new_unused"
  | "unknown";

export type ContainerCondition =
  | "good"
  | "cracked_damaged"
  | "uncleanable_residue";

export type FoodGradeStatus = "food_grade" | "non_food_grade" | "unknown";

export type RecommendationVerdict =
  | "suitable"
  | "suitable_with_changes"
  | "unsuitable"
  | "more_info_needed";

export type CompostingMethod =
  | "aerobic_bin"
  | "vermicomposting"
  | "bokashi";

export type MaintenanceCapacity = "daily_stirring" | "weekly_turning" | "minimal_effort";

export type SmellSensitivity = "high" | "medium" | "low";

export type WasteCategory = "greens" | "browns" | "caution" | "excluded";

export type DataStatus = "measured" | "estimated" | "user_reported" | "unknown";

export type MoistureLevel = "dry" | "ideal" | "too_wet";

export type OdourType = "earthy" | "none" | "sour" | "ammonia";

export type PestType = "none" | "fruit_flies" | "maggots" | "rodents" | "ants" | "cockroaches";

export interface SpaceDimensions {
  locationType: LocationType;
  lengthCm: number;
  widthCm: number;
  maxHeightCm: number;
}

export interface ContainerDimensions {
  shape: ContainerShape;
  internalLengthCm?: number;
  internalWidthCm?: number;
  internalHeightCm: number;
  diameterCm?: number;
}

export interface ContainerCheckInputs extends ContainerDimensions {
  material: ContainerMaterial;
  previousUse: PreviousUse;
  condition: ContainerCondition;
  hasLid: boolean;
  hasVentilationHoles: boolean;
  hasDrainageHoles: boolean;
  isFoodGrade?: FoodGradeStatus;
}

export interface WasteInputItem {
  category: WasteCategory;
  name: string;
  quantityWeekly: number;
  unit: "kg" | "litres";
}

export interface RuleSource {
  ruleId: string;
  version: string;
  title: string;
  organization: string;
  sourceUrl: string;
  reviewer?: string;
  reviewDate?: string;
}

export interface PhysicalMaturityChecks {
  darkCrumblyTexture: boolean;
  earthyOdorNoRot: boolean;
  ambientTemperature: boolean;
  foodScrapsDecomposed: boolean;
}
