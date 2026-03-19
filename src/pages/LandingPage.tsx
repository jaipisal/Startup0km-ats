import { Link } from "react-router-dom";
import { Briefcase, Users, Target, ArrowRight, Sparkles, ChevronRight, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } }),
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      {/* Global Atmospheric Background - This ensures the WHOLE PAGE has a beautiful, continuous flow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse-soft" />
        <div className="absolute top-[30%] right-[-10%] w-[40%] h-[60%] bg-accent/15 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Nav */}
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
          <div className="bg-background/80 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-2xl px-6 h-14 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <Logo size="md" />
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex hover:bg-foreground/5">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" variant="gradient" className="rounded-full px-5 shadow-md shadow-primary/20">Get Started</Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16">
          <div className="container px-6 text-center max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
              <div className="inline-flex items-center gap-2 rounded-full bg-foreground/5 border border-foreground/10 px-4 py-2 text-sm text-foreground mb-10 backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">AI-Powered Applicant Tracking</span>
                <ChevronRight className="h-3 w-3 text-foreground/50 ml-1" />
              </div>
            </motion.div>

            <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp}
              className="font-display text-6xl md:text-[5.5rem] font-extrabold text-foreground tracking-tight leading-[1.05] mb-8 text-balance"
            >
              Hire smarter,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-accent drop-shadow-sm pb-2 inline-block">not harder.</span>
            </motion.h1>

            <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              The modern ATS that helps fast-growing companies find the perfect candidates through
              AI matching, visual pipelines, and zero-friction applications.
            </motion.p>

            <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/signup">
                <Button size="lg" variant="gradient" className="gap-2 shadow-xl shadow-primary/20 rounded-full px-8 h-14 text-base w-full sm:w-auto">
                  Start Hiring Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base bg-background/50 backdrop-blur-sm border-foreground/10 hover:bg-foreground/5 w-full sm:w-auto">
                  Find a Job
                </Button>
              </Link>
            </motion.div>

            {/* Trust bar */}
            <motion.div initial="hidden" animate="visible" custom={5} variants={fadeUp}
              className="mt-20 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm font-medium text-foreground/60"
            >
              <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-foreground/40" /> SOC2 Ready</span>
              <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-foreground/20" />
              <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-foreground/40" /> 99.9% Uptime</span>
              <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-foreground/20" />
              <span className="flex items-center gap-2"><Globe className="h-4 w-4 text-foreground/40" /> Global Talent Pool</span>
            </motion.div>
          </div>
        </section>

        {/* Features – Bento Grid */}
        <section className="relative py-24 md:py-32">
          <div className="container mx-auto px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16 md:mb-24">
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
                Everything you need to scale
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Built specifically for high-velocity startups that cannot afford to miss out on top-tier engineering and design talent.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Briefcase, title: "Job Management", desc: "Post, edit, and manage job listings from a clean dashboard. Track open roles effortlessly.", color: "text-blue-500", bg: "bg-blue-500/10" },
                { icon: Users, title: "Kanban Pipeline", desc: "Move candidates through stages with an intuitive, drag-and-drop visual board.", color: "text-purple-500", bg: "bg-purple-500/10" },
                { icon: Target, title: "AI Match Score", desc: "Instantly see how well each candidate matches a role with our AI-powered 0–100% scoring.", color: "text-pink-500", bg: "bg-pink-500/10" },
              ].map(({ icon: Icon, title, desc, color, bg }, i) => (
                <motion.div
                  key={title}
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  custom={i} variants={scaleIn}
                  className="rounded-3xl bg-background/60 backdrop-blur-xl border border-foreground/5 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group"
                >
                  <div className={`h-14 w-14 rounded-2xl ${bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-7 w-7 ${color}`} />
                  </div>
                  <h3 className="font-display font-bold text-foreground text-xl mb-3">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats – Seamless Glass */}
        <section className="relative py-20">
          <div className="container mx-auto px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="rounded-[2.5rem] bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-2xl border border-white/20 dark:border-white/5 p-12 md:p-20 max-w-5xl mx-auto shadow-2xl relative overflow-hidden"
            >
              {/* Inner ambient glow */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
              
              <div className="relative grid md:grid-cols-3 gap-12 md:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-foreground/10">
                {[
                  { value: "500+", label: "Startups Hiring" },
                  { value: "2.4k", label: "Candidates Placed" },
                  { value: "87%", label: "Match Accuracy" },
                ].map(({ value, label }, i) => (
                  <motion.div key={label} custom={i} variants={fadeUp} className="pt-8 md:pt-0 first:pt-0">
                    <div className="font-display text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent mb-3">{value}</div>
                    <div className="text-base text-foreground/70 font-medium uppercase tracking-wider">{label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA - Vibrant App Block */}
        <section className="relative py-32 mb-10">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
              className="relative rounded-[3rem] overflow-hidden p-14 md:p-24 text-center shadow-2xl"
            >
              {/* Dynamic CTA Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-accent" />
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
              
              <div className="relative z-10">
                <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 text-balance tracking-tight">
                  Ready to build your dream team?
                </h2>
                <p className="text-white/80 max-w-2xl mx-auto mb-10 text-xl leading-relaxed">
                  Join hundreds of high-growth companies already using Startup0km to discover and hire elite talent.
                </p>
                <Link to="/signup">
                  <Button size="lg" className="rounded-full px-10 h-14 text-base bg-white text-primary hover:bg-white/90 shadow-xl transition-transform hover:scale-105">
                    Start Hiring For Free <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Clean Minimal Footer */}
        <footer className="mt-auto border-t border-foreground/5 py-8 relative z-10">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <Logo size="sm" />
            <span>© 2026 Startup0km. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
