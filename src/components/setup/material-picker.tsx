import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { WasteCategory } from "@/types/domain";
import { cn } from "@/lib/utils";

export interface AvailableMaterialDef {
  id: string;
  name: string;
  label: string;
  category: WasteCategory;
  defaultKgWeekly: number;
  description: string;
}

export const PRESET_MATERIALS: AvailableMaterialDef[] = [
  // Greens
  {
    id: "veg_peels",
    name: "vegetable_peels",
    label: "Vegetable Scraps & Fruit Peels",
    category: "greens",
    defaultKgWeekly: 2.5,
    description: "Raw carrot tops, potato skins, apple cores, banana peels (Nitrogen rich).",
  },
  {
    id: "coffee_tea",
    name: "coffee_and_tea",
    label: "Coffee Grounds & Tea Bags/Leaves",
    category: "greens",
    defaultKgWeekly: 0.5,
    description: "Brewed coffee grounds, paper tea bags, loose green/black tea.",
  },
  // Browns
  {
    id: "dry_leaves",
    name: "dry_leaves",
    label: "Dry Leaves & Garden Clippings",
    category: "browns",
    defaultKgWeekly: 1.5,
    description: "Crisp fallen leaves, twigs, dried grass (Carbon rich).",
  },
  {
    id: "cardboard_paper",
    name: "cardboard_and_paper",
    label: "Shredded Cardboard & Egg Cartons",
    category: "browns",
    defaultKgWeekly: 1.0,
    description: "Plain brown corrugated cardboard, egg boxes, unbleached tissue.",
  },
  {
    id: "coco_peat",
    name: "coco_peat",
    label: "Coco Peat / Coir",
    category: "browns",
    defaultKgWeekly: 0.8,
    description: "Expanded coconut coir pith for moisture buffering and aeration.",
  },
  // Caution
  {
    id: "cooked_food",
    name: "cooked_food_with_oil",
    label: "Cooked Food & Leftovers with Oil",
    category: "caution",
    defaultKgWeekly: 0.5,
    description: "Rice, dal, cooked curries. High odor risk in standard aerobic bin.",
  },
  // Excluded
  {
    id: "meat_dairy",
    name: "meat_and_dairy",
    label: "Meat, Bones, or Dairy",
    category: "excluded",
    defaultKgWeekly: 0.5,
    description: "Chicken bones, mutton fat, milk, cheese. Attracts pests and rodents.",
  },
  {
    id: "plastic_packaging",
    name: "plastic_and_synthetics",
    label: "Plastics, Stickers, or Glossy Paper",
    category: "excluded",
    defaultKgWeekly: 0.1,
    description: "Non-biodegradable synthetic contaminants.",
  },
];
