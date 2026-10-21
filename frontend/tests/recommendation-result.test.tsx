import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { RecommendationCard } from "@/components/compost/recommendation-card";
import { SourceDrawer } from "@/components/compost/source-drawer";
import { ContainerEvaluationResult } from "@cust-post/backend";
import { MethodPlanResult } from "@cust-post/backend";

const mockSuitableContainer: ContainerEvaluationResult = {
  verdict: "suitable",
  reasons: ["Container material is non-toxic and volume is sufficient."],
  requiredModifications: [],
  unresolvedChecks: [],
  ruleId: "RULE-CONT-SUITABLE",
  ruleVersion: "1.0",
  sourceReference: {
    ruleId: "RULE-CONT-SUITABLE",
    version: "1.0",
    title: "Container Safety and Aeration Guidelines",
    organization: "US EPA / MCGM Citizen's Handbook",
    sourceUrl: "https://www.epa.gov/recycle/composting-home",
    reviewer: "Nirman Lab Composting Advisory Panel",
  },
};

const mockModificationsContainer: ContainerEvaluationResult = {
  verdict: "suitable_with_changes",
  reasons: ["Container lacks sufficient aeration holes."],
  requiredModifications: ["Drill 8–10 holes of 6mm diameter around the sides and base."],
  unresolvedChecks: [],
  ruleId: "RULE-CONT-AERATION-MOD",
  ruleVersion: "1.0",
  sourceReference: {
    ruleId: "RULE-CONT-AERATION-MOD",
    version: "1.0",
    title: "Aeration and Drainage Standards",
    organization: "FAO Organic Waste Guide",
    sourceUrl: "https://www.fao.org/soil-management",
  },
};

const mockMoreInfoContainer: ContainerEvaluationResult = {
  verdict: "more_info_needed",
  reasons: ["Container previous history is unknown."],
  requiredModifications: [],
  unresolvedChecks: ["Verify whether container previously held non-food industrial grade chemicals."],
  ruleId: "RULE-CONT-UNKNOWN-HIST",
  ruleVersion: "1.0",
  sourceReference: {
    ruleId: "RULE-CONT-UNKNOWN-HIST",
    version: "1.0",
    title: "Chemical Contamination Prevention",
    organization: "ADEQ Composting Standards",
    sourceUrl: "https://azdeq.gov/composting",
  },
};

const mockUnsuitableContainer: ContainerEvaluationResult = {
  verdict: "unsuitable",
  reasons: ["Container previously held toxic paint or chemical solvents."],
  requiredModifications: [],
  unresolvedChecks: [],
  ruleId: "RULE-CONT-HAZARDOUS",
  ruleVersion: "1.0",
  sourceReference: {
    ruleId: "RULE-CONT-HAZARDOUS",
    version: "1.0",
    title: "Hazardous Materials in Composting Containers",
    organization: "EPA RCRA Division",
    sourceUrl: "https://www.epa.gov/rcra",
  },
};

const mockMethodPlan: MethodPlanResult = {
  chosenMethod: "aerobic_bin",
  methodName: "Aerobic Pot / Bin Composting",
  rationale: ["Balanced volume and balcony space with routine aeration."],
  limitations: ["Requires turning twice a week to avoid anaerobic odor."],
  startingSequence: ["Add 3cm brown bedding", "Add green scraps", "Cover with brown carbon layer"],
  excludedItems: ["Meat", "Dairy", "Pet waste"],
  maintenanceSteps: ["Stir every 3-4 days", "Check damp-sponge moisture"],
  ruleVersion: "1.0",
  sourceId: "RULE-METHOD-AEROBIC",
};

describe("Task 20: Explainable Recommendation Results & Source Drawer", () => {
  it("renders suitable container verdict and method plan", () => {
    render(
      <RecommendationCard
        containerResult={mockSuitableContainer}
        methodPlan={mockMethodPlan}
        volumeLitres={45}
        onViewSources={vi.fn()}
        onStartBatch={vi.fn()}
      />
    );

    expect(screen.getByText(/suitable/i)).toBeInTheDocument();
    expect(screen.getByText(/aerobic pot \/ bin composting/i)).toBeInTheDocument();
    expect(screen.getByText(/balanced volume and balcony space/i)).toBeInTheDocument();
  });

  it("renders suitable_with_changes verdict and lists required modifications", () => {
    render(
      <RecommendationCard
        containerResult={mockModificationsContainer}
        methodPlan={mockMethodPlan}
        volumeLitres={45}
        onViewSources={vi.fn()}
        onStartBatch={vi.fn()}
      />
    );

    expect(screen.getByText(/modifications required/i)).toBeInTheDocument();
    expect(screen.getByText(/drill 8–10 holes/i)).toBeInTheDocument();
  });

  it("renders more_info_needed verdict and unresolved checks", () => {
    render(
      <RecommendationCard
        containerResult={mockMoreInfoContainer}
        methodPlan={null}
        volumeLitres={45}
        onViewSources={vi.fn()}
        onStartBatch={vi.fn()}
      />
    );

    expect(screen.getByText(/more information needed/i)).toBeInTheDocument();
    expect(screen.getByText(/verify whether container previously held non-food/i)).toBeInTheDocument();
  });

  it("labels method plan as preliminary and pauses setup instructions when container requires more info", () => {
    render(
      <RecommendationCard
        containerResult={mockMoreInfoContainer}
        methodPlan={mockMethodPlan}
        volumeLitres={45}
        onViewSources={vi.fn()}
        onStartBatch={vi.fn()}
      />
    );

    expect(screen.getByText(/preliminary method match/i)).toBeInTheDocument();
    expect(screen.getByText(/setup instructions paused/i)).toBeInTheDocument();

    expect(screen.queryByText(/Initial Setup Sequence/i)).not.toBeInTheDocument();
  });

  it("renders unsuitable verdict and safety warning", () => {
    render(
      <RecommendationCard
        containerResult={mockUnsuitableContainer}
        methodPlan={null}
        volumeLitres={45}
        onViewSources={vi.fn()}
        onStartBatch={vi.fn()}
      />
    );

    expect(screen.getByText(/container unsuitable/i)).toBeInTheDocument();
    expect(screen.getByText(/previously held toxic paint/i)).toBeInTheDocument();
  });

  it("renders SourceDrawer with citation metadata and closes on dismissal", () => {
    const handleClose = vi.fn();
    render(
      <SourceDrawer
        isOpen={true}
        onClose={handleClose}
        sources={[mockSuitableContainer.sourceReference]}
      />
    );

    expect(screen.getByText(/rule provenance & literature citations/i)).toBeInTheDocument();
    expect(screen.getByText(/RULE-CONT-SUITABLE/i)).toBeInTheDocument();
    expect(screen.getByText(/US EPA \/ MCGM Citizen's Handbook/i)).toBeInTheDocument();
    expect(screen.getByText(/Nirman Lab Composting Advisory Panel/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});
