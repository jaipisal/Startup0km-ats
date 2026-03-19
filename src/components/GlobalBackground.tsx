import { useEffect, useState } from "react";

export function GlobalBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-50] bg-background overflow-hidden pointer-events-none">
      {/* 
        Ultra-modern "Glowing Grid" Interactive Aesthetic 
      */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundImage: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, hsl(var(--primary)/0.04), transparent 40%)`
        }}
      />
      
      {/* Bold, Highly Visible Ambient Mesh Auroras */}
      <div className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vh] bg-primary/20 blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse-soft" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[70vh] bg-accent/15 blur-[160px] rounded-full mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[30%] right-[15%] w-[40vw] h-[50vh] bg-blue-500/10 blur-[140px] rounded-full mix-blend-multiply dark:mix-blend-screen" />

      {/* Structured SaaS Tech Grid (Breaks up the flat white screen perfectly) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" />

      {/* Film grain for premium Vercel-like matte texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] mix-blend-overlay" />
    </div>
  );
}
