import { describe, it, expect, beforeEach } from "vitest";
import { marketplaceService } from "../src/services/marketplace.service";

describe("Marketplace Service (Task 3)", () => {
  beforeEach(() => {
    marketplaceService.clearMemory();
  });

  describe("Listings Management", () => {
    it("returns active listings by default for public browsing", async () => {
      const listings = await marketplaceService.getListings();
      expect(listings.length).toBeGreaterThanOrEqual(4);
      expect(listings.every((l) => l.status === "active")).toBe(true);
    });

    it("filters listings by compost type, price, and city", async () => {
      const vermiListings = await marketplaceService.getListings({
        compostType: "vermicompost",
      });
      expect(vermiListings.length).toBeGreaterThan(0);
      expect(vermiListings.every((l) => l.compostType === "vermicompost")).toBe(true);

      const freeListings = await marketplaceService.getListings({
        priceFilter: "free",
      });
      expect(freeListings.length).toBeGreaterThan(0);
      expect(freeListings.every((l) => l.isFree || l.priceInr === 0)).toBe(true);

      const puneListings = await marketplaceService.getListings({ city: "Pune" });
      expect(puneListings.length).toBeGreaterThan(0);
      expect(puneListings.every((l) => l.city.toLowerCase().includes("pune"))).toBe(true);
    });

    it("allows authenticated sellers to create new listings", async () => {
      const created = await marketplaceService.createListing(
        {
          title: "Fresh Home Vermicompost Batch #4",
          description: "High nitrogen worm humus, perfect for leafy greens.",
          compostType: "vermicompost",
          priceInr: 100,
          quantity: 4,
          unit: "kg",
          locality: "Whitefield",
          city: "Bengaluru",
          fulfillmentType: "pickup_only",
        },
        "test-seller-123",
        "Kiran Kumar"
      );

      expect(created.id).toBeDefined();
      expect(created.sellerId).toBe("test-seller-123");
      expect(created.status).toBe("active");

      const fetched = await marketplaceService.getListingById(created.id);
      expect(fetched?.title).toBe("Fresh Home Vermicompost Batch #4");
    });

    it("rejects listing creation if seller is unauthenticated", async () => {
      await expect(
        marketplaceService.createListing(
          {
            title: "Anonymous Listing",
            description: "No seller id provided",
            compostType: "kitchen_waste",
            priceInr: 0,
            quantity: 1,
            unit: "kg",
            locality: "Test",
            city: "Test",
            fulfillmentType: "both",
          },
          "", // unauthenticated
          ""
        )
      ).rejects.toThrow(/authentication required/i);
    });

    it("allows seller to update their own listing and mark as sold", async () => {
      const created = await marketplaceService.createListing(
        {
          title: "Potting Mix with Compost",
          description: "Rich organic mix for balcony herbs",
          compostType: "garden_compost",
          priceInr: 120,
          quantity: 2,
          unit: "bags",
          locality: "Jayanagar",
          city: "Bengaluru",
          fulfillmentType: "both",
        },
        "seller-user-abc",
        "Deepa"
      );

      const sold = await marketplaceService.markAsSold(created.id, "seller-user-abc");
      expect(sold.status).toBe("sold");

      // Verify that public browse excludes sold listings
      const publicListings = await marketplaceService.getListings();
      expect(publicListings.find((l) => l.id === created.id)).toBeUndefined();
    });

    it("prevents non-owners from editing or deleting listings", async () => {
      const created = await marketplaceService.createListing(
        {
          title: "Organic Compost",
          description: "Owner is user-1",
          compostType: "vermicompost",
          priceInr: 50,
          quantity: 1,
          unit: "kg",
          locality: "Area",
          city: "City",
          fulfillmentType: "pickup_only",
        },
        "user-1",
        "User 1"
      );

      await expect(
        marketplaceService.updateListing(created.id, { priceInr: 20 }, "intruder-user")
      ).rejects.toThrow(/unauthorized/i);

      await expect(
        marketplaceService.deleteListing(created.id, "intruder-user")
      ).rejects.toThrow(/unauthorized/i);
    });
  });

  describe("Inquiry System", () => {
    it("allows authenticated buyer to submit an inquiry to the seller", async () => {
      const inquiry = await marketplaceService.createInquiry(
        {
          listingId: "mkt-list-1",
          sellerId: "seller-user-1",
          buyerName: "Meera Sen",
          buyerContact: "meera@example.com",
          message: "Can I pick up 2kg tomorrow evening?",
        },
        "buyer-user-xyz"
      );

      expect(inquiry.id).toBeDefined();
      expect(inquiry.buyerId).toBe("buyer-user-xyz");
      expect(inquiry.sellerId).toBe("seller-user-1");
      expect(inquiry.status).toBe("unread");

      // Verify seller can retrieve the inquiry
      const sellerInquiries = await marketplaceService.getInquiriesForUser("seller-user-1", "seller");
      expect(sellerInquiries.find((i) => i.id === inquiry.id)).toBeDefined();

      // Verify unrelated user cannot see it
      const strangerInquiries = await marketplaceService.getInquiriesForUser("stranger-user", "all");
      expect(strangerInquiries.find((i) => i.id === inquiry.id)).toBeUndefined();
    });

    it("prevents inquiries on inactive or sold listings", async () => {
      const listing = await marketplaceService.createListing(
        {
          title: "Temporary Compost",
          description: "Will be sold immediately",
          compostType: "vermicompost",
          priceInr: 50,
          quantity: 1,
          unit: "kg",
          locality: "Area",
          city: "City",
          fulfillmentType: "pickup_only",
        },
        "seller-user-99",
        "Seller 99"
      );

      await marketplaceService.markAsSold(listing.id, "seller-user-99");

      await expect(
        marketplaceService.createInquiry(
          {
            listingId: listing.id,
            sellerId: "seller-user-99",
            buyerName: "Buyer",
            buyerContact: "buyer@test.com",
            message: "Still available?",
          },
          "buyer-123"
        )
      ).rejects.toThrow(/no longer active/i);
    });

    it("prevents sellers from inquiring about their own listing", async () => {
      await expect(
        marketplaceService.createInquiry(
          {
            listingId: "mkt-list-1",
            sellerId: "seller-user-1",
            buyerName: "Self",
            buyerContact: "self@test.com",
            message: "Talking to myself",
          },
          "seller-user-1" // same user as seller
        )
      ).rejects.toThrow(/cannot inquire about your own listing/i);
    });
  });
});
