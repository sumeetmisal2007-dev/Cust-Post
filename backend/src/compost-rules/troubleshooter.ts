import { CompostingMethod } from "../types/domain";

export type CompostSymptom =
  | "foul_odor_ammonia_rot"
  | "excess_moisture_soggy"
  | "too_dry_no_breakdown"
  | "pests_fruit_flies_maggots"
  | "slow_decomposition"
  | "rodent_intrusion";

export interface TroubleshootingInputs {
  symptom: CompostSymptom;
  method: CompostingMethod;
  hasStandingWater?: boolean;
  surfaceFoodVisible?: boolean;
  isDry?: boolean;
}

export interface TroubleshootingResolution {
  symptomTitle: string;
  likelyCauses: string[];
  whatToInspect: string[];
  immediateAction: string[];
  suggestedLogAction: string;
  isHighRisk: boolean;
  sourceId: string;
  sourceTitle: string;
  sourceUrl: string;
}

export function troubleshootCompost(
  inputs: TroubleshootingInputs
): TroubleshootingResolution {
  switch (inputs.symptom) {
    case "foul_odor_ammonia_rot":
      return {
        symptomTitle: "Foul Rotten Egg or Ammonia Odor",
        likelyCauses: [
          "Anaerobic conditions caused by lack of oxygen.",
          "Excessive moisture creating stagnant sludge pockets.",
          "Overload of nitrogen-rich greens or wet kitchen scraps.",
        ],
        whatToInspect: [
          "Inspect bottom holes: ensure drainage is not blocked by compacted soil.",
          "Squeeze a handful of compost: if water streams out, moisture is dangerously high (>65%).",
        ],
        immediateAction: [
          "Thoroughly turn and fluff the pile to introduce fresh oxygen.",
          "Mix in 2–3 large handfuls of dry carbon browns (shredded egg cartons, dry leaves, coarse cardboard).",
          "Leave lid slightly ajar for 24 hours to let steam and volatile gases vent.",
        ],
        suggestedLogAction: "Record turning action and 250g dry brown addition",
        isHighRisk: false,
        sourceId: "RULE-TROUBLE-ODOR",
        sourceTitle: "EPA Composting at Home: Diagnosing Odor and Anaerobic Conditions",
        sourceUrl: "https://www.epa.gov/recycle/composting-home",
      };

    case "excess_moisture_soggy":
      return {
        symptomTitle: "Excess Moisture / Soggy Standing Liquid",
        likelyCauses: [
          "Clogged drainage holes preventing leachate egress.",
          "High proportion of water-heavy scraps (watermelon, cucumber, tea leaves).",
          "Rain intrusion through unsealed lid during monsoon.",
        ],
        whatToInspect: [
          "Inspect drainage holes at base of container for blockages.",
          "Check underneath container: verify elevation blocks allow air and drainage escape.",
        ],
        immediateAction: [
          "Elevate container on bricks or wooden slats to ensure drainage free-flow.",
          "Clear clogged bottom holes with a clean stick or wire.",
          "Tear dry cardboard into 2cm pieces and mix throughout bottom and mid-layers.",
        ],
        suggestedLogAction: "Record drainage unclogged and absorbent brown addition",
        isHighRisk: false,
        sourceId: "RULE-TROUBLE-MOISTURE",
        sourceTitle: "ADEQ Compost Troubleshooting: Excess Moisture Guidance",
        sourceUrl: "https://azdeq.gov/composting-guide",
      };

    case "pests_fruit_flies_maggots":
      return {
        symptomTitle: "Fruit Flies, Gnats, or Maggot Infestation",
        likelyCauses: [
          "Food scraps left exposed directly on the pile surface.",
          "Loose-fitting lid or uncovered air holes.",
          "Accidental inclusion of cooked meat or dairy attracting blowflies.",
        ],
        whatToInspect: [
          "Check top surface: are fresh fruit skins or food bits visible?",
          "Check lid seal: ensure gaps do not exceed 2mm.",
        ],
        immediateAction: [
          "Bury all fresh food scraps at least 10 cm deep beneath active compost.",
          "Cover the entire top surface with a 5 cm 'blanket' of dry brown shredded paper or coco peat.",
          "Cover air vents with fine wire mesh or breathable cheesecloth.",
        ],
        suggestedLogAction: "Record pest containment and surface brown blanket applied",
        isHighRisk: false,
        sourceId: "RULE-TROUBLE-PESTS",
        sourceTitle: "MCGM Citizen's Handbook: Balcony Compost Pest Prevention",
        sourceUrl: "https://portal.mcgm.gov.in",
      };

    case "slow_decomposition":
      return {
        symptomTitle: "Slow Decomposition or Cold Pile",
        likelyCauses: [
          "Pile is too dry for microbial activity.",
          "Insufficient nitrogen greens to activate bacterial reproduction.",
          "Ambient temperature is cold or pile volume is under-sized.",
        ],
        whatToInspect: [
          "Inspect pile moisture: if brittle and dry to touch, microbes are dormant.",
          "Check pile volume: less than 15 litres often struggles to retain self-generated heat.",
        ],
        immediateAction: [
          "Sprinkle water evenly until compost feels like a wrung-out damp sponge.",
          "Mix in fresh nitrogen sources (coffee grounds, crushed vegetable scraps).",
          "Turn pile to redistribute moisture and aerate dormant centers.",
        ],
        suggestedLogAction: "Record moisture adjustment and fresh nitrogen addition",
        isHighRisk: false,
        sourceId: "RULE-TROUBLE-SLOW",
        sourceTitle: "EPA Composting at Home: Activating Decomposition",
        sourceUrl: "https://www.epa.gov/recycle/composting-home",
      };

    case "rodent_intrusion":
      return {
        symptomTitle: "Rodent or Animal Intrusion Detected",
        likelyCauses: [
          "Meat, bones, fat, or strong animal products added to batch.",
          "Flimsy container walls or unsecured lid chewed through.",
        ],
        whatToInspect: [
          "Inspect for entry holes, gnaw marks, or burrowing tunnels.",
        ],
        immediateAction: [
          "Stop adding any food scraps immediately.",
          "Remove any meat, dairy, or bread scraps from the pile.",
          "Secure container with heavy-duty metal hardware cloth (6mm mesh) or latching straps.",
          "If infestation persists on balcony, relocate setup or discontinue active additions.",
        ],
        suggestedLogAction: "Record emergency rodent containment and removal of attractants",
        isHighRisk: true,
        sourceId: "RULE-TROUBLE-RODENT",
        sourceTitle: "ADEQ Compost Safety & Vector Control Protocols",
        sourceUrl: "https://azdeq.gov/composting-guide",
      };

    default:
      return {
        symptomTitle: "General Compost Inquiry",
        likelyCauses: ["Varied biological fluctuations."],
        whatToInspect: ["Check overall moisture, smell, and scrap volume."],
        immediateAction: ["Maintain standard 2:1 brown-to-green layering and aerate weekly."],
        suggestedLogAction: "Record standard observation",
        isHighRisk: false,
        sourceId: "RULE-TROUBLE-GENERAL",
        sourceTitle: "Composting Standards",
        sourceUrl: "https://www.epa.gov/recycle/composting-home",
      };
  }
}
