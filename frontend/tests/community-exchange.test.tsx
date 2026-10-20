import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { communityService, INITIAL_COMMUNITY_LISTINGS } from "@cust-post/backend";
import CommunityExchangePage from "@/app/(app)/community/page";

describe("Feature 4: Community Soil & Seed Exchange", () => {
  describe("CommunityService", () => {
    it("returns initial community exchange listings", async () => {
      const listings = await communityService.getListings();
      expect(listings.length).toBeGreaterThanOrEqual(INITIAL_COMMUNITY_LISTINGS.length);
    });

    it("filters listings by category", async () => {
      const compostListings = await communityService.getListings("surplus_compost");
      expect(compostListings.every((item) => item.category === "surplus_compost")).toBe(true);
      expect(compostListings.length).toBeGreaterThanOrEqual(1);

      const seedListings = await communityService.getListings("seeds_cuttings");
      expect(seedListings.every((item) => item.category === "seeds_cuttings")).toBe(true);
      expect(seedListings.length).toBeGreaterThanOrEqual(1);
    });

    it("filters listings by search query across city or locality", async () => {
      const blrListings = await communityService.getListings("all", "Bengaluru");
      expect(blrListings.some((item) => item.city === "Bengaluru")).toBe(true);
    });

    it("creates and retrieves a new share listing", async () => {
      const newListing = await communityService.createListing({
        title: "Test 10L Aerobic Compost",
        category: "surplus_compost",
        description: "Dark and rich compost batch",
        neighborhood: "Whitefield",
        city: "Bengaluru",
        contactMethod: "whatsapp",
        contactHandle: "+91 99999 88888",
      });

      expect(newListing.id).toBeDefined();
      expect(newListing.title).toBe("Test 10L Aerobic Compost");

      const allListings = await communityService.getListings();
      expect(allListings.some((item) => item.id === newListing.id)).toBe(true);
    });
  });

  describe("CommunityExchangePage Component", () => {
    it("renders page title, category tabs, and post listing action", async () => {
      render(<CommunityExchangePage />);

      expect(screen.getByText(/urban compost & seed exchange/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /all items/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /surplus compost/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /seeds & cuttings/i })).toBeInTheDocument();

      const postBtns = screen.getAllByRole("button", { name: /post a share listing/i });
      expect(postBtns.length).toBeGreaterThanOrEqual(1);
    });

    it("renders contact neighbor buttons for listings", async () => {
      render(<CommunityExchangePage />);

      await waitFor(() => {
        const contactLinks = screen.getAllByRole("link", { name: /contact neighbor/i });
        expect(contactLinks.length).toBeGreaterThan(0);
      });
    });
  });
});
