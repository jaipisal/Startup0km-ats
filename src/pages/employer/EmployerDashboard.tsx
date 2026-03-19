import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchEmployerStats } from "@/lib/api";
import { Application, Job } from "@/lib/supabase";
import { Briefcase, Users, TrendingUp, Clock, Loader2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MatchScoreBadge, StatusBadge } from "@/components/Badges";
import { motion } from "framer-motion";

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ openJobs: 0, totalApps: 0, interviews: 0, avgMatch: 0 });
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchEmployerStats(user.id).then((data) => {
      setStats({
        openJobs: data.openJobs,
        totalApps: data.totalApps,
        interviews: data.interviews,
        avgMatch: data.avgMatch,
      });
      setRecentApps(data.applications.slice(0, 5));
      setJobs(data.jobs);
    }).finally(() => setLoading(false));
  }, [user]);

  const statCards = [
    { label: "Open Positions", value: stats.openJobs, icon: Briefcase, color: "text-primary", bg: "bg-primary/8" },
    { label: "Total Applicants", value: stats.totalApps, icon: Users, color: "text-foreground", bg: "bg-secondary" },
    { label: "In Interview", value: stats.interviews, icon: Clock, color: "text-warning", bg: "bg-warning/8" },
    { label: "Avg Match Score", value: `${stats.avgMatch}%`, icon: TrendingUp, color: "text-accent", bg: "bg-accent/8" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
            Good morning, <span className="gradient-text font-extrabold">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm font-medium">Here's what's happening with your hiring pipeline today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/employer/jobs">
            <Button variant="gradient" className="rounded-2xl shadow-lg shadow-primary/20 h-11 px-6">
              <Briefcase className="h-4 w-4 mr-2" /> Post New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Bento Grid layout for Stats & Chart */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-10">
        {/* Main Stats - Bento Style */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Large Chart Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="sm:col-span-2 glass-strong rounded-[2.5rem] p-8 min-h-[320px] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8">
              <TrendingUp className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-6">
                <h3 className="font-display font-bold text-xl text-foreground">Application Trends</h3>
                <p className="text-xs text-muted-foreground">Match score distribution across your jobs</p>
              </div>
              <div className="flex-1 mt-auto">
                 {/* Simple Match Score Distribution Chart */}
                 <div className="flex items-end justify-between gap-2 h-32">
                    {[35, 65, 45, 85, 55, 95, 75].map((h, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                        className={`w-full rounded-t-xl bg-gradient-to-t ${i === 5 ? 'from-primary to-accent' : 'from-secondary to-secondary/50'} relative group/bar`}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover/bar:opacity-100 transition-opacity bg-foreground text-background px-2 py-1 rounded-md">
                          {h}%
                        </div>
                      </motion.div>
                    ))}
                 </div>
                 <div className="flex justify-between mt-4 px-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                      <span key={d} className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">{d}</span>
                    ))}
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Individual Stats */}
          {statCards.map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="glass p-6 rounded-[2rem] border-white/60 hover:border-primary/40 transition-all duration-300 group hover:translate-y-[-4px]"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-2xl ${bg} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</div>
                  <div className="font-display text-3xl font-black text-foreground">{value}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Sidebar Bento Piece - Recent Activity */}
        <div className="md:col-span-4 space-y-5">
           <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-strong rounded-[2.5rem] p-7 h-full flex flex-col border-white/40"
           >
              <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="font-display font-bold text-lg text-foreground">Top Candidates</h2>
                <Link to="/employer/candidates" className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-5 flex-1 overflow-auto max-h-[480px] custom-scrollbar pr-2">
                {recentApps.length === 0 ? (
                  <div className="py-20 text-center opacity-40">
                    <Users className="h-10 w-10 mx-auto mb-3" />
                    <p className="text-xs font-bold">Waiting for applicants...</p>
                  </div>
                ) : (
                  recentApps.map((app, i) => {
                    const job = jobs.find((j) => j.id === app.job_id);
                    const name = app.profiles?.name ?? "Candidate";
                    const initials = name.split(" ").map((n) => n[0]).join("");
                    return (
                      <motion.div 
                        key={app.id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-4 group/item cursor-pointer"
                      >
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover/item:scale-105 transition-all outline outline-0 group-hover/item:outline-4 outline-primary/5">
                           <span className="text-xs font-black text-primary uppercase">{initials}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-bold text-foreground truncate group-hover/item:text-primary transition-colors">{name}</div>
                          <div className="text-[11px] text-muted-foreground truncate font-medium">Applied for {job?.title ?? app.jobs?.title}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-black text-accent bg-accent/5 px-2 py-0.5 rounded-full mb-1">{app.match_score}%</div>
                          <div className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Match</div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-black/5">
                <div className="bg-primary/5 rounded-2xl p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/30">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                     <p className="text-[11px] font-bold text-primary uppercase tracking-tight">Hiring Velocity</p>
                     <p className="text-xs font-medium text-muted-foreground">Up <span className="text-success font-bold">12%</span> this week</p>
                  </div>
                </div>
              </div>
           </motion.div>
        </div>
      </div>
    </>
  );
};

export default EmployerDashboard;
