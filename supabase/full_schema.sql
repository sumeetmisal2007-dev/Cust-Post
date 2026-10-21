-- ==============================================================================
-- CUST-POST: Complete Supabase PostgreSQL Schema & Seed Data
-- ==============================================================================
-- Run this entire script in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/zzacpqygdfhvgzujepev/sql/new
--
-- This script is idempotent: safe to run once or multiple times.
-- ==============================================================================

-- 0. Enable cryptographic UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. BASE TABLES
-- ==============================================================================

-- 1.1 Profiles Table (Linked directly to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 1.2 Containers Table (Vessel & Space Profile)
CREATE TABLE IF NOT EXISTS public.containers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nickname TEXT NOT NULL,
    location_type TEXT NOT NULL CHECK (location_type IN ('indoor', 'balcony', 'terrace', 'garden')),
    shape TEXT NOT NULL CHECK (shape IN ('rectangular', 'cylindrical', 'irregular')),
    length_cm NUMERIC(6, 1),
    width_cm NUMERIC(6, 1),
    height_cm NUMERIC(6, 1) NOT NULL,
    diameter_cm NUMERIC(6, 1),
    volume_litres NUMERIC(7, 1) NOT NULL,
    material TEXT NOT NULL CHECK (material IN ('plastic_bucket', 'terracotta', 'wooden_crate', 'metal_drum', 'mesh_wire', 'other')),
    previous_use TEXT NOT NULL CHECK (previous_use IN ('food', 'paint_chemicals', 'soil_garden', 'new_unused', 'unknown')),
    condition TEXT NOT NULL CHECK (condition IN ('good', 'cracked_damaged', 'uncleanable_residue')),
    has_lid BOOLEAN NOT NULL DEFAULT true,
    has_ventilation BOOLEAN NOT NULL DEFAULT false,
    has_drainage BOOLEAN NOT NULL DEFAULT false,
    is_food_grade TEXT NOT NULL DEFAULT 'unknown' CHECK (is_food_grade IN ('food_grade', 'non_food_grade', 'unknown')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 1.3 Compost Batches Table
CREATE TABLE IF NOT EXISTS public.compost_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    container_id UUID REFERENCES public.containers(id) ON DELETE SET NULL,
    batch_name TEXT NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('aerobic_bin', 'vermicomposting', 'bokashi')),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'curing', 'completed', 'abandoned')),
    total_measured_input_kg NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
    total_estimated_input_kg NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
    readiness_window_start DATE,
    readiness_window_end DATE,
    completed_at TIMESTAMPTZ,
    notes TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 1.4 Batch Observations Table (Dated Timeline Logs)
CREATE TABLE IF NOT EXISTS public.batch_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES public.compost_batches(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    observed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    moisture TEXT NOT NULL CHECK (moisture IN ('dry', 'ideal', 'too_wet')),
    odour TEXT NOT NULL CHECK (odour IN ('earthy', 'none', 'sour', 'ammonia')),
    temperature_c NUMERIC(4, 1),
    temperature_status TEXT NOT NULL DEFAULT 'unknown' CHECK (temperature_status IN ('measured', 'estimated', 'user_reported', 'unknown')),
    turned_today BOOLEAN NOT NULL DEFAULT false,
    pests_observed TEXT NOT NULL DEFAULT 'none' CHECK (pests_observed IN ('none', 'fruit_flies', 'maggots', 'rodents', 'ants', 'cockroaches')),
    waste_added_kg NUMERIC(6, 2),
    waste_addition_status TEXT CHECK (waste_addition_status IN ('measured', 'estimated', 'user_reported', 'unknown')),
    notes TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 1.5 Recommendation Event Logs Table (Audit trail for explainable guidance)
CREATE TABLE IF NOT EXISTS public.recommendation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    inputs_snapshot JSONB NOT NULL,
    verdict TEXT NOT NULL CHECK (verdict IN ('suitable', 'suitable_with_changes', 'unsuitable', 'more_info_needed')),
    chosen_method TEXT,
    rule_version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 1.6 User Feedback Table (Reporting on rules / confusion)
CREATE TABLE IF NOT EXISTS public.user_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    issue_type TEXT NOT NULL,
    description TEXT NOT NULL,
    context_snapshot JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 1.7 Community Soil & Seed Exchange Table
CREATE TABLE IF NOT EXISTS public.community_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('surplus_compost', 'seeds_cuttings', 'browns', 'pots_tools')),
    description TEXT,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL,
    contact_method TEXT NOT NULL CHECK (contact_method IN ('whatsapp', 'telegram', 'email', 'phone')),
    contact_handle TEXT NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    related_plant_slug TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 1.8 Community Compost Marketplace Listings Table
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

