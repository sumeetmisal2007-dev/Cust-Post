export interface PlantGuide {
  slug: string;
  name: string;
  botanicalName: string;
  tagline: string;
  description: string;
  containerMinLitres: number;
  sunlightHoursMin: number;
  wateringGuidance: string;
  sowingGuidance: string;
  compostBlendRatioMaxPercent: number;
  compostSafetyWarnings: string[];
  seasonNotes: string;
  harvestNotes: string;
}

export const PLANT_GUIDES: PlantGuide[] = [
  {
    slug: "tulsi",
    name: "Tulsi (Holy Basil)",
    botanicalName: "Ocimum tenuiflorum",
    tagline: "Venerated medicinal herb thriving in warm balcony containers.",
    description:
      "Tulsi is an aromatic perennial adapted to warm sub-tropical and tropical climates. It performs well in medium pots with well-drained soil.",
    containerMinLitres: 10,
    sunlightHoursMin: 4,
    wateringGuidance:
      "Water moderately when the top 2 cm of soil feels dry. Avoid waterlogging at all costs.",
    sowingGuidance:
      "Sow seeds 0.5 cm deep in warm soil. Keep moist until germination (7–14 days). Thin to strongest seedling.",
    compostBlendRatioMaxPercent: 20,
    compostSafetyWarnings: [
      "Never plant Tulsi in 100% pure compost; pure compost retains excess moisture that induces root rot in basil.",
      "Ensure compost is fully cured and dark with no sour smell before blending into potting mix.",
    ],
    seasonNotes: "Grows year-round in Mumbai / coastal climates; protect from heavy monsoon downpours.",
    harvestNotes: "Pinch top leaf clusters regularly to encourage bushy branching and prevent premature flowering.",
  },
  {
    slug: "mint",
    name: "Mint (Pudina)",
    botanicalName: "Mentha spicata",
    tagline: "Fast-growing aromatic herb ideal for shallow balcony planters.",
    description:
      "Spearmint is a resilient, vigorous spreader with lush green leaves. Best grown in its own dedicated shallow pot to prevent invasive root spread.",
    containerMinLitres: 8,
    sunlightHoursMin: 3,
    wateringGuidance:
      "Prefers consistently damp but not waterlogged soil. Water daily during hot summer weather.",
    sowingGuidance:
      "Easiest grown from stem cuttings rooted in water, or sown lightly on surface and covered with 0.3 cm fine soil.",
    compostBlendRatioMaxPercent: 25,
    compostSafetyWarnings: [
      "Do not substitute 100% compost for potting soil; blend 25% mature compost with 75% red soil or coco peat.",
      "Immature compost can scorch delicate shallow mint stolons.",
    ],
    seasonNotes: "Thrives in partial shade during peak summer; loves bright indirect morning light.",
    harvestNotes: "Harvest stems frequently by snipping top thirds; regular pruning promotes vigorous regrowth.",
  },
  {
    slug: "cherry-tomato",
    name: "Cherry Tomato",
    botanicalName: "Solanum lycopersicum var. cerasiforme",
    tagline: "Prolific balcony fruiter rewarding patient feeding and bright sun.",
    description:
      "Compact cherry tomatoes yield sweet bite-sized fruits in sunny balconies or terraces when given sturdy staking.",
    containerMinLitres: 20,
    sunlightHoursMin: 6,
    wateringGuidance:
      "Deep, consistent watering at the soil base. Inconsistent watering causes fruit splitting and blossom end rot.",
    sowingGuidance:
      "Start seeds in seed trays; transplant into 20L+ container once seedlings have 4 true leaves.",
    compostBlendRatioMaxPercent: 30,
    compostSafetyWarnings: [
      "Compost provides rich slow-release nutrients, but must be limited to max 30% of pot volume.",
      "Never apply immature or unverified compost to edible fruiting vegetables.",
    ],
    seasonNotes: "Best planted post-monsoon (September–November) for bountiful winter fruiting in urban India.",
    harvestNotes: "Pick fruits when fully colored and slightly yielding to gentle pressure.",
  },
];
