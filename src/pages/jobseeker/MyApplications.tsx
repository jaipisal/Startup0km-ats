import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMyApplications } from "@/lib/api";
import { Application } from "@/lib/supabase";
import { StatusBadge, MatchScoreBadge } from "@/components/Badges";
import { FileText, Briefcase, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchMyApplications(user.id)
      .then(setApplications)
      .finally(() => setLoading(false));
  }, [user]);

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
        <h1 className="font-display text-2xl font-bold text-foreground">My Applications</h1>
        <p className="text-sm text-muted-foreground mt-1">Track the status of your job applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="font-display font-semibold text-foreground text-lg mb-1">No applications yet</p>
          <p className="text-sm">Browse the job board and apply to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className="rounded-xl border border-border/60 bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow duration-150"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-foreground mb-1.5">
                    {app.jobs?.title ?? "Unknown Job"}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {app.jobs?.company && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />{app.jobs.company}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />Applied {app.applied_at}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <MatchScoreBadge score={app.match_score} />
                  <StatusBadge status={app.status} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