-- 1.9 Marketplace Private Inquiries Table
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

-- 1.10 External Seed Products Table (Authorised Store Catalogue)
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

-- ==============================================================================
-- 2. PERFORMANCE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_containers_owner ON public.containers(owner_id);
CREATE INDEX IF NOT EXISTS idx_batches_owner ON public.compost_batches(owner_id);
CREATE INDEX IF NOT EXISTS idx_batches_container ON public.compost_batches(container_id);
CREATE INDEX IF NOT EXISTS idx_observations_batch ON public.batch_observations(batch_id);
CREATE INDEX IF NOT EXISTS idx_observations_owner ON public.batch_observations(owner_id);
CREATE INDEX IF NOT EXISTS idx_observations_date ON public.batch_observations(observed_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_listings_city ON public.community_listings(city);
CREATE INDEX IF NOT EXISTS idx_community_listings_category ON public.community_listings(category);

CREATE INDEX IF NOT EXISTS idx_compost_listings_seller ON public.compost_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_compost_listings_status ON public.compost_listings(status);
CREATE INDEX IF NOT EXISTS idx_compost_listings_type ON public.compost_listings(compost_type);
CREATE INDEX IF NOT EXISTS idx_compost_listings_city ON public.compost_listings(city);
CREATE INDEX IF NOT EXISTS idx_compost_listings_created ON public.compost_listings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_inquiries_listing ON public.marketplace_inquiries(listing_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_buyer ON public.marketplace_inquiries(buyer_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_seller ON public.marketplace_inquiries(seller_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON public.marketplace_inquiries(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_seed_products_category ON public.external_seed_products(category);
CREATE INDEX IF NOT EXISTS idx_seed_products_active ON public.external_seed_products(is_active);

-- ==============================================================================
-- 3. AUTOMATIC PROFILE CREATION TRIGGER
-- ==============================================================================

-- Syncs display_name and avatar from Google OAuth / Supabase Auth to public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture',
      NULL
    )
  )
  ON CONFLICT (id) DO UPDATE
  SET
    display_name = COALESCE(EXCLUDED.display_name, public.profiles.display_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) & ACCESS POLICIES
-- ==============================================================================

-- 4.1 Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compost_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compost_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_seed_products ENABLE ROW LEVEL SECURITY;

-- 4.2 Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 4.3 Containers Policies
DROP POLICY IF EXISTS "Users can select own containers" ON public.containers;
CREATE POLICY "Users can select own containers"
    ON public.containers FOR SELECT
    USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert own containers" ON public.containers;
CREATE POLICY "Users can insert own containers"
    ON public.containers FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own containers" ON public.containers;
CREATE POLICY "Users can update own containers"
    ON public.containers FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own containers" ON public.containers;
CREATE POLICY "Users can delete own containers"
    ON public.containers FOR DELETE
    USING (auth.uid() = owner_id);

-- 4.4 Compost Batches Policies
DROP POLICY IF EXISTS "Users can select own batches" ON public.compost_batches;
CREATE POLICY "Users can select own batches"
    ON public.compost_batches FOR SELECT
    USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert own batches" ON public.compost_batches;
CREATE POLICY "Users can insert own batches"
    ON public.compost_batches FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own batches" ON public.compost_batches;
CREATE POLICY "Users can update own batches"
    ON public.compost_batches FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own batches" ON public.compost_batches;
CREATE POLICY "Users can delete own batches"
    ON public.compost_batches FOR DELETE
    USING (auth.uid() = owner_id);

-- 4.5 Batch Observations Policies
DROP POLICY IF EXISTS "Users can select own observations" ON public.batch_observations;
CREATE POLICY "Users can select own observations"
    ON public.batch_observations FOR SELECT
    USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert own observations" ON public.batch_observations;
CREATE POLICY "Users can insert own observations"
    ON public.batch_observations FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own observations" ON public.batch_observations;
CREATE POLICY "Users can update own observations"
    ON public.batch_observations FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own observations" ON public.batch_observations;
CREATE POLICY "Users can delete own observations"
    ON public.batch_observations FOR DELETE
    USING (auth.uid() = owner_id);

-- 4.6 Recommendation Logs Policies
DROP POLICY IF EXISTS "Users can view own recommendation logs" ON public.recommendation_logs;
CREATE POLICY "Users can view own recommendation logs"
    ON public.recommendation_logs FOR SELECT
    USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Anyone or authenticated can insert recommendation logs" ON public.recommendation_logs;
CREATE POLICY "Anyone or authenticated can insert recommendation logs"
    ON public.recommendation_logs FOR INSERT
    WITH CHECK (true);

-- 4.7 User Feedback Policies
DROP POLICY IF EXISTS "Users can view own submitted feedback" ON public.user_feedback;
CREATE POLICY "Users can view own submitted feedback"
    ON public.user_feedback FOR SELECT
    USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Anyone or authenticated can insert user feedback" ON public.user_feedback;
CREATE POLICY "Anyone or authenticated can insert user feedback"
    ON public.user_feedback FOR INSERT
    WITH CHECK (true);

-- 4.8 Community Soil & Seed Exchange Policies
DROP POLICY IF EXISTS "Anyone can view available exchange listings" ON public.community_listings;
CREATE POLICY "Anyone can view available exchange listings"
    ON public.community_listings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create exchange listings" ON public.community_listings;
CREATE POLICY "Authenticated users can create exchange listings"
    ON public.community_listings FOR INSERT
    WITH CHECK (auth.uid() = owner_id OR owner_id IS NULL);

DROP POLICY IF EXISTS "Users can update their own exchange listings" ON public.community_listings;
CREATE POLICY "Users can update their own exchange listings"
    ON public.community_listings FOR UPDATE
    USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete their own exchange listings" ON public.community_listings;
CREATE POLICY "Users can delete their own exchange listings"
    ON public.community_listings FOR DELETE
    USING (auth.uid() = owner_id);

-- 4.9 Compost Marketplace Policies
DROP POLICY IF EXISTS "Public can view active compost listings" ON public.compost_listings;
CREATE POLICY "Public can view active compost listings"
    ON public.compost_listings FOR SELECT
    USING (status = 'active' OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Authenticated users can create compost listings" ON public.compost_listings;
CREATE POLICY "Authenticated users can create compost listings"
    ON public.compost_listings FOR INSERT
    WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can update their own compost listings" ON public.compost_listings;
CREATE POLICY "Users can update their own compost listings"
    ON public.compost_listings FOR UPDATE
    USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can delete their own compost listings" ON public.compost_listings;
CREATE POLICY "Users can delete their own compost listings"
    ON public.compost_listings FOR DELETE
    USING (auth.uid() = seller_id);

-- 4.10 Private Marketplace Inquiries Policies
DROP POLICY IF EXISTS "Buyers and sellers can view their own inquiries" ON public.marketplace_inquiries;
CREATE POLICY "Buyers and sellers can view their own inquiries"
    ON public.marketplace_inquiries FOR SELECT
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Authenticated users can create inquiries for active listings" ON public.marketplace_inquiries;
CREATE POLICY "Authenticated users can create inquiries for active listings"
    ON public.marketplace_inquiries FOR INSERT
    WITH CHECK (auth.uid() = buyer_id AND auth.uid() != seller_id);

DROP POLICY IF EXISTS "Sellers and buyers can update inquiry status" ON public.marketplace_inquiries;
CREATE POLICY "Sellers and buyers can update inquiry status"
    ON public.marketplace_inquiries FOR UPDATE
    USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Users can delete their own inquiries" ON public.marketplace_inquiries;
CREATE POLICY "Users can delete their own inquiries"
    ON public.marketplace_inquiries FOR DELETE
    USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- 4.11 External Seed Products Policies
DROP POLICY IF EXISTS "Public can view active seed products" ON public.external_seed_products;
CREATE POLICY "Public can view active seed products"
    ON public.external_seed_products FOR SELECT
    USING (is_active = true);

-- ==============================================================================
-- 5. INITIAL SEED DATA
-- ==============================================================================

-- 5.1 Sample Community Listings
INSERT INTO public.community_listings (id, title, category, description, neighborhood, city, contact_method, contact_handle, is_available)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '5L Cured Aerobic Compost ready for balcony pot blend',
    'surplus_compost',
    'Fully cured for 60 days, dark crumbly texture with earthy forest smell. Great for 20-25% pot blends for tomatoes, chillies, or herbs.',
    'Indiranagar',
    'Bengaluru',
    'whatsapp',
    '+91 98450 12345',
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Rooted Pudina / Mint cuttings & Krishna Tulsi seeds',
    'seeds_cuttings',
    'Healthy water-rooted mint cuttings ready for potting, plus fresh harvested Krishna Tulsi seed pods. Free for any balcony gardener.',
    'Bandra West',
    'Mumbai',
    'telegram',
    '@urban_green_mumbai',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Bag of dry shredded leaves & brown cardboard',
    'browns',
    'Two 20L bags of crispy dry neem/peepal leaves and clean unbleached shredded cardboard browns ready for carbon balancing.',
    'Koregaon Park',
    'Pune',
    'whatsapp',
    '+91 98230 54321',
    true
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Desi Cherry Tomato heirloom seeds (Heavy Yield)',
    'seeds_cuttings',
    'Sun-dried organic seeds from vigorous 20L balcony vine. Germination tested at 90%. Happy to share seed packets with beginners.',
    'Jubilee Hills',
    'Hyderabad',
    'email',
    'balconygardener.hyd@gmail.com',
    true
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Two 15L Terracotta nursery pots looking for a home',
    'pots_tools',
    'Clean terracotta pots with bottom drainage hole intact. Perfect for eggplants, okra, or bush citrus.',
    'Vasant Kunj',
    'New Delhi',
    'whatsapp',
    '+91 98110 67890',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 5.2 External Seed Products (16 Curated Indian Balcony Varieties)
INSERT INTO public.external_seed_products (name, variety, category, retailer_name, product_url, image_url, price_inr, currency, source_attribution, last_verified_date, is_active, description)
VALUES
  (
    'Spinach / Palak',
    'All Green Spinach (Spinacia oleracea)',
    'vegetable',
    'TrustBasket',
    'https://trustbasket.com/collections/seeds/products/spinach-seeds',
    'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
    79.00,
    'INR',
    'TrustBasket India Certified Seeds',
    '2026-10-15',
    true,
    'Fast-growing open-pollinated leafy spinach, well-suited for shallow 6-inch balcony planter trays.'
  ),
  (
    'Cherry Tomato',
    'Solanum lycopersicum var. cerasiforme (Red Round)',
    'vegetable',
    'AllThatGrows',
    'https://www.allthatgrows.in/products/cherry-tomato-seeds',
    'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&auto=format&fit=crop&q=80',
    95.00,
    'INR',
    'AllThatGrows Non-Hybrid Seeds',
    '2026-10-18',
    true,
    'Prolific indeterminate cherry tomato variety suited for 15-20L balcony containers with stake support.'
  ),
  (
    'Krishna Tulsi',
    'Ocimum tenuiflorum (Dark Purple Basil)',
    'herb',
    'Ugaoo',
    'https://www.ugaoo.com/products/krishna-tulsi-seeds',
    '/images/plants/tulsi.png',
    85.00,
    'INR',
    'Ugaoo Urban Garden Seeds',
    '2026-10-18',
    true,
    'Aromatic sacred medicinal basil with high resilience in warm Indian climates and clay containers.'
  ),
  (
    'Coriander / Dhaniya',
    'Coriandrum sativum (Multi-cut Indian Variety)',
    'herb',
    'TrustBasket',
    'https://trustbasket.com/collections/seeds/products/coriander-seeds',
    '/images/plants/coriander.png',
    69.00,
    'INR',
    'TrustBasket Open-Pollinated Garden Pack',
    '2026-10-19',
    true,
    'Fast germinating, multi-cut aromatic coriander suitable for balcony window boxes and compost-rich soil.'
  ),
  (
    'French Marigold / Genda',
    'Tagetes patula (Petite Orange & Yellow)',
    'flower',
    'Bombay Greens',
    'https://bombaygreens.com/products/marigold-seeds',
    '/images/plants/marigold.png',
    89.00,
    'INR',
    'Bombay Greens Seed Packets',
    '2026-10-19',
    true,
    'Essential companion planting flower for balcony pest deterrent, root protection, and pollinator attraction.'
  ),
  (
    'Zinnia Elegans Mix',
    'Zinnia elegans (Dwarf Double Flower Mix)',
    'flower',
    'AllThatGrows',
    'https://www.allthatgrows.in/products/zinnia-dwarf-mixed-seeds',
    '/images/plants/zinnia.png',
    95.00,
    'INR',
    'AllThatGrows Garden Seeds',
    '2026-10-20',
    true,
    'Bright sun-loving blooms that thrive in sunny balcony containers and bring vibrant colours all summer.'
  ),
  (
    'Thai Hot Chilli',
    'Capsicum annuum (Pungent Indian Cultivar)',
    'vegetable',
    'Ugaoo',
    'https://www.ugaoo.com/products/thai-chilli-seeds',
    '/images/plants/green-chili.png',
    85.00,
    'INR',
    'Ugaoo Seed Bank',
    '2026-10-20',
    true,
    'Compact upright perennial shrub bearing sharp fiery chillies, thriving in 10-15L pots with rich compost humus.'
  ),
  (
    'Alpine Strawberry',
    'Fragaria vesca (Sweet Alpine Runnerless)',
    'fruit',
    'TrustBasket',
    'https://trustbasket.com/collections/seeds/products/strawberry-seeds',
    'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80',
    120.00,
    'INR',
    'TrustBasket Certified Fruit Seeds',
    '2026-10-18',
    true,
    'Runnerless compact strawberry variety ideal for hanging baskets and tiered balcony pots.'
  ),
  (
    'Sweet Basil (Italian Genovese)',
    'Ocimum basilicum (Large Fragrant Leaf)',
    'herb',
    'Ugaoo',
    'https://www.ugaoo.com/products/basil-seeds',
    '/images/plants/sweet-basil.jpg',
    79.00,
    'INR',
    'Ugaoo Herb Seed Collection',
    '2026-10-21',
    true,
    'Aromatic culinary basil delivering tender sweet foliage for pestos and salads, thriving in warm compost-enriched potting mix.'
  ),
  (
    'Fenugreek / Methi',
    'Trigonella foenum-graecum (Kasuri Multi-cut)',
    'vegetable',
    'TrustBasket',
    'https://trustbasket.com/collections/seeds/products/methi-seeds',
    '/images/plants/methi.png',
    59.00,
    'INR',
    'TrustBasket High-Germination Pack',
    '2026-10-21',
    true,
    'Fast-growing balcony micro-green and culinary staple ready for initial harvest in just 21 days.'
  ),
  (
    'Brinjal / Baingan',
    'Solanum melongena (Pusa Purple Round)',
    'vegetable',
    'AllThatGrows',
    'https://www.allthatgrows.in/products/brinjal-round-seeds',
    '/images/plants/brinjal.png',
    85.00,
    'INR',
    'AllThatGrows Desi Vegetable Seeds',
    '2026-10-21',
    true,
    'Sturdy heavy-fruiting eggplant variety yielding glossy dark purple brinjals in 15-20L balcony grow bags.'
  ),
  (
    'Bitter Gourd / Karela',
    'Momordica charantia (Pusa Do Mausami)',
    'vegetable',
    'Ugaoo',
    'https://www.ugaoo.com/products/karela-seeds',
    '/images/plants/bitter-gourd.png',
    89.00,
    'INR',
    'Ugaoo Hybrid Climbers',
    '2026-10-21',
    true,
    'Vigorous vertical climber for balcony grills yielding ridged dark green medicinal bitter gourds.'
  ),
  (
    'Red Amaranth / Lal Saag',
    'Amaranthus tricolor (Pusa Lal Chaulai)',
    'vegetable',
    'Bombay Greens',
    'https://bombaygreens.com/products/red-amaranth-seeds',
    '/images/plants/red-amaranth.png',
    75.00,
    'INR',
    'Bombay Greens Native Seeds',
    '2026-10-21',
    true,
    'Iron-rich crimson leafy green thriving through hot summers, ready for multi-cut harvest in 25 days.'
  ),
  (
    'Curry Leaves / Kadi Patta',
    'Murraya koenigii (Aromatic Suwasini)',
    'herb',
    'TrustBasket',
    'https://trustbasket.com/collections/seeds/products/curry-leaves-seeds',
    '/images/plants/curry-leaves.jpg',
    99.00,
    'INR',
    'TrustBasket Aromatic Herbs',
    '2026-10-21',
    true,
    'Essential Indian tempering aromatic, growing into a lush container bush with warm sun and compost top-dressing.'
  ),
  (
    'Ajwain Leaves / Karpuravalli',
    'Plectranthus amboinicus (Indian Borage)',
    'herb',
    'Bombay Greens',
    'https://bombaygreens.com/products/ajwain-seeds',
    '/images/plants/ajwain-leaves.png',
    79.00,
    'INR',
    'Bombay Greens Urban Herbals',
    '2026-10-21',
    true,
    'Succulent medicinal herb with thick aromatic leaves prized for pakoras, herbal teas, and soothing remedies.'
  ),
  (
    'Dwarf Guava / Amrood',
    'Psidium guajava (Thai Dwarf Container Selection)',
    'fruit',
    'TrustBasket',
    'https://trustbasket.com/collections/seeds/products/guava-seeds',
    '/images/plants/dwarf-guava.png',
    110.00,
    'INR',
    'TrustBasket Fruit Seeds',
    '2026-10-21',
    true,
    'Compact fruiting tree tailored for 25L balcony containers, producing fragrant blooms and crisp sweet guavas.'
  );
