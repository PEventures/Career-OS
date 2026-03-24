import React from "react";
import { Link } from "wouter";
import { Card, CardContent, Badge, Button } from "@/components/ui/shared";
import {
  Check, X, Sparkles, Zap, Lock, ArrowRight, Tag, ChevronRight,
  MessageSquare, Target, Compass, BookOpen, Star, Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";

const VALID_CODES: Record<string, { discount: number; label: string }> = {
  "FREE26": { discount: 100, label: "100% off — Full access, free forever" },
  "STANDOUT50": { discount: 50, label: "50% off your first year" },
};

const FREE_FEATURES = [
  { label: "Management Readiness Diagnostic", included: true },
  { label: "3 Scenario simulations", included: true },
  { label: "2 Playbooks", included: true },
  { label: "AI Coach — 3 messages per session", included: true },
  { label: "30-Day Journey (first week only)", included: true },
  { label: "Unlimited Scenarios & Simulations", included: false },
  { label: "Full Playbook library", included: false },
  { label: "Unlimited AI Coach sessions", included: false },
  { label: "Brand Lab", included: false },
  { label: "All 4 assessment diagnostics", included: false },
  { label: "Full 30-Day Journey", included: false },
  { label: "Priority support", included: false },
];

const PRO_FEATURES = [
  { label: "Management Readiness Diagnostic", included: true },
  { label: "Unlimited Scenarios & Simulations", included: true },
  { label: "Full Playbook library", included: true },
  { label: "Unlimited AI Coach sessions", included: true },
  { label: "Brand Lab", included: true },
  { label: "All 4 assessment diagnostics", included: true },
  { label: "Full 30-Day Journey", included: true },
  { label: "New content every month", included: true },
  { label: "Priority support", included: true },
  { label: "Early access to new features", included: true },
];

const TESTIMONIALS = [
  { quote: "I got promoted to Senior Manager 6 weeks in. The gap analysis showed me exactly what I needed to fix.", name: "Priya M.", role: "Engineering Manager, Series B startup" },
  { quote: "The scenarios are brutally realistic. I've never felt so prepared walking into a difficult conversation.", name: "James K.", role: "Product Manager, Fortune 500" },
  { quote: "The AI Coach doesn't give you generic advice. It knows your gaps and pushes back hard.", name: "Sarah L.", role: "Team Lead → Director in 8 months" },
];

export default function Pricing() {
  const [billing, setBilling] = React.useState<"monthly" | "annual">("annual");
  const [code, setCode] = React.useState("");
  const [appliedCode, setAppliedCode] = React.useState<string | null>(null);
  const [codeError, setCodeError] = React.useState("");
  const [codeSuccess, setCodeSuccess] = React.useState("");

  const monthlyPrice = 19;
  const annualPrice = 149;
  const annualMonthly = Math.round(annualPrice / 12);

  const discount = appliedCode ? VALID_CODES[appliedCode]?.discount ?? 0 : 0;

  const finalMonthly = discount === 100 ? 0 : Math.round(monthlyPrice * (1 - discount / 100));
  const finalAnnual = discount === 100 ? 0 : Math.round(annualPrice * (1 - discount / 100));
  const finalAnnualMonthly = discount === 100 ? 0 : Math.round(annualMonthly * (1 - discount / 100));

  const applyCode = () => {
    const upper = code.trim().toUpperCase();
    if (VALID_CODES[upper]) {
      setAppliedCode(upper);
      setCodeSuccess(VALID_CODES[upper].label);
      setCodeError("");
    } else {
      setCodeError("Invalid code. Try FREE26 for full access.");
      setCodeSuccess("");
      setAppliedCode(null);
    }
  };

  const removeCode = () => {
    setAppliedCode(null);
    setCode("");
    setCodeSuccess("");
    setCodeError("");
  };

  return (
    <div className="space-y-16 pb-20 animate-fade-in">

      {/* ── Header ── */}
      <div className="text-center max-w-2xl mx-auto">
        <Badge variant="outline" className="mb-4 uppercase tracking-widest text-xs">
          <Sparkles className="w-3 h-3 mr-1.5 text-primary" />
          Simple Pricing
        </Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">
          One plan. Full access.<br />
          <span className="text-primary">No fluff.</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to go from overlooked to impossible to ignore — at a fraction of what a single coaching session costs.
        </p>
      </div>

      {/* ── Billing Toggle ── */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center bg-card border border-white/10 rounded-2xl p-1.5 gap-1">
          <button
            onClick={() => setBilling("monthly")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-medium transition-all",
              billing === "monthly"
                ? "bg-white/10 text-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
              billing === "annual"
                ? "bg-primary/20 text-primary shadow border border-primary/30"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Annual
            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold border border-green-500/30">
              SAVE 34%
            </span>
          </button>
        </div>
      </div>

      {/* ── Pricing Cards ── */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

        {/* Free Tier */}
        <Card className="border-white/10 relative">
          <CardContent className="p-8">
            <div className="mb-8">
              <Badge variant="outline" className="mb-3 text-[10px] uppercase tracking-widest">Free</Badge>
              <h2 className="text-2xl font-display font-bold mb-2">Starter</h2>
              <p className="text-muted-foreground text-sm mb-6">Explore the platform and get your baseline assessment.</p>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-display font-bold">$0</span>
                <span className="text-muted-foreground pb-2">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">No credit card required</p>
            </div>

            <Link href="/auth/register">
              <Button variant="outline" className="w-full mb-8">
                Start for Free
              </Button>
            </Link>

            <div className="space-y-3">
              {FREE_FEATURES.map((f, i) => (
                <div key={i} className={cn("flex items-center gap-3 text-sm", !f.included && "opacity-40")}>
                  {f.included ? (
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={f.included ? "text-foreground" : "text-muted-foreground"}>{f.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pro Tier */}
        <Card className={cn(
          "border-primary/30 relative overflow-hidden shadow-2xl shadow-primary/10",
          "bg-gradient-to-br from-primary/5 via-card to-amber-600/5"
        )}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <CardContent className="p-8 relative z-10">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="premium" className="text-[10px] uppercase tracking-widest">Pro</Badge>
                {billing === "annual" && (
                  <Badge variant="outline" className="text-[10px] text-green-400 border-green-500/30 bg-green-500/10">Best value</Badge>
                )}
              </div>
              <h2 className="text-2xl font-display font-bold mb-2">Standout Pro</h2>
              <p className="text-muted-foreground text-sm mb-6">Full access to every tool, every scenario, every playbook.</p>

              <div className="flex items-end gap-2">
                <div>
                  {discount > 0 && (
                    <div className="text-muted-foreground line-through text-lg font-bold mb-1">
                      ${billing === "annual" ? annualMonthly : monthlyPrice}/mo
                    </div>
                  )}
                  <div className="flex items-end gap-1">
                    <span className={cn("text-5xl font-display font-bold", discount === 100 && "text-green-400")}>
                      {discount === 100 ? "FREE" : `$${billing === "annual" ? finalAnnualMonthly : finalMonthly}`}
                    </span>
                    {discount < 100 && (
                      <span className="text-muted-foreground pb-2">/month</span>
                    )}
                  </div>
                </div>
              </div>

              {billing === "annual" && discount < 100 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Billed as <strong className="text-foreground">${finalAnnual}/year</strong>
                  {discount > 0 && ` (was $${annualPrice})`}
                </p>
              )}
              {billing === "monthly" && discount < 100 && (
                <p className="text-xs text-muted-foreground mt-2">Billed monthly, cancel anytime</p>
              )}
              {discount === 100 && (
                <p className="text-xs text-green-400 mt-2 font-medium">
                  ✓ Full access applied — no payment required
                </p>
              )}
            </div>

            {/* Discount Code */}
            {!appliedCode ? (
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={code}
                      onChange={e => { setCode(e.target.value); setCodeError(""); }}
                      onKeyDown={e => e.key === "Enter" && applyCode()}
                      placeholder="Discount code"
                      className="w-full bg-background/50 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={applyCode} className="px-4">
                    Apply
                  </Button>
                </div>
                {codeError && <p className="text-xs text-red-400 mt-1.5">{codeError}</p>}
              </div>
            ) : (
              <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-xs font-bold text-green-400 uppercase tracking-wider">{appliedCode}</span>
                  <span className="text-xs text-green-400/80 ml-2">— {codeSuccess}</span>
                </div>
                <button onClick={removeCode} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Remove
                </button>
              </div>
            )}

            <Button variant="premium" className="w-full mb-8 gap-2 h-12 text-base">
              {discount === 100 ? (
                <>Get Full Access Free <ArrowRight className="w-5 h-5" /></>
              ) : (
                <>Start Standout Pro <ArrowRight className="w-5 h-5" /></>
              )}
            </Button>

            <div className="space-y-3">
              {PRO_FEATURES.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-foreground">{f.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Discount Code Hint ── */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <Tag className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-amber-400/90">
            Have a discount code? Enter it on the Pro card above.
          </span>
        </div>
      </div>

      {/* ── What you're getting ── */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold mb-3">What's inside Standout Pro</h2>
          <p className="text-muted-foreground">Six high-signal tools built for people who take their careers seriously.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Target, title: "Diagnostics", desc: "4 rigorous assessments including the Management Readiness gap analysis. Know exactly where you stand.", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { icon: Compass, title: "Scenario Simulator", desc: "Realistic workplace simulations with optimal play reveals. Practice before the real moment.", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
            { icon: BookOpen, title: "Playbooks", desc: "The full library of frameworks, scripts, and operating systems for every management challenge.", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
            { icon: MessageSquare, title: "AI Coach", desc: "Unlimited sessions. Knows your gaps. Pushes back. No generic advice, no cheerleading.", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
            { icon: Sparkles, title: "30-Day Journey", desc: "A structured daily curriculum that builds real credibility in 30 days. One day at a time.", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
            { icon: Star, title: "Brand Lab", desc: "Define how you want to be perceived and reverse-engineer the behaviors that get you there.", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          ].map((item) => (
            <div key={item.title} className={cn("rounded-2xl border p-5", item.border, item.bg)}>
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", item.bg, "border", item.border)}>
                <item.icon className={cn("w-5 h-5", item.color)} />
              </div>
              <h3 className={cn("font-bold mb-1", item.color)}>{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-display font-bold text-center mb-8">What people are saying</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} className="border-white/10">
              <CardContent className="p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed mb-5 italic">"{t.quote}"</p>
                <div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-display font-bold text-center mb-8">Common questions</h2>
        <div className="space-y-4">
          {[
            { q: "Can I cancel anytime?", a: "Yes. No lock-in, no cancellation fees. Cancel from your account settings and you'll keep access until the end of your billing period." },
            { q: "What does the discount code do?", a: "Discount codes reduce or eliminate the cost of your Pro subscription. Code FREE26 gives 100% off — full Pro access at no cost." },
            { q: "Is my data private?", a: "Completely. Your assessment results, reflections, and coach conversations are private to your workspace and never shared." },
            { q: "How is this different from generic career coaching?", a: "Standout is built specifically for first-time managers and ambitious ICs. Every scenario, playbook, and diagnostic is built for that exact context — not generic leadership advice." },
            { q: "Can I switch from monthly to annual?", a: "Yes, at any time. When you switch to annual billing, the remaining balance on your monthly plan is credited toward the annual price." },
          ].map((faq, i) => (
            <details key={i} className="group bg-card border border-white/10 rounded-2xl">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <span className="font-medium text-sm">{faq.q}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-open:rotate-90 transition-transform flex-shrink-0" />
              </summary>
              <div className="px-5 pb-5">
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* ── Final CTA ── */}
      <div className="text-center max-w-lg mx-auto">
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 to-amber-600/5 p-10">
          <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold mb-3">Ready to stand out?</h2>
          <p className="text-muted-foreground mb-6">Join the managers and ICs who are building real credibility — not just collecting feedback.</p>
          <Button variant="premium" size="lg" className="w-full gap-2 text-base h-12">
            Start Standout Pro <ArrowRight className="w-5 h-5" />
          </Button>
          <p className="text-xs text-muted-foreground mt-3">Have a code? Use FREE26 for 100% off.</p>
        </div>
      </div>
    </div>
  );
}
