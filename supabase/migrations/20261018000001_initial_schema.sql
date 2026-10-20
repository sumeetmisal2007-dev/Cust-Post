-- Cust-Post MVP Initial Schema Migration
-- Migration: 20261018000001_initial_schema.sql

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Containers Table (Vessel & Space profile)
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

-- 3. Compost Batches Table
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

-- 4. Batch Observations Table (Dated Timeline Logs)
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

-- 5. Recommendation Event Logs Table (Audit trail for explainable guidance)
CREATE TABLE IF NOT EXISTS public.recommendation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    inputs_snapshot JSONB NOT NULL,
    verdict TEXT NOT NULL CHECK (verdict IN ('suitable', 'suitable_with_changes', 'unsuitable', 'more_info_needed')),
    chosen_method TEXT,
    rule_version TEXT NOT NULL DEFAULT '1.0',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. User Feedback Table (Pilot reporting on unhelpful/confusing rules)
CREATE TABLE IF NOT EXISTS public.user_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    issue_type TEXT NOT NULL,
    description TEXT NOT NULL,
    context_snapshot JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_containers_owner ON public.containers(owner_id);
CREATE INDEX IF NOT EXISTS idx_batches_owner ON public.compost_batches(owner_id);
CREATE INDEX IF NOT EXISTS idx_batches_container ON public.compost_batches(container_id);
CREATE INDEX IF NOT EXISTS idx_observations_batch ON public.batch_observations(batch_id);
CREATE INDEX IF NOT EXISTS idx_observations_owner ON public.batch_observations(owner_id);
CREATE INDEX IF NOT EXISTS idx_observations_date ON public.batch_observations(observed_at DESC);
