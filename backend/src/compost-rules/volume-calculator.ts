import { ContainerDimensions, SpaceDimensions } from "../types/domain";

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
  const warnings: string[] = [];

  const sLength = cleanDim(space?.lengthCm);
  const sWidth = cleanDim(space?.widthCm);
  const sHeight = cleanDim(space?.maxHeightCm);

  if (!space || sLength === undefined || sWidth === undefined || sHeight === undefined) {
    return {
      fits: false,
      clearanceCm: {
        length: 0,
        width: 0,
        height: 0,
      },
      warnings: ["Space dimensions must be positive numbers."],
    };
  }

  const extHeight = cleanDim(container.externalHeightCm);
  const intHeight = cleanDim(container.internalHeightCm);
  const containerHeight: number = extHeight ?? intHeight ?? 0;

  let containerLength: number;
  let containerWidth: number;
  let hasExternalFootprint = false;

  if (container.shape === "cylindrical") {
    const extD = cleanDim(container.externalDiameterCm);
    const intD = cleanDim(container.diameterCm);
    hasExternalFootprint = extD !== undefined;
    const d = extD ?? intD ?? 0;
    containerLength = d;
    containerWidth = d;
  } else {
    const extL = cleanDim(container.externalLengthCm);
    const extW = cleanDim(container.externalWidthCm);
    const intL = cleanDim(container.internalLengthCm) ?? cleanDim(container.diameterCm);
    const intW = cleanDim(container.internalWidthCm) ?? cleanDim(container.diameterCm);
    hasExternalFootprint = extL !== undefined && extW !== undefined;
    containerLength = extL ?? intL ?? 0;
    containerWidth = extW ?? intW ?? 0;
  }

  if (!hasExternalFootprint) {
    warnings.push(
      "External footprint was not provided; space clearance was calculated using internal dimensions. True footprint may be larger due to wall thickness, rims, and handles."
    );
  }

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

  const clearanceLength = sLength - containerLength;
  const clearanceWidth = sWidth - containerWidth;
  const clearanceHeight = sHeight - containerHeight;

  if (hasValidDimensions) {
    if (clearanceLength < 0) {
      warnings.push(`Container exceeds available Length by ${Math.abs(clearanceLength)} cm.`);
    } else if (clearanceLength === 0) {
      warnings.push(
        "Zero clearance for Length; container fits flush against walls with no margin for airflow or handling."
      );
    } else if (clearanceLength < 10) {
      warnings.push(
        `Tight clearance for Length (${clearanceLength} cm remaining); may hinder airflow or access.`
      );
    }

    if (clearanceWidth < 0) {
      warnings.push(`Container exceeds available Width by ${Math.abs(clearanceWidth)} cm.`);
    } else if (clearanceWidth === 0) {
      warnings.push(
        "Zero clearance for Width; container fits flush against walls with no margin for airflow or handling."
      );
    } else if (clearanceWidth < 10) {
      warnings.push(
        `Tight clearance for Width (${clearanceWidth} cm remaining); may hinder airflow or access.`
      );
    }

    if (clearanceHeight < 0) {
      warnings.push(`Container exceeds available Height by ${Math.abs(clearanceHeight)} cm.`);
    } else if (clearanceHeight === 0) {
      warnings.push(
        "Zero clearance for Height; container touches maximum ceiling/railing height, restricting lid access."
      );
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
