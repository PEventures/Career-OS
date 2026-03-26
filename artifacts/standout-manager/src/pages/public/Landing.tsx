import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/shared";
import {
  Zap, ChevronRight, CheckCircle2, BookOpen, Compass,
  Brain, Target, TrendingUp, Shield, Star, ArrowRight,
  Users, Clock, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const COMPARISON = [
  { label: "Executive Coaching", cost: "$500–$1,000/month", icon: "💼", crossed: true },
  { label: "Leadership Books", cost: "100+ hours, no practice", icon: "📚", crossed: true },
  { label: "Standout Manager", cost: "AI coaching, instant guidance", icon: "⚡", crossed: false, highlight: true },
];

const HOW_IT_WORKS = [
  { step: "1", icon: Target, title: "Assess Your Gaps", desc: "Take a 12-minute diagnostic that maps exactly where you stand across 8 management dimensions — no generic feedback.", color: "from-blue-500/20 to-blue-600/10" },
  { step: "2", icon: Brain, title: "Simulate Real Situations", desc: "Work through branching scenarios based on real workplace tension — difficult feedback, stakeholder politics, underperforming team members.", color: "from-primary/20 to-primary/10" },
  { step: "3", icon: TrendingUp, title: "Build Skill Badges", desc: "Progress through Communication, Conflict, Performance, and Leadership tracks. Watch your competency grow with every session.", color: "from-amber-500/20 to-amber-600/10" },
  { step: "4", icon: Sparkles, title: "Get AI-Coached", desc: "Ask anything. Get sharp, unvarnished guidance from your private AI coach — exact scripts, strategic moves, political reads.", color: "from-green-500/20 to-green-600/10" },
];

const FEATURES = [
  { icon: Target, title: "Management Readiness Diagnostic", desc: "24 scenario-based questions across 8 dimensions. Not a score — a gap map that tells you exactly where to build first.", tag: "Free" },
  { icon: Compass, title: "Scenario Simulator", desc: "Navigate real workplace tension — difficult conversations, executive pressure, peer conflict — in a safe, branching simulation.", tag: "Pro" },
  { icon: BookOpen, title: "Systems & Playbooks", desc: "Repeatable frameworks and exact word-for-word scripts for the moments that define your reputation.", tag: "Pro" },
  { icon: Brain, title: "AI Strategic Coach", desc: "Private, context-aware AI that gives you the advice a $1,000/hr coach would — instantly, at 3am if needed.", tag: "Pro" },
  { icon: Shield, title: "Brand Equity Lab", desc: "Intentionally shape how you're perceived when you're not in the room. Audit your gaps, close them strategically.", tag: "Pro" },
  { icon: TrendingUp, title: "30-Day Growth Journey", desc: "A guided, gamified progression path that turns insight into habitual action — with XP, ranks, and milestones.", tag: "Pro" },
];

const SOCIAL_PROOF = [
  { quote: "I used to dread the 1:1 with my underperformer. Now I walk in with a system.", name: "Priya M.", role: "Engineering Manager, 14 months in", stars: 5 },
  { quote: "The gap analysis alone saved me 6 months of figuring out why things weren't clicking.", name: "James R.", role: "IC stepping into team lead", stars: 5 },
  { quote: "It's like having a senior mentor in your pocket who actually tells you the truth.", name: "Leila K.", role: "Operations Manager, promoted 8 months ago", stars: 5 },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-display font-bold">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-background text-sm font-bold">S</div>
            Standout Manager
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Sign in</Link>
            <Link href="/auth/register">
              <Button variant="premium" size="sm">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/8 rounded-full blur-3xl" />
            <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
              <Zap className="w-3.5 h-3.5" />
              For first-time managers & ambitious ICs
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 leading-[1.05]">
              Your AI-powered{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">
                management coach
              </span>{" "}
              in your pocket
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed">
              Real-world scenarios, skill diagnostics, and private AI coaching — built specifically for new managers and leaders-in-progress.
            </p>
            <p className="text-base text-muted-foreground mb-10 max-w-xl mx-auto">
              Stop guessing. Start leading with a system.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/auth/register">
                <Button variant="premium" size="lg" className="w-full sm:w-auto gap-2 h-13 px-8 text-base group">
                  Start Free — No Card Needed
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <button className="text-muted-foreground hover:text-foreground font-medium text-sm transition-colors">
                  See how it works ↓
                </button>
              </Link>
            </div>

            {/* Trust signal strip */}
            <div className="flex items-center justify-center gap-6 flex-wrap text-xs text-muted-foreground">
              {[
                { icon: CheckCircle2, label: "Free diagnostic included" },
                { icon: Users, label: "Built for 0–2 year managers" },
                { icon: Clock, label: "First results in 12 minutes" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <item.icon className="w-3.5 h-3.5 text-primary" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Comparison ── */}
        <section className="py-16 border-y border-white/5 bg-card/20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8">Instead of spending a fortune or years figuring it out alone</p>
            <div className="grid md:grid-cols-3 gap-4">
              {COMPARISON.map((c) => (
                <div
                  key={c.label}
                  className={cn(
                    "rounded-2xl border p-5 text-left transition-all",
                    c.highlight
                      ? "border-primary/40 bg-gradient-to-br from-primary/10 to-amber-500/5 shadow-lg shadow-primary/10"
                      : "border-white/5 bg-background/50 opacity-70"
                  )}
                >
                  <div className="text-2xl mb-3">{c.icon}</div>
                  <div className={cn("font-bold mb-1.5 text-sm", c.crossed && "line-through text-muted-foreground")}>{c.label}</div>
                  <div className={cn("text-xs", c.highlight ? "text-primary font-semibold" : "text-muted-foreground line-through")}>
                    {c.cost}
                  </div>
                  {c.highlight && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-primary font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Better. Faster. Always available.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" className="py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Four steps to becoming the manager people remember</h2>
              <p className="text-lg text-muted-foreground">Assessment → Simulation → Progression → Coaching. The complete loop.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.step} className={cn("rounded-2xl border border-white/5 bg-gradient-to-br p-6 hover:border-white/15 transition-colors", step.color)}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-muted-foreground">STEP {step.step}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-background/50 border border-white/10 flex items-center justify-center mb-4">
                    <step.icon className="w-5 h-5 text-foreground" />
                  </div>
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Grid ── */}
        <section id="features" className="py-20 bg-card/20 border-y border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Everything a new manager actually needs</h2>
              <p className="text-lg text-muted-foreground">Not another fluffy leadership course. Real tools for real situations.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-background/50 border border-white/5 p-6 rounded-2xl hover:border-primary/20 transition-colors group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                      <f.icon className="w-5 h-5" />
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border",
                      f.tag === "Free"
                        ? "text-green-400 border-green-500/30 bg-green-500/10"
                        : "text-amber-500 border-amber-500/30 bg-amber-500/10"
                    )}>
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2 text-sm">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Social proof ── */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold mb-3">What managers are saying</h2>
              <p className="text-muted-foreground">From people who were exactly where you are now.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {SOCIAL_PROOF.map((t) => (
                <div key={t.name} className="bg-card/60 border border-white/5 rounded-2xl p-6">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24 border-t border-white/5 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Use code FREE26 for 100% off Pro
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">
              Start becoming the manager people talk about
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Your first diagnostic is free. Takes 12 minutes. Shows you exactly what to fix.
            </p>
            <Link href="/auth/register">
              <Button variant="premium" size="lg" className="gap-2 text-base px-8 h-13 group">
                Take the Free Diagnostic
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-4">No credit card required · Free access forever for the diagnostic</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-background text-xs font-bold">S</div>
            Standout Manager
          </div>
          <div>© 2025 Standout Manager. Built for the leaders who weren't handed the playbook.</div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="hover:text-foreground transition-colors">Sign in</Link>
            <Link href="/auth/register" className="hover:text-foreground transition-colors">Get started</Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
