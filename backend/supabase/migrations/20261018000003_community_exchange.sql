-- 7. Community Soil & Seed Exchange Table
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

CREATE INDEX IF NOT EXISTS idx_community_listings_city ON public.community_listings(city);
CREATE INDEX IF NOT EXISTS idx_community_listings_category ON public.community_listings(category);

-- RLS Policies
ALTER TABLE public.community_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available exchange listings"
    ON public.community_listings FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create exchange listings"
    ON public.community_listings FOR INSERT
    WITH CHECK (auth.uid() = owner_id OR owner_id IS NULL);

CREATE POLICY "Users can update their own exchange listings"
    ON public.community_listings FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own exchange listings"
    ON public.community_listings FOR DELETE
    USING (auth.uid() = owner_id);
