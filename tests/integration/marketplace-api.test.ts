import { describe, it, expect, beforeEach } from "vitest";
import { marketplaceService } from "@cust-post/backend";
import { GET as getListings, POST as postListing } from "@/app/api/marketplace/listings/route";
import { GET as getListingDetail, PATCH as patchListing, DELETE as deleteListing } from "@/app/api/marketplace/listings/[id]/route";
import { GET as getInquiries, POST as postInquiry } from "@/app/api/marketplace/inquiries/route";
import { GET as getSeeds } from "@/app/api/marketplace/seeds/route";
import { NextRequest } from "next/server";

describe("Marketplace API Routes Integration (Task 3)", () => {
  beforeEach(() => {
    marketplaceService.clearMemory();
  });

  describe("Listings API (/api/marketplace/listings)", () => {
    it("GET /api/marketplace/listings returns active community listings", async () => {
      const req = new NextRequest("http://localhost:3000/api/marketplace/listings");
      const res = await getListings(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.listings.length).toBeGreaterThanOrEqual(4);
    });

    it("GET /api/marketplace/listings filters by compostType and priceFilter", async () => {
      const req = new NextRequest(
        "http://localhost:3000/api/marketplace/listings?compostType=vermicompost&priceFilter=paid"
      );
      const res = await getListings(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.listings.every((l: any) => l.compostType === "vermicompost")).toBe(true);
    });

    it("POST /api/marketplace/listings creates a listing when authenticated", async () => {
      const payload = {
        title: "5kg Terrace Vermicompost",
        description: "Dark sifted vermicompost ready for potting.",
        compostType: "vermicompost",
        priceInr: 150,
        isFree: false,
        quantity: 5,
        unit: "kg",
        locality: "HSR Layout",
        city: "Bengaluru",
        fulfillmentType: "both",
      };

      const req = new NextRequest("http://localhost:3000/api/marketplace/listings", {
        method: "POST",
        headers: {
          "x-user-id": "test-seller-auth-1",
          "x-user-name": "Aarav Sharma",
        },
        body: JSON.stringify(payload),
      });

      const res = await postListing(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.listing.title).toBe("5kg Terrace Vermicompost");
      expect(json.listing.sellerId).toBe("test-seller-auth-1");
    });

    it("POST /api/marketplace/listings returns 401 when user is not authenticated", async () => {
      const payload = {
        title: "Guest Compost Offer",
        description: "Attempting to post without auth credentials.",
        compostType: "kitchen_waste",
        priceInr: 0,
        quantity: 5,
        unit: "kg",
        locality: "Locality",
        city: "City",
        fulfillmentType: "pickup_only",
      };

      const req = new NextRequest("http://localhost:3000/api/marketplace/listings", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const res = await postListing(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.error).toBe("Authentication required");
    });

    it("POST /api/marketplace/listings returns 400 when validation fails", async () => {
      const req = new NextRequest("http://localhost:3000/api/marketplace/listings", {
        method: "POST",
        headers: { "x-user-id": "seller-123" },
        body: JSON.stringify({
          title: "Hi", // too short
          compostType: "invalid",
        }),
      });

      const res = await postListing(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("Validation failed");
    });
  });

  describe("Listing Detail & Modification API (/api/marketplace/listings/[id])", () => {
    it("GET /api/marketplace/listings/[id] returns listing details", async () => {
      const req = new NextRequest("http://localhost:3000/api/marketplace/listings/mkt-list-1");
      const res = await getListingDetail(req, {
        params: Promise.resolve({ id: "mkt-list-1" }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.listing.id).toBe("mkt-list-1");
    });

    it("PATCH /api/marketplace/listings/[id] updates listing for authenticated owner", async () => {
      // First create a listing
      const created = await marketplaceService.createListing(
        {
          title: "My Garden Humus",
          description: "Made from garden leaves",
          compostType: "garden_compost",
          priceInr: 100,
          quantity: 2,
          unit: "bags",
          locality: "Koramangala",
          city: "Bengaluru",
          fulfillmentType: "pickup_only",
        },
        "owner-user-77",
        "Owner Name"
      );

      const req = new NextRequest(`http://localhost:3000/api/marketplace/listings/${created.id}`, {
        method: "PATCH",
        headers: { "x-user-id": "owner-user-77" },
        body: JSON.stringify({ status: "sold" }),
      });

      const res = await patchListing(req, {
        params: Promise.resolve({ id: created.id }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.listing.status).toBe("sold");
    });

    it("PATCH /api/marketplace/listings/[id] returns 403 when non-owner attempts update", async () => {
      const created = await marketplaceService.createListing(
        {
          title: "Protected Listing",
          description: "Owner is owner-99",
          compostType: "vermicompost",
          priceInr: 50,
          quantity: 1,
          unit: "kg",
          locality: "Locality",
          city: "City",
          fulfillmentType: "pickup_only",
        },
        "owner-99",
        "Owner"
      );

      const req = new NextRequest(`http://localhost:3000/api/marketplace/listings/${created.id}`, {
        method: "PATCH",
        headers: { "x-user-id": "unauthorized-stranger" },
        body: JSON.stringify({ priceInr: 10 }),
      });

      const res = await patchListing(req, {
        params: Promise.resolve({ id: created.id }),
      });

      expect(res.status).toBe(403);
    });

    it("DELETE /api/marketplace/listings/[id] marks listing as removed", async () => {
      const created = await marketplaceService.createListing(
        {
          title: "To Be Deleted",
          description: "Description here",
          compostType: "kitchen_waste",
          priceInr: 0,
          quantity: 1,
          unit: "kg",
          locality: "Locality",
          city: "City",
          fulfillmentType: "pickup_only",
        },
        "owner-del-1",
        "Owner"
      );

      const req = new NextRequest(`http://localhost:3000/api/marketplace/listings/${created.id}`, {
        method: "DELETE",
        headers: { "x-user-id": "owner-del-1" },
      });

      const res = await deleteListing(req, {
        params: Promise.resolve({ id: created.id }),
      });

      expect(res.status).toBe(200);
      const fetched = await marketplaceService.getListingById(created.id);
      expect(fetched?.status).toBe("removed");
    });
  });

  describe("Inquiries API (/api/marketplace/inquiries)", () => {
    it("POST /api/marketplace/inquiries saves private buyer inquiry", async () => {
      const req = new NextRequest("http://localhost:3000/api/marketplace/inquiries", {
        method: "POST",
        headers: { "x-user-id": "buyer-test-456" },
        body: JSON.stringify({
          listingId: "mkt-list-1",
          sellerId: "seller-user-1",
          buyerName: "Kavita Rao",
          buyerContact: "kavita@example.com",
          message: "Can I collect 5kg this Saturday morning?",
        }),
      });

      const res = await postInquiry(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.inquiry.buyerId).toBe("buyer-test-456");
      expect(json.inquiry.status).toBe("unread");
    });

    it("POST /api/marketplace/inquiries returns 401 when buyer is not authenticated", async () => {
      const req = new NextRequest("http://localhost:3000/api/marketplace/inquiries", {
        method: "POST",
        body: JSON.stringify({
          listingId: "mkt-list-1",
          sellerId: "seller-user-1",
          buyerName: "Guest",
          buyerContact: "guest@example.com",
          message: "Hello",
        }),
      });

      const res = await postInquiry(req);
      expect(res.status).toBe(401);
    });

    it("GET /api/marketplace/inquiries retrieves inquiries for the seller", async () => {
      // First create inquiry
      await marketplaceService.createInquiry(
        {
          listingId: "mkt-list-1",
          sellerId: "seller-user-1",
          buyerName: "Buyer A",
          buyerContact: "buyera@example.com",
          message: "Is this still available?",
        },
        "buyer-a"
      );

      const req = new NextRequest("http://localhost:3000/api/marketplace/inquiries?role=seller", {
        headers: { "x-user-id": "seller-user-1" },
      });

      const res = await getInquiries(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.inquiries.length).toBeGreaterThan(0);
      expect(json.inquiries[0].sellerId).toBe("seller-user-1");
    });
  });

  describe("Seeds Catalogue API (/api/marketplace/seeds)", () => {
    it("GET /api/marketplace/seeds returns external seed products with safety metadata", async () => {
      const req = new NextRequest("http://localhost:3000/api/marketplace/seeds");
      const res = await getSeeds(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.products.length).toBeGreaterThanOrEqual(6);
      expect(json.meta.disclaimer).toBeDefined();
    });

    it("GET /api/marketplace/seeds filters by category", async () => {
      const req = new NextRequest("http://localhost:3000/api/marketplace/seeds?category=herb");
      const res = await getSeeds(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.products.every((p: any) => p.category === "herb")).toBe(true);
    });
  });
});
