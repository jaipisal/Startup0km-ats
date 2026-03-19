import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApplicationsForEmployer, updateApplicationStatus } from "@/lib/api";
import { Application, ApplicationStatus } from "@/lib/supabase";
import { MatchScoreBadge } from "@/components/Badges";
import { Button } from "@/components/ui/button";
import { ChevronRight, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const STAGES: ApplicationStatus[] = ["Applied", "Screening", "Interview", "Offered", "Hired", "Rejected"];

const stageColors: Record<ApplicationStatus, string> = {
  Applied: "from-muted-foreground/60 to-muted-foreground/40",
  Screening: "from-primary to-primary/70",
  Interview: "from-warning to-warning/70",
  Offered: "from-primary/60 to-primary/40",
  Hired: "from-emerald-500/60 to-emerald-500/40",
  Rejected: "from-destructive/60 to-destructive/40",
};

const CandidatePipeline = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("all");

  useEffect(() => {
    if (!user) return;
    fetchApplicationsForEmployer(user.id)
      .then(setApplications)
      .finally(() => setLoading(false));
  }, [user]);

  // Get unique job titles for the filter tabs
  const uniqueJobs = Array.from(
    new Map(
      applications
        .filter((a) => a.jobs?.title)
        .map((a) => [a.job_id, a.jobs!.title])
    ).entries()
  );

  const filtered =
    selectedJobTitle === "all"
      ? applications
      : applications.filter((a) => a.job_id === selectedJobTitle);

  const moveToStage = async (appId: string, newStatus: ApplicationStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
      if (newStatus === "Hired") {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10b981", "#34d399", "#6ee7b7", "#ffffff"],
        });
        toast.success(`🎉 Congratulations! Candidate Hired!`, {
          description: "The position has been successfully filled.",
          duration: 5000,
        });
      } else if (newStatus === "Rejected") {
        toast.error(`Application Rejected`, {
          description: "The candidate has been moved to the rejected list.",
          icon: "😔",
        });
      } else {
        toast.success(`Moved to ${newStatus}`);
      }
    } catch {
      toast.error("Failed to update status.");
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Candidate Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage applicants through stages</p>
        </div>
      </div>

      {/* Job Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedJobTitle("all")}
          className={`text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-100 ${selectedJobTitle === "all" ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
        >
          All Jobs
        </button>
        {uniqueJobs.map(([jobId, title]) => (
          <button
            key={jobId}
            onClick={() => setSelectedJobTitle(jobId)}
            className={`text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-100 ${selectedJobTitle === jobId ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start">
        {STAGES.map((stage, stageIdx) => {
          const stageApps = filtered.filter((a) => a.status === stage);
          return (
            <div key={stage} className="flex flex-col gap-4">
              {/* Stage header */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${stageColors[stage]} shadow-[0_0_8px_rgba(0,0,0,0.1)]`} />
                  <span className="text-[13px] font-black text-foreground uppercase tracking-tight">{stage}</span>
                </div>
                <span className="text-[10px] font-black text-muted-foreground bg-secondary/50 backdrop-blur-sm rounded-lg px-2 py-0.5 border border-black/5">{stageApps.length}</span>
              </div>

              <div className="space-y-4 min-h-[500px] p-1">
                <AnimatePresence mode="popLayout">
                  {stageApps.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="rounded-[2rem] border-2 border-dashed border-black/5 flex items-center justify-center py-10"
                    >
                      <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest whitespace-nowrap">No Candidates</p>
                    </motion.div>
                  )}
                  {stageApps.map((app) => {
                  const nextStage = stageIdx < STAGES.length - 2 ? STAGES[stageIdx + 1] : null;
                  const name = app.profiles?.name ?? "Candidate";
                  const bio = app.profiles?.bio ?? "";

                  return (
                    <motion.div
                      key={app.id}
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="group rounded-[1.8rem] glass border-white/60 p-4 space-y-3 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:translate-y-[-2px] transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-[1.1rem] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <span className="text-[10px] font-black text-primary">{name.split(" ").map(n => n[0]).join("")}</span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-bold text-foreground truncate group-hover:text-primary transition-colors">{name}</div>
                            {selectedJobTitle === "all" && (
                              <div className="text-[10px] text-muted-foreground truncate font-medium">{app.jobs?.title}</div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="bg-accent/5 px-2 py-0.5 rounded-lg border border-accent/10">
                           <span className="text-[10px] font-black text-accent">{app.match_score}%</span>
                        </div>
                        <div className="text-[9px] font-bold text-muted-foreground opacity-60 uppercase">Match</div>
                      </div>

                      {bio && <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2 italic opacity-80">"{bio}"</p>}
                      
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        {nextStage && stage !== "Rejected" && stage !== "Hired" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 justify-between text-[10px] h-9 font-bold rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20"
                            onClick={() => moveToStage(app.id, nextStage)}
                          >
                            Next: {nextStage} <ChevronRight className="h-3 w-3" />
                          </Button>
                        )}
                        {stage !== "Rejected" && stage !== "Hired" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[10px] h-9 font-bold rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20"
                            onClick={() => moveToStage(app.id, "Rejected")}
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CandidatePipeline;
