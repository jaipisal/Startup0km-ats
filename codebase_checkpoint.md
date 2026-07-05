# 🗂️ HireFlow ATS — Full Codebase Checkpoint

> **Created:** 2026-06-28 | **Status:** Complete exploration, no changes made  
> **Purpose:** Resume point for any AI or session that needs to continue work

---

## 📌 Project Overview

**HireFlow ATS** — An AI-powered Applicant Tracking System (ATS).  
- **Live Demo:** https://startup0km-ats-elrm.vercel.app/
- **Repo:** https://github.com/jaipisal/ATS-Application-Tracking-System-.git (branch: `main`)
- **Stack:** React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion + Supabase (PostgreSQL + Auth + RLS)
- **Hosting:** Vercel (frontend) + Supabase (backend)

---

## 🗂️ Root Directory Structure

```w
e:\StartUp0km\
├── src/                  ← All source code
├── public/               ← Static assets
├── dist/                 ← Build output
├── .git/                 ← Git repo
├── node_modules/         ← Dependencies
├── .env                  ← Supabase keys (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
├── .env.example          ← Template
├── index.html            ← Vite entry point
├── package.json          ← Dependencies & scripts
├── vite.config.ts        ← Vite config
├── tailwind.config.ts    ← Tailwind config
├── tsconfig.json         ← TypeScript config
├── vercel.json           ← Vercel deployment config
├── supabase_schema.sql   ← Full DB schema with RLS policies
└── README.md             ← Setup & docs
```

---

## 📁 `src/` Directory Structure

```
src/
├── App.tsx               ← Root component: routing, auth guards
├── main.tsx              ← Entry point
├── index.css             ← Global styles (Tailwind + custom)
├── App.css               ← Minor App-level styles
├── vite-env.d.ts         ← Vite type declarations
├── lib/
│   ├── supabase.ts       ← Supabase client + TypeScript types (Profile, Job, Application)
│   ├── api.ts            ← All DB operations (auth, jobs, applications, stats)
│   ├── scoring.ts        ← AI match score algorithm (local keyword + OpenAI fallback)
│   └── utils.ts          ← Minimal utility (cn() for classnames)
├── contexts/
│   └── AuthContext.tsx   ← Supabase Auth context (user, session, login, signup, logout)
├── pages/
│   ├── Index.tsx         ← Redirect to landing
│   ├── LandingPage.tsx   ← Public marketing page
│   ├── LoginPage.tsx     ← Login form with animated background
│   ├── SignupPage.tsx     ← Signup form (employer/jobseeker role selection)
│   ├── NotFound.tsx      ← 404 page
│   ├── employer/
│   │   ├── EmployerDashboard.tsx   ← Stats + Kanban preview + recent apps
│   │   ├── JobsManagement.tsx      ← CRUD for job listings
│   │   └── CandidatePipeline.tsx   ← Kanban pipeline (6 stages)
│   └── jobseeker/
│       ├── JobBoard.tsx            ← Browse + search jobs + quick apply
│       └── MyApplications.tsx      ← View own applications + status + match score
├── components/
│   ├── EmployerLayout.tsx   ← Sidebar nav layout for employer routes
│   ├── JobseekerLayout.tsx  ← Top nav layout for jobseeker routes
│   ├── Badges.tsx           ← MatchScoreBadge + StatusBadge
│   ├── GlobalBackground.tsx ← Interactive mouse-tracking gradient background
│   ├── Logo.tsx             ← Animated "HireFlow" logo with orbital particles
│   ├── LogoutDialog.tsx     ← Animated logout confirmation modal
│   ├── NavLink.tsx          ← Router NavLink with active class support
│   └── ui/                  ← shadcn/ui component library (button, dialog, etc.)
├── data/
│   └── mockData.ts          ← Legacy mock data + type definitions (ApplicationStatus type used by Badges.tsx)
├── hooks/
│   ├── use-mobile.tsx       ← useIsMobile hook
│   └── use-toast.ts         ← Toast notification hook
└── test/                    ← Test directory
```

---

## 🗄️ Database Schema (Supabase PostgreSQL)

### Tables

#### `public.profiles`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | FK → auth.users(id) ON DELETE CASCADE |
| name | TEXT | |
| email | TEXT | |
| role | TEXT | CHECK: 'employer' \| 'jobseeker' |
| bio | TEXT | Used for AI match scoring |
| resume_url | TEXT | |
| company | TEXT | Employer's company name |
| created_at | TIMESTAMPTZ | |

