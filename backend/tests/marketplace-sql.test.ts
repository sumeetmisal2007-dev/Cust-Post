import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Marketplace & External Seed Store Migration & RLS (Task 1)", () => {
  const migrationPath = path.resolve(
    __dirname,
    "../../supabase/migrations/20261018000004_marketplace.sql"
  );

  const sql = fs.readFileSync(migrationPath, "utf-8");

  describe("Schema Definitions", () => {
    it("defines public.compost_listings table with required columns and constraints", () => {
      expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS public\.compost_listings/i);
      expect(sql).toMatch(/seller_id UUID NOT NULL REFERENCES auth\.users\(id\) ON DELETE CASCADE/i);
      expect(sql).toMatch(/compost_type TEXT NOT NULL CHECK/i);
      expect(sql).toMatch(/price_inr NUMERIC\(10, 2\) NOT NULL DEFAULT 0\.00 CHECK \(price_inr >= 0\)/i);
      expect(sql).toMatch(/quantity NUMERIC\(10, 2\) NOT NULL CHECK \(quantity > 0\)/i);
      expect(sql).toMatch(/unit TEXT NOT NULL CHECK/i);
      expect(sql).toMatch(/fulfillment_type TEXT NOT NULL CHECK/i);
      expect(sql).toMatch(/status TEXT NOT NULL DEFAULT 'active' CHECK \(status IN \('active', 'sold', 'removed'\)\)/i);
    });

    it("defines public.marketplace_inquiries table with private buyer & seller linkage", () => {
      expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS public\.marketplace_inquiries/i);
      expect(sql).toMatch(/listing_id UUID NOT NULL REFERENCES public\.compost_listings\(id\) ON DELETE CASCADE/i);
      expect(sql).toMatch(/buyer_id UUID NOT NULL REFERENCES auth\.users\(id\) ON DELETE CASCADE/i);
      expect(sql).toMatch(/seller_id UUID NOT NULL REFERENCES auth\.users\(id\) ON DELETE CASCADE/i);
      expect(sql).toMatch(/buyer_contact TEXT NOT NULL/i);
      expect(sql).toMatch(/message TEXT NOT NULL/i);
    });

    it("defines public.external_seed_products table with required metadata", () => {
      expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS public\.external_seed_products/i);
      expect(sql).toMatch(/category TEXT NOT NULL CHECK \(category IN \('vegetable', 'fruit', 'herb', 'flower'\)\)/i);
      expect(sql).toMatch(/retailer_name TEXT NOT NULL/i);
      expect(sql).toMatch(/product_url TEXT NOT NULL/i);
      expect(sql).toMatch(/source_attribution TEXT NOT NULL/i);
      expect(sql).toMatch(/last_verified_date DATE NOT NULL/i);
      expect(sql).toMatch(/is_active BOOLEAN NOT NULL DEFAULT true/i);
    });

    it("defines essential indexes for performant querying", () => {
      expect(sql).toMatch(/CREATE INDEX IF NOT EXISTS idx_compost_listings_seller/i);
      expect(sql).toMatch(/CREATE INDEX IF NOT EXISTS idx_compost_listings_status/i);
      expect(sql).toMatch(/CREATE INDEX IF NOT EXISTS idx_compost_listings_type/i);
      expect(sql).toMatch(/CREATE INDEX IF NOT EXISTS idx_inquiries_buyer/i);
      expect(sql).toMatch(/CREATE INDEX IF NOT EXISTS idx_inquiries_seller/i);
      expect(sql).toMatch(/CREATE INDEX IF NOT EXISTS idx_seed_products_category/i);
    });
  });

  describe("Row Level Security Policies", () => {
    it("enables RLS on all three tables", () => {
      expect(sql).toMatch(/ALTER TABLE public\.compost_listings ENABLE ROW LEVEL SECURITY/i);
      expect(sql).toMatch(/ALTER TABLE public\.marketplace_inquiries ENABLE ROW LEVEL SECURITY/i);
      expect(sql).toMatch(/ALTER TABLE public\.external_seed_products ENABLE ROW LEVEL SECURITY/i);
    });

    it("restricts public compost listings to active status, or seller's own listings", () => {
      expect(sql).toMatch(/CREATE POLICY "Public can view active compost listings"[\s\S]*?status = 'active' OR auth\.uid\(\) = seller_id/i);
    });

    it("enforces seller ownership on listing insertions, updates and deletions", () => {
      expect(sql).toMatch(/CREATE POLICY "Authenticated users can create compost listings"[\s\S]*?auth\.uid\(\) = seller_id/i);
      expect(sql).toMatch(/CREATE POLICY "Users can update their own compost listings"[\s\S]*?auth\.uid\(\) = seller_id/i);
      expect(sql).toMatch(/CREATE POLICY "Users can delete their own compost listings"[\s\S]*?auth\.uid\(\) = seller_id/i);
    });

    it("guarantees inquiries are private between buyer and seller", () => {
      expect(sql).toMatch(/CREATE POLICY "Buyers and sellers can view their own inquiries"[\s\S]*?auth\.uid\(\) = buyer_id OR auth\.uid\(\) = seller_id/i);
      expect(sql).toMatch(/CREATE POLICY "Authenticated users can create inquiries for active listings"[\s\S]*?auth\.uid\(\) = buyer_id AND auth\.uid\(\) != seller_id/i);
    });

    it("allows public read-only access strictly to active seed products", () => {
      expect(sql).toMatch(/CREATE POLICY "Public can view active seed products"[\s\S]*?is_active = true/i);
    });
  });
});
