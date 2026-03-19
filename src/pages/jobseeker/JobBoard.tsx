import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchOpenJobs, fetchAppliedJobIds, applyToJob } from "@/lib/api";
import { Job } from "@/lib/supabase";
import { Search, MapPin, Briefcase, DollarSign, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";

const JobBoard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const load = async () => {
      const [allJobs, appliedIds] = await Promise.all([
        fetchOpenJobs(),
        user ? fetchAppliedJobIds(user.id) : Promise.resolve([]),
      ]);
      setJobs(allJobs);
      setAppliedJobIds(appliedIds);
      setLoading(false);
    };
    load();
  }, [user]);

  const openJobs = jobs.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = async (job: Job) => {
    if (!user) {
      toast.error("Please log in to apply.");
      return;
    }
    setApplying(job.id);
    try {
      await applyToJob(job, user);
      setAppliedJobIds((prev) => [...prev, job.id]);
      toast.success("Application submitted!", {
        description: "You've successfully applied for this position.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to apply.";
      toast.error(msg.includes("unique") ? "You already applied for this job." : msg);
    } finally {
      setApplying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-foreground">Find Your Next Role</h1>
        <p className="text-sm text-muted-foreground mt-1">Browse open positions and apply with one click</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by job title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 rounded-xl shadow-card"
        />
      </div>

      {/* Job Cards */}
      <div className="space-y-3">
        {openJobs.map((job, i) => {
          const hasApplied = appliedJobIds.includes(job.id);
          const isApplying = applying === job.id;
          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className="rounded-xl border border-border/60 bg-card p-5 shadow-card hover:shadow-card-hover hover:border-primary/15 transition-all duration-150 cursor-pointer"
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-foreground mb-1.5">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                    <span className="bg-secondary rounded-full px-2 py-0.5 font-medium">{job.type}</span>
                    {job.salary && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{job.description}</p>
                </div>
                <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                  {hasApplied ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
                      <CheckCircle2 className="h-4 w-4" /> Applied
                    </span>
                  ) : (
                    <Button size="sm" variant="gradient" disabled={isApplying} onClick={() => handleApply(job)}>
                      {isApplying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Quick Apply"}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        {openJobs.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No jobs found{search ? ` matching "${search}"` : ""}.</p>
          </div>
        )}
      </div>

      {/* Job Detail Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        {selectedJob && (
          <DialogContent className="max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">{selectedJob.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 mt-2">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />{selectedJob.company}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{selectedJob.location}</span>
                <span className="bg-secondary rounded-full px-2.5 py-0.5 text-xs font-medium">{selectedJob.type}</span>
                {selectedJob.salary && <span>{selectedJob.salary}</span>}
              </div>
              <div>
                <h4 className="font-display font-semibold text-foreground text-sm mb-2">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedJob.description}</p>
              </div>
              <div>
                <h4 className="font-display font-semibold text-foreground text-sm mb-2.5">Requirements</h4>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req) => (
                    <li key={req} className="text-sm text-muted-foreground flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              {appliedJobIds.includes(selectedJob.id) ? (
                <div className="flex items-center justify-center gap-2 text-success text-sm font-semibold py-3 bg-success/5 rounded-xl">
                  <CheckCircle2 className="h-4 w-4" /> You've already applied
                </div>
              ) : (
                <Button
                  variant="gradient"
                  className="w-full h-11"
                  disabled={applying === selectedJob.id}
                  onClick={() => { handleApply(selectedJob); setSelectedJob(null); }}
                >
                  <Sparkles className="h-4 w-4 mr-1" /> Apply Now
                </Button>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default JobBoard;
