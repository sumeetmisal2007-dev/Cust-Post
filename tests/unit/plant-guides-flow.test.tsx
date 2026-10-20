import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { PlantCard } from "@/components/plants/plant-card";
import { PLANT_GUIDES } from "@/lib/data/plant-guides";

describe("Task 26: Plant Guide & Safe Compost Application Hub", () => {
  const tulsi = PLANT_GUIDES.find((p) => p.slug === "tulsi")!;

  describe("PlantCard", () => {
    it("renders plant details, botanical name, and container requirements", () => {
      render(<PlantCard plant={tulsi} />);

      expect(screen.getByText(/tulsi \(holy basil\)/i)).toBeInTheDocument();
      expect(screen.getByText(/ocimum tenuiflorum/i)).toBeInTheDocument();
      expect(screen.getByText(/10\s*l\s*min/i)).toBeInTheDocument();
      expect(screen.getByText(/4\s*hrs?\s*sun/i)).toBeInTheDocument();

      const link = screen.getByRole("link", { name: /view plant guide/i });
      expect(link).toHaveAttribute("href", "/plants/tulsi");
    });

    it("renders category badge on card", () => {
      render(<PlantCard plant={tulsi} />);
      expect(screen.getAllByText(/herb/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Curated Plant Collection", () => {
    it("contains at least 20 beginner-friendly container plants", () => {
      expect(PLANT_GUIDES.length).toBeGreaterThanOrEqual(20);
    });

    it("includes herbs, vegetables, and fruits", () => {
      const categories = new Set(PLANT_GUIDES.map((p) => p.category));
      expect(categories.has("herb")).toBe(true);
      expect(categories.has("vegetable")).toBe(true);
      expect(categories.has("fruit")).toBe(true);
    });
  });

  describe("Compost Safety Guardrails", () => {
    it("enforces max blend ratio between 20% and 30% for all starter plants", () => {
      PLANT_GUIDES.forEach((p) => {
        expect(p.compostBlendRatioMaxPercent).toBeGreaterThanOrEqual(20);
        expect(p.compostBlendRatioMaxPercent).toBeLessThanOrEqual(30);
      });
    });

    it("includes explicit warnings against planting in 100% pure compost", () => {
      PLANT_GUIDES.forEach((p) => {
        const warningsJoined = p.compostSafetyWarnings.join(" ");
        expect(warningsJoined).toMatch(/100%\s*(pure)?\s*compost/i);
      });
    });
  });
});
