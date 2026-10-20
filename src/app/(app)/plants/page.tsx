import React from "react";
import { PLANT_GUIDES } from "@/lib/data/plant-guides";
import { PlantsCatalogueView } from "@/components/plants/plants-catalogue-view";

export const metadata = {
  title: "Balcony Plant Care & Safe Compost Hub | Cust-Post",
  description: "Curated home and balcony container guide for herbs, vegetables, and fruits with verified safe compost blending ratios.",
};

export default function PlantsPage() {
  return <PlantsCatalogueView plants={PLANT_GUIDES} />;
}
