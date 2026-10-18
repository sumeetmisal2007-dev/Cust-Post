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

export function calculateGeometricVolume(dim: ContainerDimensions): GeometricVolumeResult {
  if (dim.shape === "rectangular") {
    if (
      dim.internalLengthCm === undefined ||
      dim.internalWidthCm === undefined ||
      dim.internalHeightCm === undefined
    ) {
      throw new Error("Rectangular container dimensions missing (length, width, or height)");
    }
    const volumeCm3 = dim.internalLengthCm * dim.internalWidthCm * dim.internalHeightCm;
    const volumeLitres = Math.round((volumeCm3 / 1000) * 10) / 10;
    return {
      volumeLitres,
      isApproximate: false,
      disclaimer: GEOMETRIC_VOLUME_DISCLAIMER,
    };
  }

  if (dim.shape === "cylindrical") {
    if (dim.diameterCm === undefined || dim.internalHeightCm === undefined) {
      throw new Error("Cylindrical container dimensions missing (diameter or height)");
    }
    const radius = dim.diameterCm / 2;
    const volumeCm3 = Math.PI * Math.pow(radius, 2) * dim.internalHeightCm;
    const volumeLitres = Math.round((volumeCm3 / 1000) * 10) / 10;
    return {
      volumeLitres,
      isApproximate: false,
      disclaimer: GEOMETRIC_VOLUME_DISCLAIMER,
    };
  }

  // Irregular shape approximation (using 85% bounding box factor)
  const l = dim.internalLengthCm || dim.diameterCm || 30;
  const w = dim.internalWidthCm || dim.diameterCm || 30;
  const h = dim.internalHeightCm;
  const volumeCm3 = l * w * h * 0.85;
  const volumeLitres = Math.round((volumeCm3 / 1000) * 10) / 10;
  return {
    volumeLitres,
    isApproximate: true,
    disclaimer: `${GEOMETRIC_VOLUME_DISCLAIMER} (Approximation for irregular geometry)`,
  };
}

export function validateSpaceFit(
  space: SpaceDimensions,
  container: ContainerDimensions
): SpaceFitResult {
  const containerLength =
    container.shape === "cylindrical"
      ? container.diameterCm || 0
      : container.internalLengthCm || container.diameterCm || 0;

  const containerWidth =
    container.shape === "cylindrical"
      ? container.diameterCm || 0
      : container.internalWidthCm || container.diameterCm || 0;

  const containerHeight = container.internalHeightCm;

  const clearanceLength = space.lengthCm - containerLength;
  const clearanceWidth = space.widthCm - containerWidth;
  const clearanceHeight = space.maxHeightCm - containerHeight;

  const warnings: string[] = [];

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

  const fits = clearanceLength >= 0 && clearanceWidth >= 0 && clearanceHeight >= 0;

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