#### `public.jobs`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | gen_random_uuid() |
| employer_id | UUID FK | → profiles(id) ON DELETE CASCADE |
| title | TEXT | |
| company | TEXT | |
| location | TEXT | |
| type | TEXT | CHECK: 'Full-time'\|'Part-time'\|'Contract'\|'Remote' |
| description | TEXT | |
| requirements | TEXT[] | Array of requirement strings |
| salary | TEXT | Optional |
| status | TEXT | CHECK: 'Open'\|'Closed' |
| posted_at | DATE | |
| created_at | TIMESTAMPTZ | |

#### `public.applications`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | gen_random_uuid() |
| job_id | UUID FK | → jobs(id) ON DELETE CASCADE |
| jobseeker_id | UUID FK | → profiles(id) ON DELETE CASCADE |
| status | TEXT | CHECK: 'Applied'\|'Screening'\|'Interview'\|'Offered'\|'Rejected'\|'Hired' |
| match_score | INTEGER | 0–100 |
| applied_at | DATE | |
| created_at | TIMESTAMPTZ | |
| | | UNIQUE(job_id, jobseeker_id) — prevents duplicates |

### Triggers
- `on_auth_user_created` → `handle_new_user()` — Auto-creates profile row from `raw_user_meta_data` on signup

### RLS Policies
- **profiles**: Any authenticated user can read; owner can only update their own
- **jobs**: Anyone can read Open jobs; owner employer can read all their own; only employer can insert/update/delete their own
- **applications**: Jobseeker sees own; employer sees apps on their jobs; jobseeker can insert/delete own; employer can update status + delete apps on their jobs

---

## 🔑 TypeScript Types (`src/lib/supabase.ts`)

```typescript
type UserRole = "employer" | "jobseeker"

interface Profile {
  id: string; name: string; email: string; role: UserRole;
  bio?: string; resume_url?: string; company?: string; created_at?: string;
}

type JobType = "Full-time" | "Part-time" | "Contract" | "Remote"
type JobStatus = "Open" | "Closed"

interface Job {
  id: string; employer_id: string; title: string; company: string;
  location: string; type: JobType; description: string; requirements: string[];
  salary?: string; status: JobStatus; posted_at: string; created_at?: string;
  profiles?: Pick<Profile, "name" | "company">; // joined
}

type ApplicationStatus = "Applied" | "Screening" | "Interview" | "Offered" | "Rejected" | "Hired"

interface Application {
  id: string; job_id: string; jobseeker_id: string;
  status: ApplicationStatus; match_score: number;
  applied_at: string; created_at?: string;
  profiles?: Pick<Profile, "name" | "bio" | "resume_url">; // joined
  jobs?: Pick<Job, "title" | "company" | "location" | "type">; // joined
}
```

---

## 🔗 App Routes

| Route | Component | Auth | Role |
|---|---|---|---|
| `/` | LandingPage | Public | Any |
| `/login` | LoginPage | Public | Any |
| `/signup` | SignupPage | Public | Any |
| `/employer` | EmployerDashboard | Protected | employer |
| `/employer/jobs` | JobsManagement | Protected | employer |
| `/employer/candidates` | CandidatePipeline | Protected | employer |
| `/jobseeker` | JobBoard | Protected | jobseeker |
| `/jobseeker/applications` | MyApplications | Protected | jobseeker |
| `*` | NotFound | Public | Any |

### Auth Guard Logic (`App.tsx`)
- `AuthRedirect`: Logged-in users visiting `/`, `/login`, `/signup` get redirected to their dashboard
- `RequireAuth`: Wraps protected routes; unauthenticated → `/login`; wrong role → their own dashboard

---

## 🔧 Key API Functions (`src/lib/api.ts`)

### Auth
- `loginUser(email, password)` — Supabase signInWithPassword
- `signupUser(email, password, metadata)` — Supabase signUp with metadata
- `logoutUser()` — Supabase signOut
- `getProfileById(userId)` — Fetch from profiles table
- `getCurrentProfile()` — Get profile of currently authenticated user

### Jobs
- `fetchOpenJobs()` — Fetch ALL jobs (Open + Closed) ordered by created_at DESC
- `fetchEmployerJobs(employerId)` — Fetch employer's own jobs
- `createJob(job)` — Insert new job
- `updateJob(id, updates)` — Update job fields
- `deleteJob(id)` — Delete job

