import { supabase, Job, Application, ApplicationStatus, Profile } from "./supabase";
import { calculateMatchScore } from "./scoring"; // AI match scoring logic

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signupUser(
  email: string,
  password: string,
  metadata: { name: string; role: "employer" | "jobseeker"; company?: string; bio?: string }
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  if (error) throw error;
  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfileById(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data as Profile;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return getProfileById(user.id);
}

// ─────────────────────────────────────────────
// JOBS
// ─────────────────────────────────────────────

export async function fetchOpenJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "Open")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Job[];
}

export async function fetchEmployerJobs(employerId: string): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("employer_id", employerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Job[];
}

export async function createJob(
  job: Omit<Job, "id" | "created_at" | "posted_at">
): Promise<Job> {
  const { data, error } = await supabase
    .from("jobs")
    .insert([job])
    .select()
    .single();

  if (error) throw error;
  return data as Job;
}

export async function updateJob(
  id: string,
  updates: Partial<Omit<Job, "id" | "employer_id" | "created_at">>
): Promise<Job> {
  const { data, error } = await supabase
    .from("jobs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Job;
}

export async function deleteJob(id: string): Promise<void> {
  const { error } = await supabase.from("jobs").delete().eq("id", id);
  if (error) throw error;
}

// ─────────────────────────────────────────────
// APPLICATIONS
// ─────────────────────────────────────────────

/** Employer: fetch all applications for jobs they own */
export async function fetchApplicationsForEmployer(employerId: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      profiles:jobseeker_id ( name, bio, resume_url ),
      jobs:job_id ( title, company, location, type )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  // Filter: only apps where the job belongs to this employer
  const employerJobs = await fetchEmployerJobs(employerId);
  const ownJobIds = new Set(employerJobs.map((j) => j.id));
  return ((data ?? []) as Application[]).filter((a) => ownJobIds.has(a.job_id));
}

/** Jobseeker: fetch their own applications */
export async function fetchMyApplications(jobseekerId: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      jobs:job_id ( title, company, location, type )
    `)
    .eq("jobseeker_id", jobseekerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Application[];
}

/** Check which jobs a jobseeker has already applied to */
export async function fetchAppliedJobIds(jobseekerId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("job_id")
    .eq("jobseeker_id", jobseekerId);

  if (error) return [];
  return (data ?? []).map((a) => a.job_id as string);
}

/** Jobseeker applies to a job — also calculates match score */
export async function applyToJob(
  job: Job,
  jobseeker: Profile
): Promise<Application> {
  // Calculate match score from job description vs jobseeker bio
  const score = await calculateMatchScore(job.description, job.requirements, jobseeker.bio ?? "");

  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        job_id: job.id,
        jobseeker_id: jobseeker.id,
        status: "Applied",
        match_score: score,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Application;
}

/** Delete an application (Employer cleanup) */
export async function deleteApplication(id: string): Promise<void> {
  const { error } = await supabase.from(\"applications\").delete().eq(\"id\", id);
  if (error) throw error;
}

/** Employer moves a candidate through hiring stages */
export async function updateApplicationStatus(
  applicationId: string,
  newStatus: ApplicationStatus
): Promise<void> {
  const { error } = await supabase
    .from("applications")
    .update({ status: newStatus })
    .eq("id", applicationId);

  if (error) throw error;
}

/** Stats for employer dashboard */
export async function fetchEmployerStats(employerId: string) {
  const jobs = await fetchEmployerJobs(employerId);
  const applications = await fetchApplicationsForEmployer(employerId);

  const openJobs = jobs.filter((j) => j.status === "Open").length;
  const totalApps = applications.length;
  const interviews = applications.filter((a) => a.status === "Interview").length;
  const avgMatch =
    totalApps > 0
      ? Math.round(applications.reduce((s, a) => s + a.match_score, 0) / totalApps)
      : 0;

  return { openJobs, totalApps, interviews, avgMatch, jobs, applications };
}
