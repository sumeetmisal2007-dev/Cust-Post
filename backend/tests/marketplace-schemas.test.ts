import { describe, it, expect } from "vitest";
import {
  createCompostListingSchema,
  updateCompostListingSchema,
  createInquirySchema,
} from "../src/validation/marketplace.schema";

describe("Marketplace Validation Schemas (Task 2)", () => {
  describe("createCompostListingSchema", () => {
    it("validates and parses valid compost listing input", () => {
      const valid = {
        title: "Rich Vermicompost worm castings",
        description: "100% organic tea-cured vermicompost, balanced and sifted.",
        compostType: "vermicompost",
        priceInr: 150,
        isFree: false,
        quantity: 5,
        unit: "kg",
        imageUrl: "/images/marketplace/cust-post-vermicompost-5kg.png",
        locality: "Koramangala",
        city: "Bengaluru",
        fulfillmentType: "both",
      };

      const result = createCompostListingSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.priceInr).toBe(150);
        expect(result.data.compostType).toBe("vermicompost");
        expect(result.data.imageUrl).toBe("/images/marketplace/cust-post-vermicompost-5kg.png");
      }
    });

    it("automatically resets price to 0 when isFree is true", () => {
      const input = {
        title: "Free surplus kitchen compost",
        description: "Freshly aerated compost ready for pickup.",
        compostType: "kitchen_waste",
        priceInr: 200, // provided price but marked free
        isFree: true,
        quantity: 10,
        unit: "kg",
        locality: "Indiranagar",
        city: "Bengaluru",
        fulfillmentType: "pickup_only",
      };

      const result = createCompostListingSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.priceInr).toBe(0);
        expect(result.data.isFree).toBe(true);
      }
    });

    it("rejects invalid inputs with helpful error messages", () => {
      const invalid = {
        title: "Hi", // too short
        description: "Short", // too short
        compostType: "toxic_waste", // invalid enum
        priceInr: -50, // negative price
        quantity: 0, // must be positive
        unit: "pounds", // invalid unit
        locality: "", // empty
        city: "", // empty
        fulfillmentType: "teleportation", // invalid enum
      };

      const result = createCompostListingSchema.safeParse(invalid);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMap = result.error.flatten().fieldErrors;
        expect(errorMap.title).toBeDefined();
        expect(errorMap.description).toBeDefined();
        expect(errorMap.compostType).toBeDefined();
        expect(errorMap.priceInr).toBeDefined();
        expect(errorMap.quantity).toBeDefined();
        expect(errorMap.unit).toBeDefined();
        expect(errorMap.locality).toBeDefined();
        expect(errorMap.fulfillmentType).toBeDefined();
      }
    });
  });

  describe("updateCompostListingSchema", () => {
    it("allows updating partial fields including status to sold or removed", () => {
      const updateData = {
        status: "sold",
        priceInr: 120,
      };

      const result = updateCompostListingSchema.safeParse(updateData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe("sold");
        expect(result.data.priceInr).toBe(120);
      }
    });
  });

  describe("createInquirySchema", () => {
    it("validates genuine buyer inquiry input", () => {
      const validInquiry = {
        listingId: "list-12345",
        sellerId: "user-67890",
        buyerName: "Priya Sharma",
        buyerContact: "priya.sharma@example.com",
        message: "Hi, is this 5kg vermicompost still available for balcony pickup?",
      };

      const result = createInquirySchema.safeParse(validInquiry);
      expect(result.success).toBe(true);
    });

    it("rejects blank buyer contacts or empty message", () => {
      const invalidInquiry = {
        listingId: "list-12345",
        sellerId: "user-67890",
        buyerName: "A", // too short
        buyerContact: "", // missing
        message: "Hi", // too short
      };

      const result = createInquirySchema.safeParse(invalidInquiry);
      expect(result.success).toBe(false);
    });
  });
});