### Applications
- `fetchApplicationsForEmployer(employerId)` — All apps for employer's jobs (joins profiles + jobs), filtered client-side
- `fetchMyApplications(jobseekerId)` — Jobseeker's own apps (joins jobs)
- `fetchAppliedJobIds(jobseekerId)` — Just job IDs to check "already applied"
- `applyToJob(job, jobseeker)` — Calculates match score, inserts application
- `deleteApplication(id)` — Delete application
- `updateApplicationStatus(applicationId, newStatus)` — Employer moves candidate
- `fetchEmployerStats(employerId)` — Returns {openJobs, totalApps, interviews, avgMatch, jobs, applications}

> **NOTE:** `fetchOpenJobs()` queries `.in("status", ["Open", "Closed"])` — effectively fetches ALL jobs, not just open ones. The "Closed" label is handled in the UI.

---

## 🤖 Match Score Algorithm (`src/lib/scoring.ts`)

- **Primary:** If `VITE_OPENAI_API_KEY` is valid → calls OpenAI GPT-4o-mini with a recruiter prompt
- **Fallback (default):** Local keyword matching:
  1. Tokenize job description + requirements (remove stopwords, lowercase)
  2. Take top 30 keywords by frequency
  3. Compare against jobseeker bio tokens (exact + partial match)
  4. Score = `Math.round(25 + rawScore * 73)`, clamped to [25, 98]
  5. If no bio → returns 30; if no job keywords → returns 50

---

## 🎨 UI & Styling Notes

- **CSS Framework:** Tailwind CSS v3
- **Component Library:** shadcn/ui (Radix UI primitives)
- **Animation:** Framer Motion (page transitions, card animations, confetti on "Hired")
- **Design Language:** Glassmorphism (`glass`, `glass-strong` classes), gradient backgrounds, animated auroras
- **Login/Signup Background:** 6-color analogous liquid orbs that track mouse via Lissajous curves + spring physics
- **Global Background:** Interactive mouse-tracking radial gradient + ambient aurora blobs + grid overlay
- **Logo:** Animated "HireFlow" with orbiting particles, color-shifting center glow, bouncing letters

### Notable CSS Classes (custom in index.css)
- `glass`, `glass-strong`, `glass-dark` — glassmorphism effects
- `gradient-text` — text with gradient color
- `animated-gradient-bg` — background animation
- `font-display` — display font for headings
- `custom-scrollbar`, `modern-scrollbar` — styled scrollbars

---

## 🧩 Components Detail

### `Badges.tsx`
- `MatchScoreBadge`: score ≥80 → accent (purple), ≥60 → primary (blue), else muted
- `StatusBadge`: color-coded for all 6 ApplicationStatus values
- **NOTE:** Imports `ApplicationStatus` from `src/data/mockData.ts`, NOT from `src/lib/supabase.ts`

### `CandidatePipeline.tsx`
- 6 Kanban columns: Applied → Screening → Interview → Offered → Hired → Rejected
- Filtering by job title tabs
- "Next Stage" button on hover; "Reject" button
- Confetti animation on "Hired" (canvas-confetti, 3 second burst)
- Delete confirmation via AlertDialog
- Stage colors defined in `stageColors` record

### `JobsManagement.tsx`
- Full CRUD for jobs
- Form in a Dialog (shadcn)
- Requirements: textarea, one per line, split on `\n`
- Toggle Open/Closed status inline

### `JobBoard.tsx`
- Loads all jobs + already-applied IDs in parallel
- Search by job title (client-side filter)
- Job detail Dialog on card click
- Apply button disabled for already-applied or Closed jobs

---

## 🔐 Auth Context (`src/contexts/AuthContext.tsx`)

- `user: Profile | null` — constructed from `session.user.user_metadata` (NOT fetched from DB)
- `loading: boolean`
- `login()` / `signup()` / `logout()` methods
- Listens to `onAuthStateChange` for persistent sessions
- `constructProfileFromUser()` maps Supabase user → Profile type from `user_metadata`

> **IMPORTANT:** The `user` object in auth context comes from Supabase auth metadata, not from the `profiles` table. Changes to the profiles table won't reflect until user logs out and back in.

---

## 📦 Dependencies Summary

