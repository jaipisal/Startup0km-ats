-- ============================================================
-- Startup0km ATS — Complete Database Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- ─────────────────────────────────────────────
-- 1. PROFILES TABLE
-- Stores extra user info linked to Supabase Auth
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT '',
  email       TEXT NOT NULL DEFAULT '',
  role        TEXT NOT NULL CHECK (role IN ('employer', 'jobseeker')),
  bio         TEXT,
  resume_url  TEXT,
  company     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, bio, company)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'jobseeker'),
    COALESCE(NEW.raw_user_meta_data->>'bio', NULL),
    COALESCE(NEW.raw_user_meta_data->>'company', NULL)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─────────────────────────────────────────────
-- 2. JOBS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.jobs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  company      TEXT NOT NULL DEFAULT '',
  location     TEXT NOT NULL DEFAULT '',
  type         TEXT NOT NULL CHECK (type IN ('Full-time', 'Part-time', 'Contract', 'Remote')),
  description  TEXT NOT NULL DEFAULT '',
  requirements TEXT[] NOT NULL DEFAULT '{}',
  salary       TEXT,
  status       TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Closed')),
  posted_at    DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);


-- ─────────────────────────────────────────────
-- 3. APPLICATIONS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  jobseeker_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'Applied'
                  CHECK (status IN ('Applied', 'Screening', 'Interview', 'Offered', 'Rejected', 'Hired')),
  match_score     INTEGER DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
  applied_at      DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, jobseeker_id)  -- prevent duplicate applications
);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- PROFILES RLS
-- ─────────────────────────────────────────────
-- Authenticated users can read basic profile info of everyone
CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can only update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Note: To truly hide the 'email' column from general select while allowing the owner/authorized 
-- to see it, we would normally use a View or more complex RLS. 
-- In this schema, we will at least ensure only authenticated users can see profiles.

-- ─────────────────────────────────────────────
-- JOBS RLS
-- ─────────────────────────────────────────────
-- Anyone (including anonymous) can view open jobs
CREATE POLICY "jobs_select_open"
  ON public.jobs FOR SELECT USING (status = 'Open');

-- Only employers can insert jobs (for themselves)
CREATE POLICY "jobs_insert_employer"
  ON public.jobs FOR INSERT
  WITH CHECK (auth.uid() = employer_id);

-- Only the job owner (employer) can update their own jobs
CREATE POLICY "jobs_update_own"
  ON public.jobs FOR UPDATE
  USING (auth.uid() = employer_id);

-- Only the job owner can delete their own jobs
CREATE POLICY "jobs_delete_own"
  ON public.jobs FOR DELETE
  USING (auth.uid() = employer_id);

-- ─────────────────────────────────────────────
-- APPLICATIONS RLS
-- ─────────────────────────────────────────────
-- Jobseekers can see their own applications
CREATE POLICY "applications_select_jobseeker"
  ON public.applications FOR SELECT
  USING (auth.uid() = jobseeker_id);

-- Employers can see applications on their own jobs
CREATE POLICY "applications_select_employer"
  ON public.applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
        AND jobs.employer_id = auth.uid()
    )
  );

-- Jobseekers can insert their own applications
CREATE POLICY "applications_insert_jobseeker"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = jobseeker_id);

-- Employers can update the status of applications on their jobs
CREATE POLICY "applications_update_employer"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
        AND jobs.employer_id = auth.uid()
    )
  );

-- Jobseekers can delete their own applications (withdraw)
CREATE POLICY "applications_delete_jobseeker"
  ON public.applications FOR DELETE
  USING (auth.uid() = jobseeker_id);

-- Employers can delete applications on their jobs (cleanup)
CREATE POLICY "applications_delete_employer"
  ON public.applications FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.jobs
      WHERE jobs.id = applications.job_id
        AND jobs.employer_id = auth.uid()
    )
  );
