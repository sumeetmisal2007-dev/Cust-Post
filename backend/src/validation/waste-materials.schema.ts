import { z } from "zod";

export const wasteCategoryEnum = z.enum(["greens", "browns", "caution", "excluded"]);

export const wasteUnitEnum = z.enum(["kg", "litres"]);

export const wasteInputItemSchema = z.object({
  category: wasteCategoryEnum,
  name: z.string().min(1, "Item name is required"),
  quantityWeekly: z.number().positive("Quantity must be greater than 0"),
  unit: wasteUnitEnum.default("kg"),
});

export const wasteInventorySchema = z.object({
  items: z.array(wasteInputItemSchema).min(1, "At least one organic waste item is required"),
});

export type WasteInputItemFormValues = z.infer<typeof wasteInputItemSchema>;
export type WasteInventoryFormValues = z.infer<typeof wasteInventorySchema>;
