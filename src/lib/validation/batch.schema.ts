import { z } from "zod";

export const compostingMethodEnum = z.enum(["aerobic_bin", "vermicomposting", "bokashi"]);
export const batchStatusEnum = z.enum(["active", "curing", "completed", "abandoned"]);

export const createBatchSchema = z.object({
  batchName: z.string().min(1, "Batch name is required").max(100),
  method: compostingMethodEnum,
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
  containerId: z.string().uuid().optional(),
  containerVolumeLitres: z.number().positive().optional(),
  notes: z.string().max(1000).optional(),
});

export type CreateBatchInput = z.infer<typeof createBatchSchema>;
