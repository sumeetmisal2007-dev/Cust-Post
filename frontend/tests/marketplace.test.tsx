import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import MarketplacePage from "@/app/(app)/marketplace/page";
import { CompostCard } from "@/components/marketplace/compost-card";
import { SeedCard } from "@/components/marketplace/seed-card";
import { ContactSellerModal } from "@/components/marketplace/contact-seller-modal";
import { CreateListingModal } from "@/components/marketplace/create-listing-modal";
import { CompostListing, ExternalSeedProduct } from "@cust-post/backend";

// Mock Supabase browser client
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: {
          user: {
            id: "test-user-1",
            email: "gardener@example.com",
            user_metadata: { display_name: "Urban Gardener" },
          },
        },
      }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  }),
}));

const SAMPLE_LISTING: CompostListing = {
  id: "test-list-1",
  sellerId: "test-user-1",
  sellerDisplayName: "Urban Gardener",
  title: "5kg Rich Vermicompost Worm Castings",
  description: "Double-sifted, gentle on roots, ideal for balcony pots.",
  compostType: "vermicompost",
  priceInr: 150,
  isFree: false,
  quantity: 5,
  unit: "kg",
  locality: "Indiranagar",
  city: "Bengaluru",
  fulfillmentType: "both",
  status: "active",
  createdAt: "2026-10-20T10:00:00.000Z",
  updatedAt: "2026-10-20T10:00:00.000Z",
};

const SAMPLE_SEED: ExternalSeedProduct = {
  id: "seed-test-1",
  name: "Spinach / Palak",
  variety: "All Green Spinach (Spinacia oleracea)",
  category: "vegetable",
  retailerName: "TrustBasket",
  productUrl: "https://trustbasket.com/collections/seeds/products/spinach-seeds",
  priceInr: 79,
  currency: "INR",
  sourceAttribution: "TrustBasket India Certified Seeds",
  lastVerifiedDate: "2026-10-15",
  isActive: true,
  description: "Fast-growing leafy spinach for balcony pots.",
};