### Key Runtime Deps
| Package | Version | Purpose |
|---|---|---|
| react / react-dom | ^18.3.1 | Core framework |
| react-router-dom | ^6.30.1 | Routing |
| @supabase/supabase-js | ^2.99.2 | Backend/Auth |
| @tanstack/react-query | ^5.83.0 | Server state (installed but limited use visible) |
| framer-motion | ^12.38.0 | Animations |
| tailwindcss | ^3.4.17 | Styling |
| lucide-react | ^0.462.0 | Icons |
| sonner | ^1.7.4 | Toast notifications |
| canvas-confetti | ^1.9.4 | Confetti on hire |
| recharts | ^2.15.4 | Charts (installed, dashboard uses custom bars) |
| zod + react-hook-form | various | Form validation |

---

## 🔧 Git & GitHub Status

- **Remote:** `origin` → `https://github.com/jaipisal/ATS-Application-Tracking-System-.git`
- **Branch:** `main`
- **Status:** Clean (up to date with origin/main)
- **Untracked:** `src/SuperDatabase Password.txt` (not committed, not in .gitignore)
- **Last 5 commits:**
  1. `4495f50` — Rebrand to HireFlow, improve Supabase connection error handling, and update SQL schema
  2. `e9cb49a` — Update README.md
  3. `26e5db3` — Update README.md
  4. `274f9ef` — fix(styles): browser compatibility and tailwind config types
  5. `e196c06` — Add live demo badge to README
- **Push access:** Configured. Remote is HTTPS. Will need credentials/token to push. **DO NOT PUSH unless explicitly instructed.**

---

## ✅ Bug Fixes Applied (2026-06-28)

| # | Bug | File | Fix |
|---|---|---|---|
| 1 | `ApplicationStatus` imported from legacy `mockData.ts` | `Badges.tsx` | Changed import to `@/lib/supabase` |
| 2 | `fetchOpenJobs()` fetched Open+Closed jobs | `api.ts` | Changed `.in(["Open","Closed"])` → `.eq("status","Open")` |
| 3 | Kanban grid `lg:grid-cols-5` but 6 stages | `CandidatePipeline.tsx` | Changed to `lg:grid-cols-6` |
| 4 | Auth `user` built from stale JWT metadata | `AuthContext.tsx` | Now fetches fresh from `profiles` DB table |
| 5 | `SuperDatabase Password.txt` untracked & sensitive | `.gitignore` | Added to `.gitignore` |

---

## ✅ Checkpoint Status
- [x] All 5 discovered bugs fixed
- [x] No pushes made to GitHub
- [x] Awaiting user's bug report

---

## ✅ Checkpoint Status

- [x] Root directory explored
- [x] `src/` directory fully explored
- [x] All page components read
- [x] All layout components read
- [x] All lib files read (supabase.ts, api.ts, scoring.ts, utils.ts)
- [x] Auth context read
- [x] Database schema read (supabase_schema.sql)
- [x] Mock data file read
- [x] Component files read (Badges, Logo, GlobalBackground, LogoutDialog, NavLink)
- [x] package.json read
- [x] Git remote & status checked
- [x] No changes made to any file

---

## 🎨 UI Redesign Checkpoint (2026-07-06)

### Changes Made: `src/pages/LandingPage.tsx`

3 AI-looking sections on the landing page were redesigned:

#### 1. Hero CTA Buttons (was: plain rounded-full gradient pills)
- **Primary button**: Now a layered rounded-2xl with outer glow ring, shimmer sweep on hover, Rocket icon
- **Secondary button**: Glass-morphic white card with amber Star icon, gradient border reveal on hover
- Both use `<div>/<button>` wrappers instead of shadcn `<Button>` for richer layered effects

#### 2. Stats Section (was: single wide glass panel with 3 centered numbers)
- **Now**: 3 individual cards (grid-cols-3), each with:
  - Icon in colored rounded-xl
  - Gradient number (per-card accent color)
  - Sub-label text
  - Animated progress bar that fills on scroll-in
  - Corner glow that intensifies on hover
  - Cards: Building2 / CheckCircle2 / BarChart3 icons

#### 3. CTA Section (was: centered gradient blob with white button)
- **Now**: Dark (`#0f0e1a`) mesh-gradient split-layout card:
  - Left: eyebrow chip with pulsing green dot, new headline "Your next great hire / is one click away.", 2 CTAs
  - Right: floating mini dashboard card (animated float loop) showing weekly stats with gradient bars and 87% accuracy metric
  - Grid lines overlay for depth
  - Deep indigo box-shadow

