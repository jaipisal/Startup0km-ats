import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, User, Loader2, AlertCircle } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Logo } from "@/components/Logo";

const SignupPage = () => {
  const [role, setRole] = useState<UserRole>("jobseeker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Orbital Physics Engine
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);

  useEffect(() => {
    let animationFrameId: number;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      const time = performance.now() * 0.0005; // Slow, elegant time scale
      // Lissajous curve for complex, non-repeating infinite drift
      const driftX = Math.sin(time) * 350 + Math.cos(time * 0.7) * 200;
      const driftY = Math.cos(time * 0.8) * 350 + Math.sin(time * 1.1) * 200;

      mouseX.set(targetX + driftX);
      mouseY.set(targetY + driftY);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mouseX, mouseY]);

  // Expanded staggered springs to completely desync the colors as they chase the orbit
  const x1 = useSpring(mouseX, { damping: 40, stiffness: 100, mass: 0.8 });
  const y1 = useSpring(mouseY, { damping: 40, stiffness: 100, mass: 0.8 });

  const x2 = useSpring(mouseX, { damping: 50, stiffness: 80, mass: 1 });
  const y2 = useSpring(mouseY, { damping: 50, stiffness: 80, mass: 1 });

  const x3 = useSpring(mouseX, { damping: 65, stiffness: 60, mass: 1.2 });
  const y3 = useSpring(mouseY, { damping: 65, stiffness: 60, mass: 1.2 });

  const x4 = useSpring(mouseX, { damping: 80, stiffness: 45, mass: 1.5 });
  const y4 = useSpring(mouseY, { damping: 80, stiffness: 45, mass: 1.5 });

  const x5 = useSpring(mouseX, { damping: 90, stiffness: 35, mass: 1.8 });
  const y5 = useSpring(mouseY, { damping: 90, stiffness: 35, mass: 1.8 });

  const x6 = useSpring(mouseX, { damping: 110, stiffness: 25, mass: 2 });
  const y6 = useSpring(mouseY, { damping: 110, stiffness: 25, mass: 2 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signup({
        name,
        email,
        password,
        role,
        company: role === "employer" ? company : undefined,
        bio: role === "jobseeker" ? bio : undefined,
      });
      setSuccess(true);
      setTimeout(() => navigate(role === "employer" ? "/employer" : "/jobseeker"), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Signup failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10 bg-background">
      {/* 6-Color Analogous Liquid Background Layer (Prevents Gray/Muddy Color Mixing) */}
      <motion.div style={{ x: x1, y: y1 }} className="absolute top-0 left-0 pointer-events-none">
        <div className="absolute w-[80vw] h-[60vh] bg-rose-600/40 blur-[150px] -translate-x-[60%] -translate-y-[50%] transform-gpu" />
      </motion.div>
      <motion.div style={{ x: x2, y: y2 }} className="absolute top-0 left-0 pointer-events-none">
        <div className="absolute w-[60vw] h-[80vh] bg-pink-600/40 blur-[160px] translate-x-[10%] -translate-y-[30%] transform-gpu" />
      </motion.div>
      <motion.div style={{ x: x3, y: y3 }} className="absolute top-0 left-0 pointer-events-none">
        <div className="absolute w-[70vw] h-[70vh] bg-fuchsia-600/40 blur-[140px] -translate-x-[20%] -translate-y-[80%] transform-gpu" />
      </motion.div>
      <motion.div style={{ x: x4, y: y4 }} className="absolute top-0 left-0 pointer-events-none">
        <div className="absolute w-[90vw] h-[50vh] bg-violet-600/40 blur-[150px] -translate-x-[50%] translate-y-[20%] transform-gpu" />
      </motion.div>
      <motion.div style={{ x: x5, y: y5 }} className="absolute top-0 left-0 pointer-events-none">
        <div className="absolute w-[50vw] h-[90vh] bg-blue-600/40 blur-[170px] translate-x-[30%] translate-y-[10%] transform-gpu" />
      </motion.div>
      <motion.div style={{ x: x6, y: y6 }} className="absolute top-0 left-0 pointer-events-none">
        <div className="absolute w-[75vw] h-[75vh] bg-cyan-600/40 blur-[150px] -translate-x-[90%] translate-y-[10%] transform-gpu" />
      </motion.div>
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-sm"
      >
        <div className="rounded-2xl border border-border/60 bg-card shadow-lg p-8">
          <div className="text-center mb-8 flex flex-col items-center">
            <Logo size="lg" />
            <h1 className="font-display text-2xl font-bold text-foreground mt-6 mb-2">Create your account</h1>
            <p className="text-sm text-muted-foreground">Choose your account type to get started</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: "jobseeker" as UserRole, label: "Jobseeker", icon: User, desc: "Find your next role" },
              { value: "employer" as UserRole, label: "Employer", icon: Briefcase, desc: "Hire great people" },
            ].map(({ value, label, icon: Icon, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`rounded-xl border p-4 text-left transition-all duration-150 ${
                  role === value
                    ? "border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]"
                    : "border-border bg-card hover:border-muted-foreground/30 hover:bg-secondary/50"
                }`}
              >
                <Icon className={`h-5 w-5 mb-2 ${role === value ? "text-primary" : "text-muted-foreground"}`} />
                <div className="font-display font-semibold text-sm text-foreground">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </button>
            ))}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2.5 bg-destructive/8 border border-destructive/15 text-destructive rounded-xl px-4 py-3 text-sm mb-4"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 bg-success/8 border border-success/15 text-success rounded-xl px-4 py-3 text-sm mb-4"
            >
              ✅ Account created! Redirecting…
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="h-11" required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" required disabled={loading} />
            </div>
            {role === "employer" && (
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Your company" value={company} onChange={(e) => setCompany(e.target.value)} className="h-11" disabled={loading} />
              </div>
            )}
            {role === "jobseeker" && (
              <div className="space-y-2">
                <Label htmlFor="bio">Your Bio <span className="text-muted-foreground">(helps match score)</span></Label>
                <Input id="bio" placeholder="e.g. React developer, 5 years exp..." value={bio} onChange={(e) => setBio(e.target.value)} className="h-11" disabled={loading} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password <span className="text-muted-foreground">(min 6 chars)</span></Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" required disabled={loading} />
            </div>
            <Button type="submit" variant="gradient" className="w-full h-11" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating account…</> : "Create Account"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
