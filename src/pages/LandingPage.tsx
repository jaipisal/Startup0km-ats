import { Link } from "react-router-dom";
import { Briefcase, Users, Target, ArrowRight, Sparkles, ChevronRight, Zap, Shield, Globe, TrendingUp, CheckCircle2, Star, Building2, BarChart3, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Logo } from "@/components/Logo";
import { useEffect, useRef, useState } from "react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 relative selection:bg-purple-400/30 overflow-hidden">
      {/* Skeuomorphic Liquid Glass Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" />

        {/* Large liquid glass blob - Top Left */}
        <div className="absolute top-[-15%] -left-[10%] w-[800px] h-[800px] rounded-full animate-float-slow" style={{
          background: 'linear-gradient(135deg, rgba(229, 231, 235, 1) 0%, rgba(219, 234, 254, 0.85) 50%, rgba(225, 213, 255, 0.75) 100%)',
          boxShadow: 'inset -20px -20px 40px rgba(255, 255, 255, 0.9), inset 20px 20px 40px rgba(165, 180, 252, 0.35), 0 40px 80px rgba(99, 102, 241, 0.25)',
          backdropFilter: 'blur(10px)',
        }} />

        {/* Liquid glass blob - Top Right */}
        <div className="absolute top-[5%] -right-[15%] w-[700px] h-[700px] rounded-full animate-float-medium" style={{
          background: 'linear-gradient(135deg, rgba(244, 238, 255, 0.9) 0%, rgba(219, 234, 254, 0.75) 50%, rgba(248, 245, 250, 0.85) 100%)',
          boxShadow: 'inset -15px -15px 30px rgba(255, 255, 255, 0.85), inset 15px 15px 30px rgba(192, 132, 250, 0.3), 0 35px 70px rgba(168, 85, 247, 0.2)',
          backdropFilter: 'blur(8px)',
        }} />

        {/* Medium liquid glass blob - Center */}
        <div className="absolute top-[35%] left-[10%] w-[500px] h-[500px] rounded-full animate-float-slow-reverse" style={{
          background: 'linear-gradient(135deg, rgba(225, 243, 254, 0.9) 0%, rgba(232, 245, 233, 0.75) 50%, rgba(240, 230, 255, 0.85) 100%)',
          boxShadow: 'inset -15px -15px 30px rgba(255, 255, 255, 0.9), inset 15px 15px 30px rgba(51, 152, 219, 0.2), 0 30px 60px rgba(59, 130, 246, 0.18)',
          backdropFilter: 'blur(8px)',
        }} />

        {/* Small liquid glass blob - Bottom Right */}
        <div className="absolute bottom-[-10%] right-[5%] w-[600px] h-[600px] rounded-full animate-float-very-slow" style={{
          background: 'linear-gradient(135deg, rgba(243, 232, 255, 0.85) 0%, rgba(219, 234, 254, 0.7) 50%, rgba(229, 231, 235, 0.8) 100%)',
          boxShadow: 'inset -20px -20px 40px rgba(255, 255, 255, 1), inset 20px 20px 40px rgba(196, 181, 253, 0.25), 0 40px 80px rgba(139, 92, 246, 0.18)',
          backdropFilter: 'blur(12px)',
        }} />

        {/* Fine glass texture overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(165, 180, 252, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(196, 181, 253, 0.1) 0%, transparent 50%)
          `,
        }} />

        {/* Subtle noise for realistic glass texture */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" fill="white" filter="url(%23noise)"%3E%3C/rect%3E%3C/svg%3E")',
          backgroundSize: '100px 100px',
          mixBlendMode: 'overlay'
        }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Nav */}
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl">
          <div className="relative group">
            {/* Animated background blur effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-300/20 via-purple-300/20 to-blue-300/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Main navbar container */}
            <div className="relative bg-gradient-to-r from-white/40 via-white/35 to-white/40 backdrop-blur-3xl border border-white/70 rounded-2xl px-6 h-14 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] transition-shadow duration-500">
              {/* Glow line at top */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent rounded-t-2xl" />
              
              <Logo size="md" />
              
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hidden sm:inline-flex text-slate-700 hover:bg-indigo-100/60 hover:text-indigo-900 transition-all duration-300 font-medium"
                  >
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    size="sm" 
                    className="rounded-full px-5 shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 hover:from-indigo-600 hover:via-purple-600 hover:to-blue-600 text-white font-semibold hover:shadow-xl hover:shadow-purple-400/40 active:scale-95 transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16">
          <div className="container px-6 text-center max-w-4xl mx-auto">
            <motion.div initial="hidden" animate="visible" custom={0} variants={fadeUp}>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100/80 to-pink-100/80 border border-purple-200/80 px-4 py-2 text-sm text-purple-700 mb-10 backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="font-medium">AI-Powered Applicant Tracking</span>
                <ChevronRight className="h-3 w-3 text-purple-600/70 ml-1" />
              </div>
            </motion.div>

            <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp}
              className="font-display text-6xl md:text-[5.5rem] font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-8 text-balance"
            >
              Hire smarter,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 drop-shadow-sm pb-2 inline-block">not harder.</span>
            </motion.h1>

            <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp}
              className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              The modern ATS that helps fast-growing companies find the perfect candidates through
              AI matching, visual pipelines, and zero-friction applications.
            </motion.p>

            <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp}
              className="flex flex-col items-center gap-6"
            >
              {/* ── Role selector cards ── */}
              <p className="text-slate-400 text-sm tracking-wide uppercase font-medium">I want to&hellip;</p>
              <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full max-w-xl">

                {/* Employer card */}
                <Link to="/signup" className="group flex-1">
                  <div className="relative h-full rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-sm p-5 flex flex-col gap-3 cursor-pointer
                    hover:border-indigo-300 hover:bg-white/80 hover:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] transition-all duration-250"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)' }}>
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="h-5 w-5 rounded-full border-2 border-slate-200 group-hover:border-indigo-500 group-hover:bg-indigo-500 transition-all duration-200 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>
                    {/* Text */}
                    <div>
                      <p className="text-slate-900 font-semibold text-[15px] mb-0.5">Hire talent</p>
                      <p className="text-slate-400 text-xs leading-relaxed">Post jobs, review candidates & manage your pipeline</p>
                    </div>
                    {/* Footer tag */}
                    <div className="mt-auto pt-2 border-t border-slate-100 flex items-center gap-1.5 text-indigo-600 text-xs font-medium">
                      <span>Get started free</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>

                {/* Divider */}
                <div className="hidden sm:flex flex-col items-center gap-1 py-4">
                  <div className="flex-1 w-px bg-slate-200" />
                  <span className="text-slate-300 text-[11px] font-semibold">or</span>
                  <div className="flex-1 w-px bg-slate-200" />
                </div>
                <p className="sm:hidden text-center text-slate-300 text-xs font-semibold">or</p>

                {/* Job seeker card */}
                <Link to="/signup" className="group flex-1">
                  <div className="relative h-full rounded-2xl border border-slate-200/80 bg-white/50 backdrop-blur-sm p-5 flex flex-col gap-3 cursor-pointer
                    hover:border-purple-300 hover:bg-white/80 hover:shadow-[0_0_0_3px_rgba(168,85,247,0.12)] transition-all duration-250"
                    style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)' }}>
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="h-5 w-5 rounded-full border-2 border-slate-200 group-hover:border-purple-500 group-hover:bg-purple-500 transition-all duration-200 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    </div>
                    {/* Text */}
                    <div>
                      <p className="text-slate-900 font-semibold text-[15px] mb-0.5">Find a job</p>
                      <p className="text-slate-400 text-xs leading-relaxed">Browse roles, apply instantly & track your applications</p>
                    </div>
                    {/* Footer tag */}
                    <div className="mt-auto pt-2 border-t border-slate-100 flex items-center gap-1.5 text-purple-600 text-xs font-medium">
                      <span>Browse open roles</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              </div>

              {/* Micro social-proof strip */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["bg-gradient-to-br from-rose-400 to-pink-500","bg-gradient-to-br from-indigo-400 to-blue-500","bg-gradient-to-br from-amber-400 to-orange-500","bg-gradient-to-br from-emerald-400 to-teal-500"].map((g, i) => (
                    <div key={i} className={`h-6 w-6 rounded-full ${g} border-2 border-white/90 flex items-center justify-center text-white text-[8px] font-bold shadow-sm`}>
                      {["JD","SR","KL","AM"][i]}
                    </div>
                  ))}
                </div>
                <span className="text-slate-400 text-xs">
                  <span className="text-slate-600 font-semibold">500+</span> teams onboarded &middot; free forever to start
                </span>
              </div>
            </motion.div>

            {/* Trust bar */}
            <motion.div initial="hidden" animate="visible" custom={5} variants={fadeUp}
              className="mt-20 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm font-medium text-slate-600"
            >
              <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-indigo-600" /> SOC2 Ready</span>
              <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500" /> 99.9% Uptime</span>
              <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300" />
              <span className="flex items-center gap-2"><Globe className="h-4 w-4 text-blue-600" /> Global Talent Pool</span>
            </motion.div>
          </div>
        </section>

        {/* Features – Bento Grid */}
        <section className="relative py-24 md:py-32">
          <div className="container mx-auto px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16 md:mb-24">
              <motion.h2 variants={fadeUp} custom={1} className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-6 text-balance">
                Everything you need to scale
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-slate-600 max-w-2xl mx-auto text-lg">
                Built specifically for high-velocity startups that cannot afford to miss out on top-tier engineering and design talent.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Briefcase, title: "Job Management", desc: "Post, edit, and manage job listings from a clean dashboard. Track open roles effortlessly.", color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" },
                { icon: Users, title: "Kanban Pipeline", desc: "Move candidates through stages with an intuitive, drag-and-drop visual board.", color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-200" },
                { icon: Target, title: "AI Match Score", desc: "Instantly see how well each candidate matches a role with our AI-powered 0–100% scoring.", color: "text-pink-600", bg: "bg-pink-100", border: "border-pink-200" },
              ].map(({ icon: Icon, title, desc, color, bg, border }, i) => (
                <motion.div
                  key={title}
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  custom={i} variants={scaleIn}
                  className={`rounded-3xl bg-white/40 backdrop-blur-xl border ${border} p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)] transition-all duration-300 group hover:bg-white/60`}
                >
                  <div className={`h-14 w-14 rounded-2xl ${bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-7 w-7 ${color}`} />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 text-xl mb-3">{title}</h3>
                  <p className="text-slate-600 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats – Distinct metric cards */}
        <section className="relative py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {[
                {
                  icon: Building2,
                  value: "500+",
                  label: "Startups Hiring",
                  sublabel: "& growing every week",
                  accent: "from-blue-500 to-indigo-600",
                  iconBg: "bg-blue-50",
                  iconColor: "text-blue-600",
                  bar: 82,
                },
                {
                  icon: CheckCircle2,
                  value: "2,400+",
                  label: "Candidates Placed",
                  sublabel: "in verified roles",
                  accent: "from-violet-500 to-purple-600",
                  iconBg: "bg-violet-50",
                  iconColor: "text-violet-600",
                  bar: 68,
                },
                {
                  icon: BarChart3,
                  value: "87%",
                  label: "Match Accuracy",
                  sublabel: "AI-powered scoring",
                  accent: "from-pink-500 to-rose-500",
                  iconBg: "bg-pink-50",
                  iconColor: "text-pink-600",
                  bar: 87,
                },
              ].map(({ icon: Icon, value, label, sublabel, accent, iconBg, iconColor, bar }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.13, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative rounded-3xl bg-white/55 backdrop-blur-xl border border-white/80 p-7 shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.11)] hover:-translate-y-1 transition-all duration-400 overflow-hidden"
                >
                  {/* Subtle corner glow */}
                  <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${accent} opacity-10 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className={`h-11 w-11 rounded-xl ${iconBg} flex items-center justify-center mb-5`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>

                  {/* Value */}
                  <div className={`font-display text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${accent} mb-1 tabular-nums`}>
                    {value}
                  </div>

                  {/* Label */}
                  <div className="text-slate-800 font-semibold text-[15px] mb-0.5">{label}</div>
                  <div className="text-slate-400 text-xs mb-5">{sublabel}</div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${bar}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.13 + 0.4, duration: 0.9, ease: "easeOut" }}
                      className={`h-full rounded-full bg-gradient-to-r ${accent}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — Split layout with floating card */}
        <section className="relative py-24 mb-10">
          <div className="container mx-auto px-6 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl overflow-hidden"
              style={{ boxShadow: '0 32px 80px rgba(99,102,241,0.22), 0 8px 32px rgba(0,0,0,0.08)' }}
            >
              {/* Dark base */}
              <div className="absolute inset-0 bg-[#0f0e1a]" />
              {/* Mesh gradient blobs */}
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse 60% 60% at 10% 50%, rgba(99,102,241,0.35) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 90% 20%, rgba(168,85,247,0.3) 0%, transparent 70%), radial-gradient(ellipse 40% 50% at 70% 90%, rgba(236,72,153,0.2) 0%, transparent 70%)'
              }} />
              {/* Subtle grid lines */}
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />

              <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-10 items-center p-10 md:p-16">
                {/* Left — text */}
                <div>
                  {/* Eyebrow */}
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-medium text-white/80 mb-6 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    500+ teams already onboard
                  </div>

                  <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    Your next great hire<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">is one click away.</span>
                  </h2>
                  <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-lg mb-8">
                    Stop sifting through unqualified applications. HireFlow's AI matches you with candidates who actually fit — fast.
                  </p>

                  {/* CTA row */}
                  <div className="flex flex-wrap gap-3">
                    <Link to="/signup">
                      <div className="relative group cursor-pointer">
                        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 opacity-70 blur-sm group-hover:opacity-100 group-hover:blur transition-all duration-300" />
                        <button className="relative rounded-xl px-6 h-12 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center gap-2 overflow-hidden">
                          <div className="absolute top-0 left-[-80%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] group-hover:left-[150%] transition-all duration-600" />
                          <Rocket className="h-4 w-4" />
                          Start Hiring Free
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </Link>
                    <Link to="/signup">
                      <button className="rounded-xl px-6 h-12 text-sm font-medium text-white/70 border border-white/20 hover:border-white/40 hover:text-white bg-white/5 hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        Browse Jobs
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Right — floating stat card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="hidden md:block"
                >
                  <div className="w-56 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md p-5" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)' }}>
                    {/* Mini header */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-7 w-7 rounded-lg bg-indigo-500/30 flex items-center justify-center">
                        <TrendingUp className="h-3.5 w-3.5 text-indigo-300" />
                      </div>
                      <span className="text-white/80 text-xs font-medium">This week</span>
                    </div>
                    {/* Mini bars */}
                    {[["New applicants", 72, "from-indigo-400 to-purple-400"], ["Interviews booked", 48, "from-purple-400 to-pink-400"], ["Offers sent", 31, "from-pink-400 to-rose-400"]].map(([txt, val, grad]) => (
                      <div key={txt as string} className="mb-3 last:mb-0">
                        <div className="flex justify-between text-[10px] text-white/50 mb-1">
                          <span>{txt}</span>
                          <span>{val}%</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${val}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full bg-gradient-to-r ${grad}`}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-white/40 text-[10px]">Match accuracy</span>
                      <span className="text-emerald-400 text-xs font-bold">87%</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="relative z-10 mt-auto">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />
          <div className="bg-white/30 backdrop-blur-xl border-t border-white/60">
            <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

              {/* Brand + tagline */}
              <div className="flex flex-col gap-4">
                <Logo size="sm" />
                <p className="text-slate-500 text-sm leading-relaxed max-w-[220px]">
                  AI-powered applicant tracking built for startups that can't afford to hire the wrong person.
                </p>
                {/* Social icons */}
                <div className="flex items-center gap-2">
                  {[
                    { label: "Twitter / X", href: "https://twitter.com", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                    { label: "GitHub", href: "https://github.com/jaipisal/ATS-Application-Tracking-System-", path: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" },
                    { label: "LinkedIn", href: "https://linkedin.com", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                  ].map(({ label, href, path }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                      className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-indigo-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all duration-200">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d={path} /></svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* What's inside */}
              <div className="flex flex-col gap-3">
                <p className="text-slate-900 font-semibold text-sm mb-1">What's inside</p>
                {[
                  { icon: Briefcase, text: "Post & manage job listings" },
                  { icon: Users, text: "Kanban candidate pipeline" },
                  { icon: Target, text: "AI match scoring (0–100)" },
                  { icon: Zap, text: "One-click applications" },
                  { icon: Shield, text: "Role-based access control" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-slate-500 text-sm">
                    <Icon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    {text}
                  </div>
                ))}
              </div>

              {/* Links + stack */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <p className="text-slate-900 font-semibold text-sm mb-1">Quick links</p>
                  <a href="https://hire-ats.vercel.app/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-500 text-sm hover:text-indigo-600 transition-colors duration-150 group">
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    Live Demo
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150" />
                  </a>
                  <a href="https://github.com/jaipisal/ATS-Application-Tracking-System-" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-500 text-sm hover:text-indigo-600 transition-colors duration-150 group">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current shrink-0"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                    Source Code
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150" />
                  </a>
                  <Link to="/login"
                    className="flex items-center gap-2 text-slate-500 text-sm hover:text-indigo-600 transition-colors duration-150 group">
                    <Zap className="h-3.5 w-3.5 shrink-0" />
                    Log in
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150" />
                  </Link>
                  <Link to="/signup"
                    className="flex items-center gap-2 text-slate-500 text-sm hover:text-indigo-600 transition-colors duration-150 group">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    Sign up free
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150" />
                  </Link>
                </div>

                {/* Tech stack badges */}
                <div className="pt-2">
                  <p className="text-slate-400 text-xs mb-2 font-medium">Built with</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["React 18","TypeScript","Supabase","Framer Motion"].map(t => (
                      <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-slate-200/60 px-6 py-4">
              <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <span>© 2026 HireFlow. All rights reserved.</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-600 font-medium">Live on Vercel</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
