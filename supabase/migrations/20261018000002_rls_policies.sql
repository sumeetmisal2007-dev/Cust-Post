-- Cust-Post Row Level Security (RLS) Policies
-- Migration: 20261018000002_rls_policies.sql

-- 1. Enable RLS on all user data tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compost_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- 2. Profiles Policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 3. Containers Policies
CREATE POLICY "Users can select own containers"
    ON public.containers FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own containers"
    ON public.containers FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own containers"
    ON public.containers FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own containers"
    ON public.containers FOR DELETE
    USING (auth.uid() = owner_id);

-- 4. Compost Batches Policies
CREATE POLICY "Users can select own batches"
    ON public.compost_batches FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own batches"
    ON public.compost_batches FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own batches"
    ON public.compost_batches FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own batches"
    ON public.compost_batches FOR DELETE
    USING (auth.uid() = owner_id);

-- 5. Batch Observations Policies
CREATE POLICY "Users can select own observations"
    ON public.batch_observations FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own observations"
    ON public.batch_observations FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own observations"
    ON public.batch_observations FOR UPDATE
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own observations"
    ON public.batch_observations FOR DELETE
    USING (auth.uid() = owner_id);

-- 6. Recommendation Logs Policies
CREATE POLICY "Users can view own recommendation logs"
    ON public.recommendation_logs FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Anyone or authenticated can insert recommendation logs"
    ON public.recommendation_logs FOR INSERT
    WITH CHECK (true);

-- 7. User Feedback Policies
CREATE POLICY "Users can view own submitted feedback"
    ON public.user_feedback FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Anyone or authenticated can insert user feedback"
    ON public.user_feedback FOR INSERT
    WITH CHECK (true);
