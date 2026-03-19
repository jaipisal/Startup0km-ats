import { ApplicationStatus } from "@/data/mockData";

interface MatchScoreBadgeProps {
  score: number;
  size?: "sm" | "md";
}

export const MatchScoreBadge = ({ score, size = "sm" }: MatchScoreBadgeProps) => {
  const getColor = () => {
    if (score >= 80) return "text-accent bg-accent/8 border-accent/15 shadow-[0_0_8px_hsl(263_70%_50%/0.1)]";
    if (score >= 60) return "text-primary bg-primary/8 border-primary/15";
    return "text-muted-foreground bg-muted border-border";
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold tabular-nums transition-all ${getColor()} ${
      size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3.5 py-1 text-sm"
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${score >= 80 ? "bg-accent animate-pulse-soft" : score >= 60 ? "bg-primary" : "bg-muted-foreground/40"}`} />
      {score}%
    </span>
  );
};

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles: Record<ApplicationStatus, string> = {
    Applied: "bg-secondary text-secondary-foreground border-border",
    Screening: "bg-primary/8 text-primary border-primary/15",
    Interview: "bg-warning/8 text-warning border-warning/15",
    Offered: "bg-success/8 text-success border-success/15",
    Rejected: "bg-destructive/8 text-destructive border-destructive/15",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
};
