import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import HomePage from "@/app/page";

describe("Landing Page (Task 15)", () => {
  it("renders editorial hero headline and primary CTA", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /make room for better soil/i })
    ).toBeInTheDocument();
    const ctas = screen.getAllByRole("link", { name: /start a setup/i });
    expect(ctas.length).toBeGreaterThan(0);
  });

  it("renders all three core feature tiles with transparent status chips", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 3, name: /screen your container/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /track real batches/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /evidence-first advice/i })).toBeInTheDocument();
  });

  it("includes SDG 12 Target 12.5 commitment", () => {
    render(<HomePage />);
    expect(screen.getByText(/un sdg 12/i)).toBeInTheDocument();
  });
});
