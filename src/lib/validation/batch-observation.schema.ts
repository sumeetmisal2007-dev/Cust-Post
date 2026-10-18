import { z } from "zod";

export const moistureLevelEnum = z.enum(["dry", "ideal", "too_wet"]);

export const odourTypeEnum = z.enum(["earthy", "none", "sour", "ammonia"]);

export const pestTypeEnum = z.enum([
  "none",
  "fruit_flies",
  "maggots",
  "rodents",
  "ants",
  "cockroaches",
]);

export const dataStatusEnum = z.enum(["measured", "estimated", "user_reported", "unknown"]);

export const batchObservationSchema = z.object({
  batchId: z.string().min(1, "Batch ID is required"),
  timestamp: z.string().datetime({ message: "Valid ISO timestamp is required" }),
  moisture: moistureLevelEnum,
  odour: odourTypeEnum,
  temperatureC: z.number().nullable().optional(),
  temperatureStatus: dataStatusEnum.default("unknown"),
  turnedToday: z.boolean().default(false),
  pestsObserved: pestTypeEnum.default("none"),
  wasteAddedKg: z.number().nonnegative().optional(),
  wasteAdditionStatus: dataStatusEnum.optional(),
  notes: z.string().max(1000).optional(),
});

export const physicalMaturityChecklistSchema = z.object({
  darkCrumblyTexture: z.boolean().refine((val) => val === true, {
    message: "Compost must have dark crumbly soil-like texture",
  }),
  earthyOdorNoRot: z.boolean().refine((val) => val === true, {
    message: "Compost must have earthy pleasant smell with no rotting odor",
  }),
  ambientTemperature: z.boolean().refine((val) => val === true, {
    message: "Compost pile must have dropped to ambient outdoor temperature",
  }),
  foodScrapsDecomposed: z.boolean().refine((val) => val === true, {
    message: "All original food scraps must be completely decomposed",
  }),
});

export type BatchObservationFormValues = z.infer<typeof batchObservationSchema>;
export type PhysicalMaturityChecklistValues = z.infer<typeof physicalMaturityChecklistSchema>;
