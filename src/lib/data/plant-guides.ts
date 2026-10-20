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
  },
  {
    slug: "mint",
    name: "Mint (Pudina)",
    botanicalName: "Mentha spicata",
    category: "herb",
    tagline: "Fast-growing aromatic herb ideal for shallow balcony planters.",
    description:
      "Spearmint is a resilient, vigorous spreader with lush green leaves. Best grown in its own dedicated shallow pot to prevent invasive root spread.",
    containerMinLitres: 8,
    sunlightHoursMin: 3,
    harvestDays: "25–35 Days",
    wateringGuidance:
      "Prefers consistently damp but not waterlogged soil. Water daily during hot summer weather.",
    sowingGuidance:
      "Easiest grown from stem cuttings rooted in water, or sown lightly on surface and covered with 0.3 cm fine soil.",
    compostBlendRatioMaxPercent: 25,
    compostSafetyWarnings: [
      "Do not substitute 100% pure compost for potting soil; blend 25% mature compost with 75% red soil or coco peat.",
      "Immature compost can scorch delicate shallow mint stolons.",
    ],
    seasonNotes: "Thrives in partial shade during peak summer; loves bright indirect morning light.",
    harvestNotes: "Harvest stems frequently by snipping top thirds; regular pruning promotes vigorous regrowth.",
  },
  {
    slug: "coriander",
    name: "Coriander (Dhania)",
    botanicalName: "Coriandrum sativum",
    category: "herb",
    tagline: "Essential everyday culinary herb flourishing in shallow troughs.",
    description:
      "Fresh cilantro/dhania grows quickly from split seeds. A shallow balcony trough with light, airy soil produces continuous fragrant harvests.",
    containerMinLitres: 8,
    sunlightHoursMin: 4,
    harvestDays: "30–40 Days",
    wateringGuidance:
      "Mist gently to prevent flattening young stalks; keep soil evenly moist without standing water.",
    sowingGuidance:
      "Gently crush coriander whole seeds into halves; sow 1 cm deep in rows spaced 5 cm apart.",
    compostBlendRatioMaxPercent: 20,
    compostSafetyWarnings: [
      "Never sow coriander in 100% pure compost; tender taproots easily suffer ammonium burn and rot.",
      "Incorporate only crumbly, neutral-smelling vermicompost or aerated compost.",
    ],
    seasonNotes: "Grows best in mild autumn and winter months; bolts to seed in extreme heat.",
    harvestNotes: "Cut outer stems 2 cm above soil level when leaves reach 12 cm high, leaving the center intact.",
  },
  {
    slug: "sweet-basil",
    name: "Sweet Basil",
    botanicalName: "Ocimum basilicum",
    category: "herb",
    tagline: "Lush Italian culinary herb bursting with fragrant essential oils.",
    description:
      "Sweet Genovese basil is an Italian kitchen essential. It loves sunny balconies, warm temperatures, and nutrient-balanced potting soil.",
    containerMinLitres: 10,
    sunlightHoursMin: 5,
    harvestDays: "45–55 Days",
    wateringGuidance:
      "Water at the base early in the morning so foliage stays dry, preventing fungal spotting.",
    sowingGuidance:
      "Scatter seeds lightly on surface and cover with 0.5 cm fine compost-soil blend. Germinates in 5–8 days.",
    compostBlendRatioMaxPercent: 25,
    compostSafetyWarnings: [
      "Never plant basil in 100% pure compost; excessive nutrient density and water retention cause root dieback.",
      "Blend 20–25% screened compost into porous coco peat and perlite.",
    ],
    seasonNotes: "Loves warm summer sun; shield from sudden cold drafts or heavy water drops.",
    harvestNotes: "Pinch central stems right above leaf nodes to stimulate double-branching.",
  },
  {
    slug: "rosemary",
    name: "Rosemary",
    botanicalName: "Salvia rosmarinus",
    category: "herb",
    tagline: "Hardy woody perennial with piney aromas and drought tolerance.",
    description:
      "Rosemary is an evergreen Mediterranean shrub that thrives in dry, sunny balcony corners. It prefers gritty, free-draining soil over heavy feeding.",
    containerMinLitres: 12,
    sunlightHoursMin: 6,
    harvestDays: "70–90 Days",
    wateringGuidance:
      "Allow soil to dry out almost completely between waterings. Sensitive to over-watering.",
    sowingGuidance:
      "Propagate from semi-hardwood tip cuttings dipped in water or rooting medium for highest success.",
    compostBlendRatioMaxPercent: 20,
    compostSafetyWarnings: [
      "Never place rosemary in 100% pure compost; high moisture holding will immediately cause root fungus.",
      "Add coarse sand or perlite alongside a modest 15–20% compost proportion.",
    ],
    seasonNotes: "Tough perennial that handles intense afternoon balcony heat with ease.",
    harvestNotes: "Snip 5–8 cm stem sprigs as needed for roasting and herbal infusions.",
  },

  // --- VEGETABLES ---
  {
    slug: "cherry-tomato",
    name: "Cherry Tomato",
    botanicalName: "Solanum lycopersicum var. cerasiforme",
    category: "vegetable",
    tagline: "Prolific balcony fruiter rewarding patient feeding and bright sun.",
    description:
      "Compact cherry tomatoes yield sweet bite-sized fruits in sunny balconies or terraces when given sturdy staking.",
    containerMinLitres: 20,
    sunlightHoursMin: 6,
    harvestDays: "65–75 Days",
    wateringGuidance:
      "Deep, consistent watering at the soil base. Inconsistent watering causes fruit splitting and blossom end rot.",
    sowingGuidance:
      "Start seeds in seed trays; transplant into 20L+ container once seedlings have 4 true leaves.",
    compostBlendRatioMaxPercent: 30,
    compostSafetyWarnings: [
      "Never plant tomato seedlings in 100% pure compost; blend maximum 30% mature compost into 70% garden soil or coco peat.",
      "Never apply immature or unverified compost to edible fruiting vegetables.",
    ],
    seasonNotes: "Best planted post-monsoon (September–November) for bountiful winter fruiting in urban India.",
    harvestNotes: "Pick fruits when fully colored and slightly yielding to gentle pressure.",
  },
  {
    slug: "chili-pepper",
    name: "Green Chili (Mirchi)",
    botanicalName: "Capsicum annuum",
    category: "vegetable",
    tagline: "Zesty, high-yield container favorite for sunny window and balcony boxes.",
    description:
      "Urban balcony staple producing vibrant hot chilies year-round with minimal fuss. Compact growth habit fits standard 12L terracotta pots.",
    containerMinLitres: 12,
    sunlightHoursMin: 5,
    harvestDays: "60–75 Days",
    wateringGuidance:
      "Water thoroughly when top soil dries. Moderate drought stress between flowering increases pepper pungency.",
    sowingGuidance:
      "Sow seeds 0.5 cm deep in seed starter. Transplant when seedlings reach 10 cm height.",
    compostBlendRatioMaxPercent: 25,
    compostSafetyWarnings: [
      "Avoid 100% pure compost which causes excessive nitrogen leaf growth and zero flower set.",
      "Compost must be fully cured to prevent bacterial wilt and fungal damping-off.",
    ],
    seasonNotes: "Thrives in warm, sunny weather; produces continuously for 12–18 months with pruning.",
    harvestNotes: "Cut mature green chilies with kitchen shears leaving a short stem stub.",
  },
  {
    slug: "spinach",
    name: "Spinach (Palak)",
    botanicalName: "Spinacia oleracea",
    category: "vegetable",
    tagline: "Nutrient-packed quick leafy green thriving in wide, shallow balcony boxes.",
    description:
      "Palak is one of the fastest, most productive container crops. Its shallow fibrous root system loves wide rectangular planters and compost-rich soil.",
    containerMinLitres: 8,
    sunlightHoursMin: 3,
    harvestDays: "30–40 Days",
    wateringGuidance:
      "Keep soil continuously cool and moist. Dry soil triggers premature flowering and bitter leaves.",
    sowingGuidance:
      "Soak seeds overnight; sow 1 cm deep in rows spaced 10 cm apart. Germinates in 4–7 days.",
    compostBlendRatioMaxPercent: 25,
    compostSafetyWarnings: [
      "Never cultivate greens in 100% pure compost; high nitrate accumulation can occur in pure organic waste beds.",
      "Mix 25% finished compost into loose coco peat and red soil.",
    ],
    seasonNotes: "Loves cool autumn and winter mornings; tolerates partial balcony shade.",
    harvestNotes: "Cut-and-come-again: snip outer mature leaves, allowing the inner rosette to keep growing.",
  },
  {
    slug: "bush-beans",
    name: "Bush French Beans",
    botanicalName: "Phaseolus vulgaris",
    category: "vegetable",
    tagline: "Compact nitrogen-fixing crop delivering tender pods without trellises.",
    description:
      "Bush beans stay under 50 cm tall and don't need tall trellising. Their roots fix atmospheric nitrogen, naturally enriching your potting mix.",
    containerMinLitres: 12,
    sunlightHoursMin: 5,
    harvestDays: "50–60 Days",
    wateringGuidance:
      "Water deeply during flowering and pod development; avoid soaking leaves to ward off fungal rust.",
    sowingGuidance:
      "Sow seeds directly 2.5 cm deep into the final container; beans dislike root disturbance.",
    compostBlendRatioMaxPercent: 20,
    compostSafetyWarnings: [
      "Never sow beans in 100% pure compost; legumes manufacture their own nitrogen and excess nitrogen stunts pod formation.",
      "Use well-aerated soil amended with 20% mature compost.",
    ],
    seasonNotes: "Ideal for mild spring or post-monsoon planting; sensitive to extreme winter frosts.",
    harvestNotes: "Harvest crisp young pods every 2–3 days when as thick as a pencil.",
  },
  {
    slug: "fenugreek",
    name: "Fenugreek (Methi)",
    botanicalName: "Trigonella foenum-graecum",
    category: "vegetable",
    tagline: "Ultra-fast micro/macro green ready to harvest in three weeks.",
    description:
      "Methi is the ultimate balcony vegetable for beginners. Any 6–8L shallow tray on a windowsill or balcony ledge produces tender green leaves in 20 days.",
    containerMinLitres: 6,
    sunlightHoursMin: 3,
    harvestDays: "20–25 Days",
    wateringGuidance:
      "Light daily spray misting keeps the shallow root zone moist without disturbing delicate seedlings.",
    sowingGuidance:
      "Broadcast whole kitchen fenugreek seeds over damp soil; lightly dust with 0.5 cm soil layer.",
    compostBlendRatioMaxPercent: 20,
    compostSafetyWarnings: [
      "Never sow fenugreek seeds in 100% pure compost; high salt index kills delicate germination shoots.",
      "Incorporate 20% compost into 80% light potting media for rapid root establishment.",
    ],
    seasonNotes: "Excellent year-round balcony green; especially rapid during mild weather.",
    harvestNotes: "Snip entire stems at ground level at 21 days for tender culinary greens.",
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
  },
];