#### Stats values (frontend-only, no backend connection):
- 500+ Startups Hiring
- 2,400+ Candidates Placed  
- 87% Match Accuracy

#### New imports added:
- Icons: `TrendingUp, CheckCircle2, Star, Building2, BarChart3, Rocket`
- Framer Motion: `useMotionValue, useTransform, animate` (imported for future use)
- React: `useEffect, useRef, useState`

### Status
- [x] Hero CTA buttons redesigned
- [x] Stats section redesigned (3 individual metric cards)
- [x] CTA section redesigned (dark split-layout with floating card)
- [x] Checkpoint updated
- [ ] Push to GitHub (DO NOT push unless explicitly instructed)

---

## 🎨 UI Update Checkpoint v2 (2026-07-06 — Button Redesign + Footer)

### Changes Made: `src/pages/LandingPage.tsx`

#### Hero CTA Buttons (v2 — split-pill design)
- **Primary "Start Hiring Free"**: Split-pill with a dark `indigo-700` icon tab (Rocket) on the left separated by a border, `indigo-600` text area on the right. Has a bottom shadow (`0 2px 0`) giving a physical pressed feel. Shimmer sweep on hover. No glow blur.
- **Secondary "Browse open roles"**: Pure text link with `ChevronRight` icon. On hover: text turns indigo + a gradient underline draws in from left to right (width: 0 → 100%). No background/border at all — completely different language from primary.
- **Below buttons**: Micro social-proof strip with 4 colored avatar initials + "500+ teams hired this month" + green dot "No credit card"

#### Footer (NEW — 4-column glassmorphic)
- Glass background: `bg-white/30 backdrop-blur-xl`
- Top gradient divider line
- **Brand column**: Logo + tagline + 3 social icon buttons (Twitter X / GitHub / LinkedIn) as rounded-lg icon squares
- **Product column**: Job Board, Kanban Pipeline, AI Matching, Analytics, Integrations
- **Company column**: About, Blog, Careers, Press, Contact
- **Legal column**: Privacy Policy, Terms of Service, Cookie Policy, Security + "All systems operational" green pulsing badge
- **Bottom bar**: © 2026 HireFlow, Inc. | "Built with ♥ for fast-growing teams"

### Status
- [x] Hero CTA buttons redesigned (v2 split-pill)
- [x] Social-proof avatar strip added below buttons
- [x] Full 4-column footer added
- [x] Checkpoint updated
- [ ] Push to GitHub (DO NOT push unless explicitly instructed)

---

## 🎨 UI Update Checkpoint v3 (2026-07-06 — Role Cards + Real Footer)

### Changes Made: `src/pages/LandingPage.tsx`

#### Hero CTA Area (v3 — dual role-selector cards, NO buttons)
- Removed all buttons entirely
- **"I want to…" label** above the cards (subtle uppercase label for context)
- **Two side-by-side interactive cards** (max-w-xl), each with:
  - Icon in colored rounded-xl (Briefcase/indigo for employer, Users/purple for jobseeker)
  - Radio-circle in top-right that fills on hover
  - Title + description text
  - Bottom row with colored action text + animated ArrowRight
  - On hover: colored border ring + white background + colored box-shadow glow
- Vertical "or" divider between the two cards (desktop) / plain "or" text (mobile)
- Pattern reference: similar to Airbnb/Toptal role-picker onboarding

#### Footer (v3 — real content, 3 columns)
- **Brand column**: Logo + honest tagline + 3 social icon squares (Twitter, GitHub with real repo URL, LinkedIn)
- **"What's inside" column**: 5 feature lines with icons (Briefcase, Users, Target, Zap, Shield) — reflects actual app features
- **"Quick links" column**: Live Demo (updated to https://hire-ats.vercel.app/), Source Code (GitHub), Log in, Sign up free — all REAL routes/URLs. Plus tech stack badges: React 18, TypeScript, Supabase, Framer Motion
- **Bottom bar**: © 2026 HireFlow + "Live on Vercel" pulsing green badge

### Status
- [x] Hero CTA buttons removed, replaced with role-selector cards
- [x] Footer fake links removed, replaced with real content
- [x] Live Demo URL updated to `https://hire-ats.vercel.app/`
- [x] Checkpoint updated
- [x] Push to GitHub (User instructed to push changes)
