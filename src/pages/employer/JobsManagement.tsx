import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchEmployerJobs, createJob, updateJob, deleteJob } from "@/lib/api";
import { Job, JobType } from "@/lib/supabase";
import { Plus, Pencil, Trash2, MapPin, Clock, DollarSign, Loader2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";

type FormData = {
  title: string;
  location: string;
  type: JobType;
  description: string;
  salary: string;
  requirements: string;
};

const blank: FormData = { title: "", location: "", type: "Full-time", description: "", salary: "", requirements: "" };

const JobsManagement = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(blank);

  useEffect(() => {
    if (!user) return;
    fetchEmployerJobs(user.id)
      .then(setJobs)
      .finally(() => setLoading(false));
  }, [user]);

  const openCreate = () => {
    setEditingJob(null);
    setFormData(blank);
    setIsDialogOpen(true);
  };

  const openEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      location: job.location,
      type: job.type,
      description: job.description,
      salary: job.salary ?? "",
      requirements: job.requirements.join("\n"),
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!user || !formData.title.trim()) {
      toast.error("Job title is required.");
      return;
    }
    setSaving(true);
    try {
      const reqs = formData.requirements.split("\n").filter(Boolean);
      if (editingJob) {
        const updated = await updateJob(editingJob.id, {
          title: formData.title,
          location: formData.location,
          type: formData.type,
          description: formData.description,
          salary: formData.salary,
          requirements: reqs,
        });
        setJobs((prev) => prev.map((j) => (j.id === editingJob.id ? updated : j)));
        toast.success("Job updated!");
      } else {
        const newJob = await createJob({
          employer_id: user.id,
          title: formData.title,
          company: user.company ?? "My Company",
          location: formData.location,
          type: formData.type,
          description: formData.description,
          requirements: reqs,
          salary: formData.salary,
          status: "Open",
        });
        setJobs((prev) => [newJob, ...prev]);
        toast.success("Job posted successfully!");
      }
      setIsDialogOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save job.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast.success("Job deleted.");
    } catch {
      toast.error("Failed to delete job.");
    }
  };

  const toggleStatus = async (job: Job) => {
    const newStatus = job.status === "Open" ? "Closed" : "Open";
    try {
      const updated = await updateJob(job.id, { status: newStatus });
      setJobs((prev) => prev.map((j) => (j.id === job.id ? updated : j)));
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
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
            Jobs <span className="gradient-text">Management</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm font-medium">Create and manage your active job listings.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="rounded-2xl shadow-lg shadow-primary/20 h-11 px-6 bg-gradient-to-r from-primary to-accent">
              <Plus className="h-4 w-4 mr-2" /> Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] glass-strong border-white/40 shadow-2xl p-8 modern-scrollbar">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl font-bold">{editingJob ? "Edit Job" : "Post New Job"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Job Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Senior Frontend Engineer" className="h-12 rounded-[1.2rem] glass border-white/20 px-5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Location</Label>
                  <Input value={formData.location} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} placeholder="e.g. Remote" className="h-12 rounded-[1.2rem] glass border-white/20 px-5" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Salary Range</Label>
                  <Input value={formData.salary} onChange={(e) => setFormData((p) => ({ ...p, salary: e.target.value }))} placeholder="e.g. $100k–$140k" className="h-12 rounded-[1.2rem] glass border-white/20 px-5" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Job Type</Label>
                <select
                  className="w-full h-12 rounded-[1.2rem] glass border-white/20 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={formData.type}
                  onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as JobType }))}
                >
                  {["Full-time", "Part-time", "Contract", "Remote"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Description</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={3} className="rounded-[1.2rem] glass border-white/20 px-5 py-3 min-h-[100px]" placeholder="What are the core responsibilities?" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">Requirements (one per line)</Label>
                <Textarea value={formData.requirements} onChange={(e) => setFormData((p) => ({ ...p, requirements: e.target.value }))} rows={3} className="rounded-[1.2rem] glass border-white/20 px-5 py-3 min-h-[100px]" placeholder="5+ years React&#10;TypeScript proficiency" />
              </div>
              <Button onClick={handleSave} className="w-full h-12 rounded-[1.2rem] bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20 font-bold" disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</> : editingJob ? "Save Changes" : "Post Job"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {jobs.length === 0 ? (
          <div className="col-span-full py-20 text-center glass-strong rounded-[3rem] border-dashed border-2 border-black/5">
            <div className="h-24 w-24 rounded-[2.5rem] bg-secondary flex items-center justify-center mx-auto mb-6">
              <Briefcase className="h-12 w-12 text-muted-foreground opacity-20" />
            </div>
            <h3 className="font-display font-bold text-2xl text-foreground">Launch your first role</h3>
            <p className="text-muted-foreground mt-2 max-w-xs mx-auto text-sm">Post a job to start receiving applications from top-tier candidates.</p>
            <Button onClick={openCreate} variant="outline" className="mt-8 rounded-2xl border-primary/20 text-primary hover:bg-primary/5 px-8">
              Post Job Now
            </Button>
          </div>
        ) : (
          jobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group glass rounded-[2.5rem] p-7 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border-white/60 flex flex-col relative overflow-hidden h-full"
            >
              {/* Status Badge */}
              <div className="absolute top-7 right-7">
                <button
                  onClick={() => toggleStatus(job)}
                  className={`text-[10px] font-black uppercase tracking-widest rounded-full px-3 py-1 border transition-all ${job.status === "Open" ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground border-border"}`}
                >
                  {job.status}
                </button>
              </div>

              <div className="flex items-start gap-5 mb-8">
                <div className="h-14 w-14 rounded-[1.5rem] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0 pr-12">
                  <h3 className="font-display font-bold text-xl text-foreground truncate group-hover:text-primary transition-colors leading-tight">{job.title}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-bold uppercase tracking-tighter mt-1.5">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-secondary/50 backdrop-blur-sm rounded-[1.2rem] p-4 border border-black/5">
                  <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-tighter mb-1.5">Type</div>
                  <div className="text-xs font-bold text-foreground">{job.type}</div>
                </div>
                <div className="bg-secondary/50 backdrop-blur-sm rounded-[1.2rem] p-4 border border-black/5">
                  <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-tighter mb-1.5">Posted</div>
                  <div className="text-xs font-bold text-foreground">
                    {job.posted_at ? new Date(job.posted_at).toLocaleDateString() : 'Draft'}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-7 border-t border-black/5 flex items-center justify-between gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 rounded-2xl text-[11px] font-bold h-11 border border-transparent hover:border-black/5 hover:bg-black/5 transition-all"
                  onClick={() => openEdit(job)}
                >
                  <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                </Button>
                <Link to="/employer/candidates" className="flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full rounded-2xl text-[11px] font-bold h-11 text-primary bg-primary/5 hover:bg-primary/10 border border-transparent hover:border-primary/10 transition-all font-display"
                  >
                    View Candidates
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-2xl h-11 w-11 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                  onClick={() => handleDelete(job.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobsManagement;
