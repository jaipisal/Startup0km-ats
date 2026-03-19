import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className, size = "md" }: LogoProps) => {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl"
  };

  const ts = sizes[size];

  return (
    <Link 
      to="/" 
      className={cn(
        "group flex items-center font-display w-fit transition-all hover:scale-[1.01] active:scale-[0.99] duration-300", 
        ts,
        className
      )}
    >
      <span className="font-bold text-foreground tracking-tight flex items-baseline">
        Startup
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-black tracking-tighter ml-[1px]">
          0KM
        </span>
        <span className="inline-block w-[0.16em] h-[0.16em] bg-accent rounded-full ml-[0.06em] shadow-[0_0_8px_hsl(var(--accent))]" />
      </span>
    </Link>
  );
};
