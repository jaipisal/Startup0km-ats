import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️ Supabase env vars missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─────────────────────────────────────────────
// Typed database types (mirrors your SQL schema)
// ─────────────────────────────────────────────

export type UserRole = "employer" | "jobseeker";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  resume_url?: string;
  company?: string;
  created_at?: string;
}

export type JobType = "Full-time" | "Part-time" | "Contract" | "Remote";
export type JobStatus = "Open" | "Closed";

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  description: string;
  requirements: string[];
  salary?: string;
  status: JobStatus;
  posted_at: string;
  created_at?: string;
  // Joined from profiles (optional)
  profiles?: Pick<Profile, "name" | "company">;
}

export type ApplicationStatus =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offered"
  | "Rejected"
  | "Hired";

export interface Application {
  id: string;
  job_id: string;
  jobseeker_id: string;
  status: ApplicationStatus;
  match_score: number;
  applied_at: string;
  created_at?: string;
  // Joined from profiles (jobseeker info)
  profiles?: Pick<Profile, "name" | "bio" | "resume_url">;
  // Joined from jobs
  jobs?: Pick<Job, "title" | "company" | "location" | "type">;
}
