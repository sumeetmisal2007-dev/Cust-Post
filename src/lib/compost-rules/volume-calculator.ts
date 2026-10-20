import { ContainerDimensions, SpaceDimensions } from "@/types/domain";

export interface GeometricVolumeResult {
  volumeLitres: number;
  isApproximate: boolean;
  disclaimer: string;
}

export interface SpaceFitResult {
  fits: boolean;
  clearanceCm: {
    length: number;
    width: number;
    height: number;
  };
  warnings: string[];
}

export const GEOMETRIC_VOLUME_DISCLAIMER =
  "Geometric volume only; does not equal biological compost processing capacity or completion time.";

function cleanDim(val?: number): number | undefined {
  return typeof val === "number" && !Number.isNaN(val) && val > 0 ? val : undefined;
}

export function calculateGeometricVolume(dim: ContainerDimensions): GeometricVolumeResult {
  let volumeCm3: number;
  let isApproximate = false;

  if (dim.shape === "rectangular") {
    const l = cleanDim(dim.internalLengthCm);
    const w = cleanDim(dim.internalWidthCm);
    const h = cleanDim(dim.internalHeightCm);
    if (l === undefined || w === undefined || h === undefined) {
      throw new Error("Rectangular container dimensions missing (length, width, or height)");
    }
    volumeCm3 = l * w * h;
  } else if (dim.shape === "cylindrical") {
    const d = cleanDim(dim.diameterCm);
    const h = cleanDim(dim.internalHeightCm);
    if (d === undefined || h === undefined) {
      throw new Error("Cylindrical container dimensions missing (diameter or height)");
    }
    const radius = d / 2;
    volumeCm3 = Math.PI * radius * radius * h;
  } else if (dim.shape === "irregular") {
    const l = cleanDim(dim.internalLengthCm);
    const w = cleanDim(dim.internalWidthCm);
    const h = cleanDim(dim.internalHeightCm);
    if (l === undefined || w === undefined || h === undefined) {
      throw new Error(
        "Irregular container dimensions missing (footprint length, width, or height required)"
      );
    }
    // Irregular shape approximation using actual footprint measurements (85% bounding box factor)
    volumeCm3 = l * w * h * 0.85;
    isApproximate = true;
  } else {
    throw new Error(`Unsupported container shape: ${dim.shape}`);
  }

  return {
    volumeLitres: Math.round((volumeCm3 / 1000) * 10) / 10,
    isApproximate,
    disclaimer: isApproximate
      ? `${GEOMETRIC_VOLUME_DISCLAIMER} (Approximation for irregular geometry)`
      : GEOMETRIC_VOLUME_DISCLAIMER,
  };
}

export function validateSpaceFit(
  space: SpaceDimensions,
  container: ContainerDimensions
): SpaceFitResult {
  // Use external dimensions if provided (ensuring realistic space fit including rim, lid, and handles);
  // fallback to internal dimensions if external dimensions were not collected.
  const extHeight = cleanDim(container.externalHeightCm);
  const intHeight = cleanDim(container.internalHeightCm);
  const containerHeight: number = extHeight ?? intHeight ?? 0;

  let containerLength: number;
  let containerWidth: number;

  if (container.shape === "cylindrical") {
    const d = cleanDim(container.externalDiameterCm) ?? cleanDim(container.diameterCm) ?? 0;
    containerLength = d;
    containerWidth = d;
  } else {
    containerLength =
      cleanDim(container.externalLengthCm) ??
      cleanDim(container.internalLengthCm) ??
      cleanDim(container.diameterCm) ??
      0;
    containerWidth =
      cleanDim(container.externalWidthCm) ??
      cleanDim(container.internalWidthCm) ??
      cleanDim(container.diameterCm) ??
      0;
  }

  const warnings: string[] = [];

  // Edge case check: Irregular containers must have actual footprint measurements
  if (
    container.shape === "irregular" &&
    (containerLength <= 0 || containerWidth <= 0)
  ) {
    warnings.push(
      "Irregular container requires actual footprint measurements (length and width) for space-fit calculation."
    );
  }

  const hasValidDimensions =
    containerLength > 0 && containerWidth > 0 && containerHeight > 0;

  const clearanceLength = space.lengthCm - containerLength;
  const clearanceWidth = space.widthCm - containerWidth;
  const clearanceHeight = space.maxHeightCm - containerHeight;

  if (hasValidDimensions) {
    if (clearanceLength < 0) {
      warnings.push(`Container exceeds available Length by ${Math.abs(clearanceLength)} cm.`);
    } else if (clearanceLength < 10) {
      warnings.push(
        `Tight clearance for Length (${clearanceLength} cm remaining); may hinder airflow or access.`
      );
    }

    if (clearanceWidth < 0) {
      warnings.push(`Container exceeds available Width by ${Math.abs(clearanceWidth)} cm.`);
    } else if (clearanceWidth < 10) {
      warnings.push(
        `Tight clearance for Width (${clearanceWidth} cm remaining); may hinder airflow or access.`
      );
    }

    if (clearanceHeight < 0) {
      warnings.push(`Container exceeds available Height by ${Math.abs(clearanceHeight)} cm.`);
    } else if (clearanceHeight < 10) {
      warnings.push(
        `Tight clearance for Height (${clearanceHeight} cm remaining); check lid opening clearance.`
      );
    }
  }

  const fits =
    hasValidDimensions &&
    clearanceLength >= 0 &&
    clearanceWidth >= 0 &&
    clearanceHeight >= 0;

  return {
    fits,
    clearanceCm: {
      length: clearanceLength,
      width: clearanceWidth,
      height: clearanceHeight,
    },
    warnings,
  };
}
