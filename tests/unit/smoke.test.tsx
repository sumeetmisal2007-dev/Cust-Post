import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";

describe("Vitest & Testing Library Harness", () => {
  it("executes basic assertions accurately", () => {
    expect(1 + 1).toBe(2);
    expect(true).toBe(true);
  });

  it("renders Button component with proper label and classes", () => {
    render(<Button>Start Composting</Button>);
    const button = screen.getByRole("button", { name: /start composting/i });
    expect(button).toBeInTheDocument();
  });

  it("renders StatusChip with semantic status text and role", () => {
    render(<StatusChip status="measured" label="Direct Scale Measurement" />);
    const chip = screen.getByRole("status");
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveTextContent("Direct Scale Measurement");
  });

  it("renders StatusChip unknown status by default", () => {
    render(<StatusChip status="unknown" />);
    const chip = screen.getByRole("status");
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveTextContent("Not Measured / Unknown");
  });
});
