export type PlantCategory = "herb" | "vegetable" | "fruit";

export interface PlantGuide {
  slug: string;
  name: string;
  botanicalName: string;
  category: PlantCategory;
  tagline: string;
  description: string;
  containerMinLitres: number;
  sunlightHoursMin: number;
  harvestDays: string;
  wateringGuidance: string;
  sowingGuidance: string;
  compostBlendRatioMaxPercent: number;
  compostSafetyWarnings: string[];
  seasonNotes: string;
  harvestNotes: string;
  imageUrl: string;
}

export const PLANT_GUIDES: PlantGuide[] = [
  // --- HERBS ---
  {
    slug: "tulsi",
    name: "Tulsi (Holy Basil)",
    botanicalName: "Ocimum tenuiflorum",
    category: "herb",
    tagline: "Venerated medicinal herb thriving in warm balcony containers.",
    description:
      "Tulsi is an aromatic perennial adapted to warm sub-tropical and tropical climates. It performs well in medium pots with well-drained soil.",
    containerMinLitres: 10,
    sunlightHoursMin: 4,
    harvestDays: "40–50 Days",
    wateringGuidance:
      "Water moderately when the top 2 cm of soil feels dry. Avoid waterlogging at all costs.",
    sowingGuidance:
      "Sow seeds 0.5 cm deep in warm soil. Keep moist until germination (7–14 days). Thin to strongest seedling.",
    compostBlendRatioMaxPercent: 20,
    compostSafetyWarnings: [
      "Never plant Tulsi in 100% pure compost; pure compost retains excess moisture that induces root rot in basil.",
      "Ensure compost is fully cured and dark with no sour smell before blending into potting mix.",
    ],
    seasonNotes: "Grows year-round in coastal climates; protect from heavy monsoon downpours.",
    harvestNotes: "Pinch top leaf clusters regularly to encourage bushy branching and prevent premature flowering.",
    imageUrl: "/images/plants/tulsi.png",
  },
  {
    slug: "mint",
    name: "Mint (Pudina)",
    botanicalName: "Mentha spicata",
    category: "herb",
    tagline: "Vigorous, fast-spreading herb ideal for isolated balcony planters.",
    description:
      "Spearmint is a resilient, moisture-loving perennial. Keep in an isolated container to prevent invasive rhizomes from overtaking other plants.",
    containerMinLitres: 8,
    sunlightHoursMin: 4,
    harvestDays: "30–45 Days",
    wateringGuidance:
      "Keep soil consistently moist but never waterlogged. Thrives with regular shallow watering.",
    sowingGuidance:
      "Best grown from stem cuttings or nursery runners. Bury stems horizontally 2 cm deep in moist soil.",
    compostBlendRatioMaxPercent: 20,
    compostSafetyWarnings: [
      "Do not use 100% pure compost; pure compost can harbour pathogens that cause leaf rust.",
      "Blend 20% compost into regular garden soil or coco peat.",
    ],
    seasonNotes: "Thrives year-round in warm balconies; appreciates light afternoon shade during peak summer.",
    harvestNotes: "Harvest sprigs from the top. Regular harvesting stimulates fresh, tender leaf production.",
    imageUrl: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "coriander",
    name: "Coriander (Dhania)",
    botanicalName: "Coriandrum sativum",
    category: "herb",
    tagline: "Fragrant, fast-growing kitchen essential for shallow balcony containers.",
    description:
      "Coriander produces tender leaves and flavorful seeds. It has shallow roots and thrives in wide, shallow pots with rich organic matter.",
    containerMinLitres: 7,
    sunlightHoursMin: 4,
    harvestDays: "35–45 Days",
    wateringGuidance:
      "Keep substrate consistently moist. Dry soil triggers premature bolting (flowering).",
    sowingGuidance:
      "Gently split coriander seeds into halves. Sow 1 cm deep in rows spaced 8 cm apart.",
    compostBlendRatioMaxPercent: 20,
    compostSafetyWarnings: [
      "Never plant coriander in 100% pure compost; pure compost causes stem rot and rapid bolting.",
      "Blend 20% mature compost into light potting mix with coco peat.",
    ],
    seasonNotes: "Grows best in mild weather and cool winter mornings; provide afternoon shade in summer.",
    harvestNotes: "Cut outer leaves at the base, leaving central crown intact for continuous regrowth.",
    imageUrl: "/images/plants/coriander.png",
  },
  {
    slug: "sweet-basil",
    name: "Sweet Basil",
    botanicalName: "Ocimum basilicum",
    category: "herb",
    tagline: "Aromatic Italian culinary herb with lush emerald leaves.",
    description:
      "Sweet Basil is famous for pesto and salads. It produces fragrant, tender leaves and thrives on sunny windowsills with aerated organic soil.",
    containerMinLitres: 8,
    sunlightHoursMin: 5,
    harvestDays: "45–60 Days",
    wateringGuidance:
      "Water at the base of the plant early in the morning when the topsoil feels dry to the touch.",
    sowingGuidance:
      "Sow seeds 0.5 cm deep; keep warm and moist. Seeds sprout in 5–10 days.",
    compostBlendRatioMaxPercent: 25,
    compostSafetyWarnings: [
      "Never grow Sweet Basil in 100% pure compost; pure compost suffocates tender feeder roots.",
      "Ensure proper drainage and blend max 25% compost into 75% potting soil.",
    ],
    seasonNotes: "Loves warm weather and bright light; protect from frost or cold drafts.",
    harvestNotes: "Pinch off flower buds immediately to keep foliage sweet and prevent bitterness.",
    imageUrl: "/images/plants/sweet-basil.jpg",
  },
  {
    slug: "rosemary",
    name: "Rosemary",
    botanicalName: "Salvia rosmarinus",
    category: "herb",
    tagline: "Resilient Mediterranean perennial with needle-like aromatic foliage.",
    description:
      "Rosemary is an evergreen shrub with intense woody fragrance. Excellent for well-drained terracotta pots on sunny balconies.",
    containerMinLitres: 12,
    sunlightHoursMin: 6,
    harvestDays: "80–90 Days",
    wateringGuidance:
      "Allow soil to dry out between waterings. Rosemary hates 'wet feet' and overwatering.",
    sowingGuidance:
      "Propagate from semi-hardwood stem cuttings for faster, reliable results compared to seeds.",
    compostBlendRatioMaxPercent: 20,
    compostSafetyWarnings: [
      "Never pot rosemary in 100% pure compost; heavy wet compost causes rapid root asphyxiation.",
      "Combine 20% compost with 80% coarse sand, perlite, and garden soil.",
    ],
    seasonNotes: "Drought-tolerant and loves high heat; thrives year-round in bright sun.",
    harvestNotes: "Snip sprigs from fresh green stems, leaving the older woody base intact.",
    imageUrl: "https://images.unsplash.com/photo-1515586000433-45406d8e6662?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "curry-leaves",
    name: "Curry Leaves (Kadi Patta)",
    botanicalName: "Murraya koenigii",
    category: "herb",
    tagline: "Essential Indian culinary aromatic thriving in sunny balcony containers.",
    description:
      "The heart of Indian tempering (tadka). Kadi Patta produces clusters of intensely aromatic glossy pinnate leaves that flourish in deep pots under warm sunshine.",
    containerMinLitres: 15,
    sunlightHoursMin: 5,
    harvestDays: "60–90 Days",
    wateringGuidance:
      "Water when the top 3 cm dries. Prefers slightly acidic, well-draining soil; never allow water to stand in the saucer.",
    sowingGuidance:
      "Propagate from semi-hardwood stem cuttings or fresh seeds in warm weather. Protect saplings from harsh noon winds.",
    compostBlendRatioMaxPercent: 25,
    compostSafetyWarnings: [
      "Never plant Curry Leaves in 100% pure compost; excessive organic density promotes fungal root rot and iron chlorosis.",
      "Blend 25% mature compost with 75% red soil and coco peat for optimal drainage.",
    ],
    seasonNotes: "Grows vigorously in tropical heat and monsoon; slows down during cold winter months.",
    harvestNotes: "Harvest whole leaflets from the top to stimulate bushier lateral branching.",
    imageUrl: "/images/plants/curry-leaves.jpg",
  },
  {
    slug: "ajwain-leaves",
    name: "Ajwain Leaves (Karpuravalli)",
    botanicalName: "Plectranthus amboinicus",
    category: "herb",
    tagline: "Succulent medicinal powerhouse famed for pakoras and home remedies.",
    description:
      "Known as Indian Borage or Karpuravalli, this thick-leaved succulent herb emits a pungent thyme-and-oregano aroma. Indestructible on warm sunny apartment windowsills.",
    containerMinLitres: 8,
    sunlightHoursMin: 4,
    harvestDays: "30–45 Days",
    wateringGuidance:
      "Drought-tolerant succulent nature; water sparingly only when soil is completely dry.",
    sowingGuidance:
      "Roots effortlessly from single 10 cm stem cuttings in soil or water within 5–7 days.",
    compostBlendRatioMaxPercent: 20,
    compostSafetyWarnings: [
      "Never grow in 100% pure compost; succulent stems will rot instantly in water-retentive pure compost.",
      "Mix 20% well-cured compost into 80% sandy loam or perlite-rich potting mix.",
    ],
    seasonNotes: "Thrives year-round across Indian climates; loves partial morning or full balcony sun.",
    harvestNotes: "Snip thick tender leaves fresh as needed for soothing teas or savory fritters.",
    imageUrl: "/images/plants/ajwain-leaves.png",
  },

  // --- VEGETABLES ---
  {
    slug: "cherry-tomato",
    name: "Cherry Tomato",
    botanicalName: "Solanum lycopersicum var. cerasiforme",
    category: "vegetable",
    tagline: "Prolific balcony fruiter delivering sweet clusters all season long.",
    description:
      "Indeterminate and dwarf determinate cherry tomato varieties adapt well to large pots. They produce sweet, bite-sized fruit continuously with adequate sun and staking.",
    containerMinLitres: 15,
    sunlightHoursMin: 6,
    harvestDays: "60–75 Days",
    wateringGuidance:
      "Water deeply and regularly. Inconsistent moisture causes fruit splitting and blossom end rot.",
    sowingGuidance:
      "Sow seeds indoors 0.5 cm deep; transplant to final 15L pot when seedlings have 4–6 true leaves.",
    compostBlendRatioMaxPercent: 25,
    compostSafetyWarnings: [
      "Never plant tomato seedlings in 100% pure compost; nitrogen toxicity causes excessive leaf growth with no flowers.",
      "Blend 25% compost with 75% red soil or potting soil and ensure drainage holes are unobstructed.",
    ],
    seasonNotes: "Loves warm weather and maximum balcony sunlight; shelter during torrential monsoon weeks.",
    harvestNotes: "Harvest when fruits turn fully bright red and yield slightly to gentle thumb pressure.",
    imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "chili",
    name: "Green Chili (Mirchi)",
    botanicalName: "Capsicum annuum",
    category: "vegetable",
    tagline: "Fiery, compact container vegetable that loves sunny urban balconies.",
    description:
      "Green chili is a staple hot pepper adapted to warm climates. It thrives in medium-to-large balcony pots with well-draining soil and plenty of sunshine.",
    containerMinLitres: 12,
    sunlightHoursMin: 5,
    harvestDays: "65–75 Days",
    wateringGuidance:
      "Allow the top 2 cm of soil to dry out between waterings. Overwatering causes flower drop.",
    sowingGuidance:
      "Sow seeds 0.5 cm deep in warm seed starter. Transplant when seedlings reach 8–10 cm in height.",
    compostBlendRatioMaxPercent: 25,
    compostSafetyWarnings: [
      "Never pot chilies in 100% pure compost; excessive moisture and salts cause leaf curling and root stress.",
      "Blend 25% compost with garden soil and perlite or coco peat.",
    ],
    seasonNotes: "Thrives during warm summer and post-monsoon months; protect from heavy frost or prolonged cold.",
    harvestNotes: "Snip mature green chilies with kitchen scissors to prevent branch snapping.",
    imageUrl: "/images/plants/green-chili.png",
  },
  {
    slug: "spinach",
    name: "Spinach (Palak)",
    botanicalName: "Spinacia oleracea",
    category: "vegetable",
    tagline: "Nutrient-packed leafy green with rapid turnaround in wide balcony planters.",
    description:
      "Spinach is a nutrient-dense cool-season green. It has a compact root system that flourishes in shallow, wide balcony planter boxes with moisture-retentive soil.",
    containerMinLitres: 8,
    sunlightHoursMin: 4,
    harvestDays: "35–45 Days",
    wateringGuidance:
      "Keep soil evenly moist. Dry periods cause early bolting and bitter, tough foliage.",
    sowingGuidance:
      "Sow seeds directly 1 cm deep and 5 cm apart in wide shallow troughs or crates.",
    compostBlendRatioMaxPercent: 20,
    compostSafetyWarnings: [
      "Never plant in 100% pure compost; pure compost causes nitrate imbalance and seedling damping-off.",
      "Blend 20% mature compost into 80% garden soil and coco peat.",
    ],
    seasonNotes: "Grows fastest during mild winter months; provide afternoon shade in warm tropical climates.",
    harvestNotes: "Harvest outer leaves continuously, allowing inner leaves to keep expanding.",
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "french-beans",
    name: "Bush French Beans",
    botanicalName: "Phaseolus vulgaris",
    category: "vegetable",
    tagline: "Compact, nitrogen-fixing legume producing crisp pods without towering trellises.",
    description:
      "Bush varieties do not require tall trellises, making them ideal for balcony pots. They produce high yields of tender pods in a relatively small soil footprint.",
    containerMinLitres: 12,
    sunlightHoursMin: 5,
    harvestDays: "50–60 Days",
    wateringGuidance:
      "Water evenly, especially during flowering and pod development. Do not let soil dry completely.",
    sowingGuidance:
      "Sow seeds directly 2.5 cm deep into the final container. Avoid disturbing legume roots by transplanting.",
    compostBlendRatioMaxPercent: 20,
    compostSafetyWarnings: [
      "Never plant beans in 100% pure compost; legumes fix their own nitrogen and excess compost produces excessive leaves with few pods.",
      "Blend 20% compost into 80% loamy soil.",
    ],
    seasonNotes: "Performs best in moderate temperatures (18°C–28°C); avoid peak heatwaves.",
    harvestNotes: "Harvest pods when firm and pencil-thin before seeds bulge conspicuously.",
    imageUrl: "https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "methi",
    name: "Fenugreek (Methi)",
    botanicalName: "Trigonella foenum-graecum",
    category: "vegetable",
    tagline: "Micro-green and cooking green champion ready to harvest in 21 days.",
    description:
      "Methi is one of the easiest, fastest crops for balcony gardeners. Wide, shallow containers produce multiple flushes of fragrant greens in under a month.",
    containerMinLitres: 6,
    sunlightHoursMin: 4,
    harvestDays: "21–30 Days",
    wateringGuidance:
      "Lightly sprinkle water daily to keep top layer moist without disturbing tiny seedlings.",
    sowingGuidance:
      "Broadcast kitchen fenugreek seeds across soil surface and cover with 0.5 cm of compost-soil blend.",
    compostBlendRatioMaxPercent: 20,
    compostSafetyWarnings: [
      "Never plant fenugreek in 100% pure compost; tender sprouts are prone to fungal collapse in unmixed compost.",
      "Incorporate 20% compost into 80% light potting media for rapid root establishment.",
    ],
    seasonNotes: "Excellent year-round balcony green; especially rapid during mild weather.",
    harvestNotes: "Snip entire stems at ground level at 21 days for tender culinary greens.",
    imageUrl: "/images/plants/methi.png",
  },
  {
    slug: "okra-bhindi",
    name: "Okra (Bhindi / Lady's Finger)",
    botanicalName: "Abelmoschus esculentus",
    category: "vegetable",
    tagline: "High-yielding sun-worshipper with hibiscus-like blooms and tender pods.",
    description:
      "A quintessential Indian household favorite. Compact and dwarf okra cultivars produce striking cream flowers followed by crisp green pods within 50 days.",
    containerMinLitres: 15,
    sunlightHoursMin: 6,
    harvestDays: "50–65 Days",
    wateringGuidance:
      "Consistent, deep watering during flowering and pod development; avoid splashing water on leaves.",
    sowingGuidance:
      "Soak seeds overnight and sow 1.5 cm deep directly in the final container. Germinates in 4–6 days.",
    compostBlendRatioMaxPercent: 25,
    compostSafetyWarnings: [
      "Never start Okra in 100% pure compost; heavy nitrogen excess causes leafy gigantism with zero pods.",
      "Blend 25% compost with garden soil and coarse sand for aeration.",
    ],
    seasonNotes: "Loves intense summer and warm monsoon weather (25°C–38°C).",
    harvestNotes: "Harvest tender 3–4 inch pods every 2 days with pruning shears to stimulate continuous yield.",
    imageUrl: "https://images.unsplash.com/photo-1425543103986-22abb7d7e8d2?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "brinjal-baingan",
    name: "Brinjal (Baingan / Eggplant)",
    botanicalName: "Solanum melongena",
    category: "vegetable",
    tagline: "Sturdy tropical producer with glossy purple fruit and purple blooms.",
    description:
      "From small round bhatia eggplants to slender purple brinjals, this hardy nightshade flourishes in balcony containers with upright staking and rich aeration.",
    containerMinLitres: 18,
    sunlightHoursMin: 6,
    harvestDays: "65–80 Days",
    wateringGuidance:
      "Keep substrate evenly moist. Heavy feeder and drinker while fruits swell; never let soil dry to cracking.",
    sowingGuidance:
      "Sow seeds in small seedling cups; transplant the healthiest shoot into the 18L pot at 4 weeks.",
    compostBlendRatioMaxPercent: 25,
    compostSafetyWarnings: [
      "Never transplant into 100% pure compost; young brinjal roots suffer severe salt stress and damping-off.",
      "Blend 25% balanced compost with garden soil and add crushed eggshells or lime for calcium.",
    ],
    seasonNotes: "Performs best in warm, sunny weather; protect from chilly winter draughts.",
    harvestNotes: "Cut fruit when glossy, firm, and fully colored before seeds turn hard and skin dulls.",
    imageUrl: "/images/plants/brinjal.png",
  },
  {
    slug: "red-amaranth",
    name: "Red Amaranth (Lal Saag / Chaulai)",
    botanicalName: "Amaranthus tricolor",
    category: "vegetable",
    tagline: "Vibrant crimson nutritional powerhouse ready for harvest in just 25 days.",
    description:
      "Prized across Indian regional cuisines (Lal Saag, Tambdi Bhaji, Thotakura), red amaranth thrives in shallow balcony troughs, delivering iron-rich tender leaves at record speed.",
    containerMinLitres: 8,
    sunlightHoursMin: 4,
    harvestDays: "25–35 Days",
    wateringGuidance:
      "Gentle misting or rose-can watering daily. Keep soil surface evenly moist without dislodging tiny roots.",
    sowingGuidance:
      "Scatter fine seeds thinly over moist soil surface, cover with 2 mm of coco peat. Emerges in 48 hours.",
    compostBlendRatioMaxPercent: 20,
    compostSafetyWarnings: [
      "Never sow tiny amaranth seeds in 100% pure compost; excessive moisture crusting drowns delicate germinating sprouts.",
      "Incorporate 20% compost into 80% light coco-soil mixture.",
    ],
    seasonNotes: "Extreme heat tolerance; thrives effortlessly through hot Indian summers and monsoons.",
    harvestNotes: "Harvest baby greens at 20 days or cut stems 5 cm above base for multi-cut regrowth.",
    imageUrl: "/images/plants/red-amaranth.png",
  },
  {
    slug: "bitter-gourd",
    name: "Bitter Gourd (Karela)",
    botanicalName: "Momordica charantia",
    category: "vegetable",
    tagline: "Vigorous balcony vine delivering prized medicinal ridged green gourds.",
    description:
      "A climbing vine adorned with yellow fragrant blossoms and deeply lobed leaves. Trained along a balcony grill or netting, Karela yields abundant therapeutic bitter gourds.",
    containerMinLitres: 15,
    sunlightHoursMin: 6,
    harvestDays: "55–70 Days",
    wateringGuidance:
      "Water regularly to maintain moist soil during flowering. Mulch pot surface to retain moisture in summer.",
    sowingGuidance:
      "Nick seed coat gently, soak in water for 12 hours, sow 2 cm deep. Provide a trellis or string support.",
    compostBlendRatioMaxPercent: 25,
    compostSafetyWarnings: [
      "Never plant bitter gourd in 100% pure compost; unamended compost leads to root rot and blossom drop.",
      "Mix 25% compost with 75% loamy garden soil.",
    ],
    seasonNotes: "Warm season crop; thrives from February to October across the subcontinent.",
    harvestNotes: "Harvest while fruits are dark green, firm, and tender before they turn orange and split open.",
    imageUrl: "/images/plants/bitter-gourd.png",
  },
  {
    slug: "capsicum",
    name: "Capsicum (Shimla Mirch)",
    botanicalName: "Capsicum annuum",
    category: "vegetable",
    tagline: "Crisp, sweet, blocky bell peppers thriving in structured balcony planters.",
    description:
      "A staple in Indian stir-fries and curries, Shimla Mirch produces compact bushy plants that yield thick-walled crunchy green peppers in moderate balcony pots.",
    containerMinLitres: 12,
    sunlightHoursMin: 5,
    harvestDays: "60–75 Days",
    wateringGuidance:
      "Consistent, moderate watering. Moisture fluctuations cause blossom end rot and flower drop.",
    sowingGuidance:
      "Start seeds indoors in small plugs; transplant single vigorous seedling into a 12L pot after 4 true leaves appear.",
    compostBlendRatioMaxPercent: 25,
    compostSafetyWarnings: [
      "Do not pot in 100% pure compost; pure compost impedes calcium uptake and causes blossom-end rot.",
      "Combine 25% compost with 75% aerated potting loam and perlite.",
    ],
    seasonNotes: "Grows best in moderate temperatures (20°C–30°C); provide light afternoon shade in peak summer.",
    harvestNotes: "Snip when firm and glossy green, or leave on vine to ripen to sweet yellow or red.",
    imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
  },

  // --- FRUITS ---
  {
    slug: "strawberry",
    name: "Balcony Strawberry",
    botanicalName: "Fragaria × ananassa",
    category: "fruit",
    tagline: "Sweet crimson jewels thriving in hanging baskets and window boxes.",
    description:
      "Day-neutral container strawberries trail gracefully over pot edges, keeping fruit clean and pests away while soaking in bright balcony sun.",
    containerMinLitres: 8,
    sunlightHoursMin: 6,
    harvestDays: "75–90 Days",
    wateringGuidance:
      "Even, regular watering to keep roots hydrated while crowns stay dry above the soil line.",
    sowingGuidance:
      "Plant bare-root runners or starter plugs with crown positioned strictly level with soil line.",
    compostBlendRatioMaxPercent: 25,
    compostSafetyWarnings: [
      "Do not bury crowns in 100% pure compost; pure compost promotes crown rot and fungal mildew.",
      "Blend 25% acidic organic compost with coco peat and perlite.",
    ],
    seasonNotes: "Produces heavily during crisp sunny winter and spring months.",
    harvestNotes: "Harvest when fruits turn completely crimson red with green calyx curling back.",
    imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "dwarf-lemon",
    name: "Dwarf Lemon / Calamondin",
    botanicalName: "Citrus × microcarpa",
    category: "fruit",
    tagline: "Stunning evergreen balcony citrus with fragrant blooms and tart fruit.",
    description:
      "Compact potted citrus trees produce glossy foliage, intensely scented white flowers, and edible tart golden fruit right on your balcony.",
    containerMinLitres: 25,
    sunlightHoursMin: 6,
    harvestDays: "120–180 Days",
    wateringGuidance:
      "Water thoroughly until drainage runs clear, then wait until the top 4 cm of soil dries before repeating.",
    sowingGuidance:
      "Always start with grafted or air-layered dwarf specimens in a 25L+ terracotta container.",
    compostBlendRatioMaxPercent: 25,
    compostSafetyWarnings: [
      "Never pot citrus trees in 100% pure compost; heavy compost suffocates citrus tap roots and spikes pH.",
      "Top-dress with a 2–3 cm layer of compost every 6 weeks instead of heavy base potting.",
    ],
    seasonNotes: "Loves maximum sunlight; protect from strong dry winds during flowering.",
    harvestNotes: "Pick fruit when bright golden-orange with a gentle twist and snip.",
    imageUrl: "https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "dwarf-guava",
    name: "Dwarf Guava (Amrood / Peru)",
    botanicalName: "Psidium guajava",
    category: "fruit",
    tagline: "Prolific Indian balcony fruit tree with fragrant white blooms and sweet fruit.",
    description:
      "Grafted dwarf Thai and Lucknow guava varieties thrive in large balcony containers, producing smooth attractive bark, fragrant pollinators' blooms, and crisp sweet fruit.",
    containerMinLitres: 25,
    sunlightHoursMin: 6,
    harvestDays: "120–180 Days",
    wateringGuidance:
      "Deep, thorough watering once or twice a week. Allow top 4 cm to dry between waterings.",
    sowingGuidance:
      "Always plant grafted dwarf or air-layered saplings in a sturdy 25L+ terracotta or fabric growbag.",
    compostBlendRatioMaxPercent: 25,
    compostSafetyWarnings: [
      "Never plant fruit saplings directly in 100% pure compost; root suffocation and nutrient lockout will occur.",
      "Top-dress with 25% compost mix twice a year before flowering and fruiting cycles.",
    ],
    seasonNotes: "Extremely hardy in Indian heat; prune annually after harvest to maintain compact 4-foot height.",
    harvestNotes: "Harvest when fruit changes from deep green to light yellow-green with a rich fragrance.",
    imageUrl: "/images/plants/dwarf-guava.png",
  },
];
