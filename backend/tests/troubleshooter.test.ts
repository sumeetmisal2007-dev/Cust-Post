import { describe, it, expect } from "vitest";
import {
  troubleshootCompost,
  TroubleshootingInputs,
} from "../src/compost-rules/troubleshooter";

describe("Symptom-Based Troubleshooting Engine (Task 08)", () => {
  it("resolves foul rotten/ammonia odor with aeration and dry brown additions", () => {
    const input: TroubleshootingInputs = {
      symptom: "foul_odor_ammonia_rot",
      method: "aerobic_bin",
      hasStandingWater: false,
    };

    const resolution = troubleshootCompost(input);
    expect(resolution.likelyCauses.length).toBeGreaterThan(0);
    expect(
      resolution.immediateAction.some((a) => a.toLowerCase().includes("brown"))
    ).toBe(true);
    expect(resolution.sourceId).toBe("RULE-TROUBLE-ODOR");
    expect(resolution.suggestedLogAction).toBeDefined();
  });

  it("resolves excess moisture / soggy standing water with drainage clearing instructions", () => {
    const input: TroubleshootingInputs = {
      symptom: "excess_moisture_soggy",
      method: "aerobic_bin",
      hasStandingWater: true,
    };

    const resolution = troubleshootCompost(input);
    expect(
      resolution.whatToInspect.some((i) => i.toLowerCase().includes("drainage"))
    ).toBe(true);
    expect(
      resolution.immediateAction.some((a) => a.toLowerCase().includes("cardboard"))
    ).toBe(true);
    expect(resolution.sourceId).toBe("RULE-TROUBLE-MOISTURE");
  });

  it("resolves fruit flies / maggots by recommending burial and top brown cap", () => {
    const input: TroubleshootingInputs = {
      symptom: "pests_fruit_flies_maggots",
      method: "aerobic_bin",
      surfaceFoodVisible: true,
    };

    const resolution = troubleshootCompost(input);
    expect(
      resolution.immediateAction.some((a) => a.toLowerCase().includes("cover") || a.toLowerCase().includes("bury"))
    ).toBe(true);
    expect(resolution.sourceId).toBe("RULE-TROUBLE-PESTS");
  });

  it("resolves slow or dormant decomposition by assessing moisture and turning", () => {
    const input: TroubleshootingInputs = {
      symptom: "slow_decomposition",
      method: "aerobic_bin",
      isDry: true,
    };

    const resolution = troubleshootCompost(input);
    expect(
      resolution.immediateAction.some((a) => a.toLowerCase().includes("moisture") || a.toLowerCase().includes("water"))
    ).toBe(true);
    expect(resolution.sourceId).toBe("RULE-TROUBLE-SLOW");
  });

  it("handles high-risk rodent or animal intrusion with stop/relocation guidance", () => {
    const input: TroubleshootingInputs = {
      symptom: "rodent_intrusion",
      method: "aerobic_bin",
    };

    const resolution = troubleshootCompost(input);
    expect(resolution.isHighRisk).toBe(true);
    expect(
      resolution.immediateAction.some((a) => a.toLowerCase().includes("stop") || a.toLowerCase().includes("remove"))
    ).toBe(true);
  });
});
