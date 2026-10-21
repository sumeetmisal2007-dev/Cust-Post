import { describe, it, expect } from "vitest";
import {
  calculateGeometricVolume,
  validateSpaceFit,
} from "../src/compost-rules/volume-calculator";
import { ContainerDimensions, SpaceDimensions } from "../src/types/domain";

describe("Volume Calculator & Space Fitting Engine (Task 05)", () => {
  describe("calculateGeometricVolume", () => {
    it("calculates volume accurately for rectangular container", () => {
      const container: ContainerDimensions = {
        shape: "rectangular",
        internalLengthCm: 50,
        internalWidthCm: 40,
        internalHeightCm: 30,
      };

      const result = calculateGeometricVolume(container);
      expect(result.volumeLitres).toBe(60);
      expect(result.isApproximate).toBe(false);
      expect(result.disclaimer).toMatch(/geometric volume only/i);
    });

    it("calculates volume accurately for cylindrical container", () => {
      const container: ContainerDimensions = {
        shape: "cylindrical",
        diameterCm: 40,
        internalHeightCm: 50,
      };

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

    it("requires footprint dimensions for irregular shapes and throws error if missing", () => {
      const irregularWithoutFootprint: ContainerDimensions = {
        shape: "irregular",
        internalLengthCm: undefined,
        internalWidthCm: undefined,
        internalHeightCm: 40,
      };
      expect(() => calculateGeometricVolume(irregularWithoutFootprint)).toThrowError(
        /footprint/i
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
        externalLengthCm: 60,
        externalWidthCm: 50,
        externalHeightCm: 70,
      };
      const check = validateSpaceFit(space, container);
      expect(check.fits).toBe(true);
      expect(check.clearanceCm.length).toBe(40);
      expect(check.clearanceCm.width).toBe(30);
      expect(check.clearanceCm.height).toBe(50);
      expect(check.warnings.length).toBe(0);
    });

    it("warns when external footprint was not provided and internal dimensions were used", () => {
      const container: ContainerDimensions = {
        shape: "rectangular",
        internalLengthCm: 60,
        internalWidthCm: 50,
        internalHeightCm: 70,
      };
      const check = validateSpaceFit(space, container);
      expect(check.fits).toBe(true);
      expect(check.warnings.some((w) => w.includes("External footprint was not provided"))).toBe(true);
    });

    it("warns when clearance on an axis is exactly zero (flush fit)", () => {
      const exactFitContainer: ContainerDimensions = {
        shape: "rectangular",
        externalLengthCm: 100,
        externalWidthCm: 50,
        externalHeightCm: 70,
      };
      const check = validateSpaceFit(space, exactFitContainer);
      expect(check.fits).toBe(true);
      expect(check.clearanceCm.length).toBe(0);
      expect(check.warnings.some((w) => w.includes("Zero clearance for Length"))).toBe(true);
    });

    it("rejects non-positive or missing space dimensions", () => {
      const badSpace = {
        locationType: "balcony" as const,
        lengthCm: 0,
        widthCm: -10,
        maxHeightCm: 100,
      };
      const container: ContainerDimensions = {
        shape: "rectangular",
        internalLengthCm: 50,
        internalWidthCm: 40,
        internalHeightCm: 50,
      };
      const check = validateSpaceFit(badSpace, container);
      expect(check.fits).toBe(false);
      expect(check.warnings.some((w) => w.includes("Space dimensions must be positive"))).toBe(true);
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
        internalLengthCm: 95,
        internalWidthCm: 75,
        internalHeightCm: 100,
      };
      const check = validateSpaceFit(space, tightContainer);
      expect(check.fits).toBe(true);
      expect(check.warnings.some((w) => w.toLowerCase().includes("clearance"))).toBe(true);
    });

    it("uses external dimensions for space fit when outer container exceeds space even if internal fits", () => {

      const outerBulkyContainer: ContainerDimensions = {
        shape: "rectangular",
        internalLengthCm: 95,
        internalWidthCm: 75,
        internalHeightCm: 110,
        externalLengthCm: 106,
        externalWidthCm: 84,
        externalHeightCm: 125,
      };

      const check = validateSpaceFit(space, outerBulkyContainer);
      expect(check.fits).toBe(false);
      expect(check.clearanceCm.length).toBe(-6);
      expect(check.clearanceCm.width).toBe(-4);
      expect(check.clearanceCm.height).toBe(-5);
      expect(check.warnings.some((w) => w.includes("Length"))).toBe(true);
      expect(check.warnings.some((w) => w.includes("Width"))).toBe(true);
      expect(check.warnings.some((w) => w.includes("Height"))).toBe(true);
    });

    it("requires actual footprint measurements for irregular containers and warns when missing", () => {
      const irregularNoFootprint: ContainerDimensions = {
        shape: "irregular",
        internalHeightCm: 40,
      };

      const check = validateSpaceFit(space, irregularNoFootprint);
      expect(check.fits).toBe(false);
      expect(check.warnings.some((w) => w.toLowerCase().includes("irregular"))).toBe(true);
    });
  });
});
