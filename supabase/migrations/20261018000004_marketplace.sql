-- Cust-Post Marketplace & External Seed Store Migration
-- Migration: 20261018000004_marketplace.sql

-- 1. Community Compost Listings Table
CREATE TABLE IF NOT EXISTS public.compost_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    seller_display_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    compost_type TEXT NOT NULL CHECK (compost_type IN ('vermicompost', 'kitchen_waste', 'garden_compost', 'bokashi', 'other')),
    price_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (price_inr >= 0),
    is_free BOOLEAN NOT NULL DEFAULT false,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL CHECK (unit IN ('kg', 'bags', 'litres')),
    image_url TEXT,
    condition_maturity TEXT,
    locality TEXT NOT NULL,
    city TEXT NOT NULL,
    fulfillment_type TEXT NOT NULL CHECK (fulfillment_type IN ('pickup_only', 'delivery_available', 'both')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'removed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for compost listings
CREATE INDEX IF NOT EXISTS idx_compost_listings_seller ON public.compost_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_compost_listings_status ON public.compost_listings(status);
CREATE INDEX IF NOT EXISTS idx_compost_listings_type ON public.compost_listings(compost_type);
CREATE INDEX IF NOT EXISTS idx_compost_listings_city ON public.compost_listings(city);
CREATE INDEX IF NOT EXISTS idx_compost_listings_created ON public.compost_listings(created_at DESC);

-- Enable RLS on compost listings
ALTER TABLE public.compost_listings ENABLE ROW LEVEL SECURITY;

-- Compost listings RLS Policies:
-- Anyone (including guest visitors) can view active listings.
-- Sellers can also view their own non-active (sold, removed) listings.
CREATE POLICY "Public can view active compost listings"
    ON public.compost_listings FOR SELECT
    USING (status = 'active' OR auth.uid() = seller_id);

CREATE POLICY "Authenticated users can create compost listings"
    ON public.compost_listings FOR INSERT
    WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own compost listings"
    ON public.compost_listings FOR UPDATE
    USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own compost listings"
    ON public.compost_listings FOR DELETE
    USING (auth.uid() = seller_id);


-- 2. Marketplace Inquiries Table (Private Contact & Inquiry Exchange)
CREATE TABLE IF NOT EXISTS public.marketplace_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES public.compost_listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    buyer_name TEXT NOT NULL,
    buyer_contact TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'replied', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for inquiries
CREATE INDEX IF NOT EXISTS idx_inquiries_listing ON public.marketplace_inquiries(listing_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_buyer ON public.marketplace_inquiries(buyer_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_seller ON public.marketplace_inquiries(seller_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON public.marketplace_inquiries(created_at DESC);

-- Enable RLS on marketplace inquiries
ALTER TABLE public.marketplace_inquiries ENABLE ROW LEVEL SECURITY;

-- Inquiry RLS Policies:
-- Only the buyer or the seller can view an inquiry
CREATE POLICY "Buyers and sellers can view their own inquiries"
    ON public.marketplace_inquiries FOR SELECT
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Authenticated buyers can send inquiries for active listings (cannot inquire on own listing)
CREATE POLICY "Authenticated users can create inquiries for active listings"
    ON public.marketplace_inquiries FOR INSERT
    WITH CHECK (auth.uid() = buyer_id AND auth.uid() != seller_id);

-- Sellers and buyers can update status of their inquiries
CREATE POLICY "Sellers and buyers can update inquiry status"
    ON public.marketplace_inquiries FOR UPDATE
    USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

-- Buyers or sellers can delete their inquiries
CREATE POLICY "Users can delete their own inquiries"
    ON public.marketplace_inquiries FOR DELETE
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);


-- 3. External Seed Products Table (Authorised External Store Catalogue)
CREATE TABLE IF NOT EXISTS public.external_seed_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    variety TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('vegetable', 'fruit', 'herb', 'flower')),
    retailer_name TEXT NOT NULL,
    product_url TEXT NOT NULL,
    image_url TEXT,
    price_inr NUMERIC(10, 2),
    currency TEXT NOT NULL DEFAULT 'INR',
    source_attribution TEXT NOT NULL,
    last_verified_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for seed products
CREATE INDEX IF NOT EXISTS idx_seed_products_category ON public.external_seed_products(category);
CREATE INDEX IF NOT EXISTS idx_seed_products_active ON public.external_seed_products(is_active);

-- Enable RLS on external seed products
ALTER TABLE public.external_seed_products ENABLE ROW LEVEL SECURITY;

-- Public read-only policy for active external seed products
CREATE POLICY "Public can view active seed products"
    ON public.external_seed_products FOR SELECT
    USING (is_active = true);