describe("Marketplace Feature (Task 4 & Task 7)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default fetch mock returning listings and seeds
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/marketplace/listings")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, listings: [SAMPLE_LISTING] }),
        });
      }
      if (url.includes("/api/marketplace/seeds")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, products: [SAMPLE_SEED] }),
        });
      }
      if (url.includes("/api/marketplace/inquiries")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, inquiries: [] }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    });
  });

  describe("Marketplace Page Rendering & Navigation Tabs", () => {
    it("renders page title and primary section tabs", async () => {
      render(<MarketplacePage />);

      expect(
        screen.getByRole("heading", {
          name: /compost marketplace & external seed store/i,
        })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /1\. compost marketplace/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /2\. seeds from online stores/i })
      ).toBeInTheDocument();
    });

    it("switches to seeds section when Seeds tab is clicked", async () => {
      render(<MarketplacePage />);

      const seedsTab = screen.getByRole("button", { name: /2\. seeds from online stores/i });
      fireEvent.click(seedsTab);

      await waitFor(() => {
        expect(screen.getByText(/verified external store links/i)).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /spinach \/ palak/i })).toBeInTheDocument();
      });
    });

    it("renders authentic CUST-POST lab formulation showcase banner with product images", () => {
      render(<MarketplacePage />);
      expect(screen.getByText(/Authentic CUST-POST™ Lab Vermicompost/i)).toBeInTheDocument();
      expect(screen.getByAltText("CUST-POST 5kg Bag")).toBeInTheDocument();
      expect(screen.getByAltText("CUST-POST 250g Jar")).toBeInTheDocument();
      expect(screen.getByAltText("Dark Humus Castings")).toBeInTheDocument();
      expect(screen.getByAltText("Bulk Compost Mound")).toBeInTheDocument();
    });
  });

  describe("CompostCard Component", () => {
    it("displays listing title, price in INR, quantity, locality, and contact button", () => {
      const handleContact = vi.fn();
      const handleViewDetails = vi.fn();

      render(
        <CompostCard
          listing={SAMPLE_LISTING}
          isOwner={false}
          onContact={handleContact}
          onViewDetails={handleViewDetails}
        />
      );

      expect(screen.getByText("5kg Rich Vermicompost Worm Castings")).toBeInTheDocument();
      expect(screen.getAllByText("₹150").length).toBeGreaterThan(0);
      expect(screen.getByText(/5 kg available/i)).toBeInTheDocument();
      expect(screen.getByText(/indiranagar, bengaluru/i)).toBeInTheDocument();

      const contactBtn = screen.getByRole("button", { name: /contact seller/i });
      fireEvent.click(contactBtn);
      expect(handleContact).toHaveBeenCalledWith(SAMPLE_LISTING);
    });

    it("renders owner controls (Edit, Mark Sold) when isOwner is true", () => {
      const handleEdit = vi.fn();
      const handleMarkSold = vi.fn();

      render(
        <CompostCard
          listing={SAMPLE_LISTING}
          isOwner={true}
          onContact={vi.fn()}
          onViewDetails={vi.fn()}
          onEdit={handleEdit}
          onMarkSold={handleMarkSold}
        />
      );

      expect(screen.getByRole("button", { name: /mark sold/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: /mark sold/i }));
      expect(handleMarkSold).toHaveBeenCalledWith(SAMPLE_LISTING);
    });

    it("displays Free badge and price as Free for free listings", () => {
      const freeListing: CompostListing = {
        ...SAMPLE_LISTING,
        isFree: true,
        priceInr: 0,
      };

      render(
        <CompostCard
          listing={freeListing}
          isOwner={false}
          onContact={vi.fn()}
          onViewDetails={vi.fn()}
        />
      );

      expect(screen.getAllByText(/free/i).length).toBeGreaterThan(0);
    });

    it("displays sold state and disables contact button for sold listings", () => {
      const soldListing: CompostListing = {
        ...SAMPLE_LISTING,
        status: "sold",
      };

      render(
        <CompostCard
          listing={soldListing}
          isOwner={false}
          onContact={vi.fn()}
          onViewDetails={vi.fn()}
        />
      );

      expect(screen.getByRole("button", { name: /sold out/i })).toBeDisabled();
    });
  });

  describe("External SeedCard Component", () => {
    it("renders external seed product with safe new-tab link and verified retailer attribution", () => {
      render(<SeedCard product={SAMPLE_SEED} />);

      expect(screen.getByRole("heading", { name: "Spinach / Palak" })).toBeInTheDocument();
      expect(screen.getByText(/all green spinach/i)).toBeInTheDocument();
      expect(screen.getByText("₹79")).toBeInTheDocument();
      expect(screen.getAllByText(/trustbasket/i).length).toBeGreaterThan(0);

      const externalLink = screen.getByRole("link", { name: /view on seller website/i });
      expect(externalLink).toHaveAttribute("href", SAMPLE_SEED.productUrl);
      expect(externalLink).toHaveAttribute("target", "_blank");
      expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("handles missing price gracefully", () => {
      const noPriceSeed: ExternalSeedProduct = {
        ...SAMPLE_SEED,
        priceInr: undefined,
      };

      render(<SeedCard product={noPriceSeed} />);
      expect(screen.getByText(/price on site/i)).toBeInTheDocument();
    });
  });

  describe("Guest Restrictions & Inquiries Auth Gate", () => {
    it("prompts guest to sign in when attempting to contact seller", () => {
      const handleRequireAuth = vi.fn();

      render(
        <ContactSellerModal
          isOpen={true}
          listing={SAMPLE_LISTING}
          onClose={vi.fn()}
          currentUser={null} // Guest user
          onRequireAuth={handleRequireAuth}
        />
      );

      expect(screen.getByText(/sign in required/i)).toBeInTheDocument();
      const signInBtn = screen.getByRole("button", { name: /sign in to message seller/i });
      fireEvent.click(signInBtn);
      expect(handleRequireAuth).toHaveBeenCalled();
    });

    it("allows authenticated buyer to submit private message to seller", async () => {
      const handleSuccess = vi.fn();

      render(
        <ContactSellerModal
          isOpen={true}
          listing={SAMPLE_LISTING}
          onClose={vi.fn()}
          onSuccess={handleSuccess}
          currentUser={{ id: "buyer-id-99", email: "buyer@example.com", name: "Buyer Name" }}
          onRequireAuth={vi.fn()}
        />
      );

      expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/your contact information/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message to seller/i)).toBeInTheDocument();

      const sendBtn = screen.getByRole("button", { name: /send private inquiry/i });
      fireEvent.click(sendBtn);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/marketplace/inquiries",
          expect.objectContaining({
            method: "POST",
          })
        );
      });
    });
  });

  describe("Create Listing Modal Form Validation", () => {
    it("prompts guest to sign in before creating a listing", () => {
      const handleRequireAuth = vi.fn();

      render(
        <CreateListingModal
          isOpen={true}
          onClose={vi.fn()}
          onSuccess={vi.fn()}
          currentUser={null}
          onRequireAuth={handleRequireAuth}
        />
      );

      expect(screen.getByText(/sign in required/i)).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /sign in to post listing/i }));
      expect(handleRequireAuth).toHaveBeenCalled();
    });

    it("validates form fields and submits listing when authenticated", async () => {
      const handleSuccess = vi.fn();

      render(
        <CreateListingModal
          isOpen={true}
          onClose={vi.fn()}
          onSuccess={handleSuccess}
          currentUser={{ id: "seller-id-1", email: "seller@example.com", name: "Sunita" }}
          onRequireAuth={vi.fn()}
        />
      );

      fireEvent.change(screen.getByLabelText(/listing title \*/i), {
        target: { value: "Pure Vermicompost 5kg" },
      });
      fireEvent.change(screen.getByLabelText(/general pickup area \/ neighborhood \*/i), {
        target: { value: "Koramangala" },
      });
      fireEvent.change(screen.getByLabelText(/description & usage recommendations \*/i), {
        target: { value: "Well sifted pure vermicompost for balcony plants." },
      });

      fireEvent.click(screen.getByRole("button", { name: /publish compost listing/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/marketplace/listings",
          expect.objectContaining({
            method: "POST",
          })
        );
      });
    });
  });
});
