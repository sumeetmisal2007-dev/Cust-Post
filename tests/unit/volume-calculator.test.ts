import { describe, it, expect } from "vitest";
import {
  calculateGeometricVolume,
  validateSpaceFit,
} from "@/lib/compost-rules/volume-calculator";
import { ContainerDimensions, SpaceDimensions } from "@/types/domain";

describe("Volume Calculator & Space Fitting Engine (Task 05)", () => {
  describe("calculateGeometricVolume", () => {
    it("calculates volume accurately for rectangular container", () => {
      const container: ContainerDimensions = {
        shape: "rectangular",
        internalLengthCm: 50,
        internalWidthCm: 40,
        internalHeightCm: 30,
      };
      // 50 * 40 * 30 = 60,000 cm^3 = 60.0 Litres
      const result = calculateGeometricVolume(container);
      expect(result.volumeLitres).toBe(60);
      expect(result.isApproximate).toBe(false);
      expect(result.disclaimer).toMatch(/geometric volume only/i);
    });

    it("calculates volume accurately for cylindrical container", () => {
      const container: ContainerDimensions = {
        shape: "cylindrical",
        diameterCm: 40, // radius = 20
        internalHeightCm: 50,
      };
      // pi * 20^2 * 50 = pi * 400 * 50 = 20,000 * pi = ~62831.85 cm^3 = ~62.8 Litres
      const result = calculateGeometricVolume(container);
      expect(result.volumeLitres).toBeCloseTo(62.8, 1);
      expect(result.isApproximate).toBe(false);
    });

    it("marks irregular shapes as approximate", () => {
      const container: ContainerDimensions = {
        shape: "irregular",
        internalLengthCm: 40,
        internalWidthCm: 40,
        internalHeightCm: 40,
      };
      const result = calculateGeometricVolume(container);
      expect(result.isApproximate).toBe(true);
      expect(result.volumeLitres).toBeGreaterThan(0);
    });

    it("throws or returns error for missing required dimensions", () => {
      const container: ContainerDimensions = {
        shape: "rectangular",
        internalLengthCm: undefined,
        internalWidthCm: 30,
        internalHeightCm: 30,
      };
      expect(() => calculateGeometricVolume(container)).toThrowError(
        /dimensions missing/i
      );
    });
  });

  describe("validateSpaceFit", () => {
    const space: SpaceDimensions = {
      locationType: "balcony",
      lengthCm: 100,
      widthCm: 80,
      maxHeightCm: 120,
    };

    it("confirms container fits within space with clearance", () => {
      const container: ContainerDimensions = {
        shape: "rectangular",
        internalLengthCm: 60,
        internalWidthCm: 50,
        internalHeightCm: 70,
      };
      const check = validateSpaceFit(space, container);
      expect(check.fits).toBe(true);
      expect(check.clearanceCm.length).toBe(40);
      expect(check.clearanceCm.width).toBe(30);
      expect(check.clearanceCm.height).toBe(50);
      expect(check.warnings.length).toBe(0);
    });

    it("detects when container exceeds available length, width, or height", () => {
      const oversizedContainer: ContainerDimensions = {
        shape: "rectangular",
        internalLengthCm: 110,
        internalWidthCm: 90,
        internalHeightCm: 130,
      };
      const check = validateSpaceFit(space, oversizedContainer);
      expect(check.fits).toBe(false);
      expect(check.warnings.length).toBeGreaterThan(0);
      expect(check.warnings.some((w) => w.includes("Length"))).toBe(true);
    });

    it("issues tight-clearance warning when remaining space is < 10cm", () => {
      const tightContainer: ContainerDimensions = {
        shape: "rectangular",
        internalLengthCm: 95, // 5cm clearance
        internalWidthCm: 75, // 5cm clearance
        internalHeightCm: 100,
      };
      const check = validateSpaceFit(space, tightContainer);
      expect(check.fits).toBe(true);
      expect(check.warnings.some((w) => w.toLowerCase().includes("clearance"))).toBe(true);
    });
  });
});
