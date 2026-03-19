# 👋 Startup0km ATS — MVP Submission

**A professional, AI-powered Applicant Tracking System (ATS) built for the Startup0km assignment.**  
Built with **React 18 + Vite + TypeScript + Supabase (PostgreSQL)**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black)](https://startup0km-ats-elrm.vercel.app/)

---

## 🚀 Features

| Role | Features |
|---|---|
| **Employer** | Post / Edit / Delete jobs, Kanban pipeline (Applied → Screening → Interview → Offered), Dashboard stats |
| **Jobseeker** | Browse open jobs, One-click apply, Track application status + AI match score |
| **Both** | Real auth (Supabase), Role-based access control, Row Level Security |

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend/DB**: Supabase (PostgreSQL + Auth + RLS)
- **AI Matching**: Keyword-based match score (0–100%) — no API key needed
- **Hosting**: Vercel (frontend) + Supabase (backend)

---

## 📦 Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/your-username/career-compass-main.git
cd career-compass-main
npm install --legacy-peer-deps
```

### 2. Create a Supabase project
1. Go to [supabase.com](https://supabase.com) and click **New Project**
2. Once created, go to **Settings → API** and copy:
   - **Project URL** (looks like `https://abcxyz.supabase.co`)
   - **anon / public key**

### 3. Set up the database
1. In Supabase dashboard → **SQL Editor**
2. Paste the entire contents of `supabase_schema.sql` and click **Run**
3. This creates the `profiles`, `jobs`, and `applications` tables with RLS policies

### 4. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 5. Run locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

---

## 🗺️ App Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/signup` | Register as Employer or Jobseeker |
| `/login` | Sign in |
| `/employer` | Employer dashboard (stats + recent apps) |
| `/employer/jobs` | Post / Edit / Delete job listings |
| `/employer/candidates` | Kanban pipeline — move candidates through stages |
| `/jobseeker` | Browse all open jobs with search |
| `/jobseeker/applications` | Track your own application statuses |

---

## 🌐 Deploying to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B — GitHub Integration
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. In **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**

> **Important**: In Supabase → Authentication → URL Configuration, add your Vercel URL to **Site URL** and **Redirect URLs**.

---

## 🤖 AI Match Score

When a jobseeker applies, the system automatically:
1. Extracts keywords from the job description + requirements
2. Compares them against the jobseeker's bio
3. Returns a **0–100 match score** displayed as a badge

No external API required. To upgrade to GPT scoring, see the commented code in `src/lib/matchScore.ts`.

---

## 🗄️ Database Schema

```
profiles          jobs                  applications
──────────────    ──────────────────    ──────────────────────
id (FK → auth)    id                    id
name              employer_id (FK)      job_id (FK → jobs)
email             title                 jobseeker_id (FK → profiles)
role              company               status (Applied/Screening/...)
bio               location              match_score
resume_url        type                  applied_at
company           description           created_at
created_at        requirements[]
                  salary
                  status (Open/Closed)
                  posted_at
```

See `supabase_schema.sql` for the full SQL with RLS policies.

---

## 📋 Project Structure

```
src/
├── lib/
│   ├── supabase.ts      ← Supabase client + TypeScript types
│   ├── api.ts           ← All DB operations (auth, jobs, applications)
│   ├── matchScore.ts    ← AI match score algorithm
│   └── utils.ts
├── contexts/
│   └── AuthContext.tsx  ← Real Supabase Auth + session management
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── employer/        ← Dashboard, Jobs, Candidates
│   └── jobseeker/       ← JobBoard, MyApplications
└── components/
    ├── EmployerLayout.tsx
    ├── JobseekerLayout.tsx
    ├── Badges.tsx       ← MatchScoreBadge, StatusBadge
    └── ui/              ← shadcn/ui components
```

---

## 🔐 Security (Row Level Security)

- **profiles**: Anyone can read; users can only edit their own
- **jobs**: Anyone can view; only the employer who created can edit/delete
- **applications**: Jobseeker can see their own; employer can see apps on their jobs; only employer can update status

---

## 📄 License

MIT — free to use and modify.
