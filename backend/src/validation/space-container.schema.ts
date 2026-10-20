import { z } from "zod";

export const locationTypeEnum = z.enum(["indoor", "balcony", "terrace", "garden"]);

export const containerShapeEnum = z.enum(["rectangular", "cylindrical", "irregular"]);

export const containerMaterialEnum = z.enum([
  "plastic_bucket",
  "terracotta",
  "wooden_crate",
  "metal_drum",
  "mesh_wire",
  "other",
]);

export const previousUseEnum = z.enum([
  "food",
  "paint_chemicals",
  "soil_garden",
  "new_unused",
  "unknown",
]);

export const containerConditionEnum = z.enum([
  "good",
  "cracked_damaged",
  "uncleanable_residue",
]);

export const foodGradeStatusEnum = z.enum(["food_grade", "non_food_grade", "unknown"]);

export const spaceProfileSchema = z.object({
  locationType: locationTypeEnum,
  lengthCm: z
    .number({ message: "Length must be a number" })
    .positive("Length must be greater than 0"),
  widthCm: z
    .number({ message: "Width must be a number" })
    .positive("Width must be greater than 0"),
  maxHeightCm: z
    .number({ message: "Height must be a number" })
    .positive("Height must be greater than 0"),
});

export const containerCheckSchema = z
  .object({
    shape: containerShapeEnum,
    internalLengthCm: z.number().positive("Internal length must be positive").optional(),
    internalWidthCm: z.number().positive("Internal width must be positive").optional(),
    internalHeightCm: z.number().positive("Internal height must be positive"),
    diameterCm: z.number().positive("Diameter must be positive").optional(),
    externalLengthCm: z.number().positive("External length must be positive").optional(),
    externalWidthCm: z.number().positive("External width must be positive").optional(),
    externalHeightCm: z.number().positive("External height must be positive").optional(),
    externalDiameterCm: z.number().positive("External diameter must be positive").optional(),
    material: containerMaterialEnum,
    previousUse: previousUseEnum,
    condition: containerConditionEnum,
    hasLid: z.boolean(),
    hasVentilationHoles: z.boolean(),
    hasDrainageHoles: z.boolean(),
    isFoodGrade: foodGradeStatusEnum.default("unknown"),
  })
  .superRefine((data, ctx) => {
    if (data.shape === "rectangular") {
      if (!data.internalLengthCm || data.internalLengthCm <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Internal length is required for rectangular containers",
          path: ["internalLengthCm"],
        });
      }
      if (!data.internalWidthCm || data.internalWidthCm <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Internal width is required for rectangular containers",
          path: ["internalWidthCm"],
        });
      }
    } else if (data.shape === "cylindrical") {
      if (!data.diameterCm || data.diameterCm <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Diameter is required for cylindrical containers",
          path: ["diameterCm"],
        });
      }
    } else if (data.shape === "irregular") {
      if (!data.internalLengthCm || data.internalLengthCm <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Footprint length is required for irregular containers",
          path: ["internalLengthCm"],
        });
      }
      if (!data.internalWidthCm || data.internalWidthCm <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Footprint width is required for irregular containers",
          path: ["internalWidthCm"],
        });
      }
    }
  });

export type SpaceProfileFormValues = z.infer<typeof spaceProfileSchema>;
export type ContainerCheckFormValues = z.input<typeof containerCheckSchema>;
