import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { PotCalculator } from "@/components/plants/pot-calculator";
import { PLANT_GUIDES } from "@cust-post/backend";

describe("PotCalculator (AMC Natural Pot Formulator)", () => {
  const tulsi = PLANT_GUIDES.find((p) => p.slug === "tulsi")!;

  it("renders with initial pot size set to the plant minimum container volume", () => {
    render(<PotCalculator plant={tulsi} />);

    expect(screen.getByText(/pot & soil blend formulator/i)).toBeInTheDocument();
    expect(screen.getByText(/10\s*litres/i)).toBeInTheDocument();
  });

  it("calculates exact compost and potting soil volumes for default capacity", () => {
    render(<PotCalculator plant={tulsi} />);

    expect(screen.getByTestId("compost-volume")).toHaveTextContent("2 L");
    expect(screen.getByTestId("soil-volume")).toHaveTextContent("8 L");
  });

  it("updates blend volumes when preset buttons are clicked", () => {
    render(<PotCalculator plant={tulsi} />);

    const preset25L = screen.getByRole("button", { name: /25l/i });
    fireEvent.click(preset25L);

    expect(screen.getByTestId("compost-volume")).toHaveTextContent("5 L");
    expect(screen.getByTestId("soil-volume")).toHaveTextContent("20 L");
  });

  it("updates volume when the slider value changes", () => {
    render(<PotCalculator plant={tulsi} />);

    const slider = screen.getByRole("slider", { name: /container volume/i });
    fireEvent.change(slider, { target: { value: "15" } });

    expect(screen.getByTestId("compost-volume")).toHaveTextContent("3 L");
    expect(screen.getByTestId("soil-volume")).toHaveTextContent("12 L");
  });

  it("displays universal safety guardrail warning regarding 100% pure compost", () => {
    render(<PotCalculator plant={tulsi} />);

    expect(screen.getByText(/never plant directly in 100% pure compost/i)).toBeInTheDocument();
  });
});
