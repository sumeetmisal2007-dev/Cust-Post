import { z } from "zod";

export const compostTypeEnum = z.enum([
  "vermicompost",
  "kitchen_waste",
  "garden_compost",
  "bokashi",
  "other",
]);

export const unitEnum = z.enum(["kg", "bags", "litres"]);

export const fulfillmentTypeEnum = z.enum([
  "pickup_only",
  "delivery_available",
  "both",
]);

export const listingStatusEnum = z.enum(["active", "sold", "removed"]);

export const seedCategoryEnum = z.enum(["vegetable", "fruit", "herb", "flower"]);

export const createCompostListingSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title cannot exceed 100 characters"),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .max(2000, "Description cannot exceed 2000 characters"),
    compostType: compostTypeEnum,
    priceInr: z.number().min(0, "Price cannot be negative"),
    isFree: z.boolean().optional().default(false),
    quantity: z.number().positive("Quantity must be greater than zero"),
    unit: unitEnum,
    imageUrl: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")),
    conditionMaturity: z.string().max(200).optional(),
    locality: z
      .string()
      .trim()
      .min(2, "Locality/neighborhood is required")
      .max(100),
    city: z
      .string()
      .trim()
      .min(2, "City is required")
      .max(100),
    fulfillmentType: fulfillmentTypeEnum,
  })
  .transform((data) => {
    if (data.isFree) {
      return { ...data, priceInr: 0 };
    }
    return data;
  });

export type CreateCompostListingSchemaInput = z.input<typeof createCompostListingSchema>;
export type CreateCompostListingSchemaOutput = z.output<typeof createCompostListingSchema>;

export const updateCompostListingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100)
    .optional(),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000)
    .optional(),
  compostType: compostTypeEnum.optional(),
  priceInr: z.number().min(0, "Price cannot be negative").optional(),
  isFree: z.boolean().optional(),
  quantity: z.number().positive("Quantity must be greater than zero").optional(),
  unit: unitEnum.optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  conditionMaturity: z.string().max(200).optional(),
  locality: z.string().trim().min(2).max(100).optional(),
  city: z.string().trim().min(2).max(100).optional(),
  fulfillmentType: fulfillmentTypeEnum.optional(),
  status: listingStatusEnum.optional(),
});

export type UpdateCompostListingSchemaInput = z.infer<typeof updateCompostListingSchema>;

export const createInquirySchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  sellerId: z.string().min(1, "Seller ID is required"),
  buyerName: z
    .string()
    .trim()
    .min(2, "Your name must be at least 2 characters")
    .max(100),
  buyerContact: z
    .string()
    .trim()
    .min(5, "Contact info (email or phone) is required")
    .max(150),
  message: z
    .string()
    .trim()
    .min(5, "Inquiry message must be at least 5 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
});

export type CreateInquirySchemaInput = z.infer<typeof createInquirySchema>;
