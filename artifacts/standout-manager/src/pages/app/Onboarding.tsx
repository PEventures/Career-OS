import React from "react";
import { useLocation } from "wouter";
import { useSubmitOnboarding } from "@workspace/api-client-react";
import { Button, Card, CardContent } from "@/components/ui/shared";
import { ArrowRight, CheckCircle2, Target, Compass, TrendingUp, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Faceless Avatar Guide ─────────────────────────────────────────────── */
function AvatarGuide({ message, animated = false }: { message: string; animated?: boolean }) {
  return (
    <div className="flex items-start gap-4 mb-8 bg-primary/5 border border-primary/20 rounded-2xl p-5">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(animated && "animate-pulse-slow")}>
          {/* Glow ring */}
          <circle cx="26" cy="26" r="25" fill="url(#avatarGlow)" opacity="0.3" />
          {/* Body/torso */}
          <ellipse cx="26" cy="42" rx="14" ry="8" fill="url(#avatarBody)" />
          {/* Neck */}
          <rect x="22" y="32" width="8" height="6" rx="3" fill="url(#avatarSkin)" />
          {/* Head */}
          <circle cx="26" cy="26" r="10" fill="url(#avatarSkin)" />
          {/* Eyes */}
          <circle cx="22.5" cy="25" r="1.5" fill="#1a1a2e" />
          <circle cx="29.5" cy="25" r="1.5" fill="#1a1a2e" />
          {/* Star on forehead */}
          <text x="24.5" y="22" fontSize="5" fill="#f59e0b">★</text>
          <defs>
            <radialGradient id="avatarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="avatarSkin" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <linearGradient id="avatarBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Speech bubble */}
      <div className="flex-1 pt-1">
        <p className="text-sm font-medium text-foreground/90 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

/* ─── Journey Overview Card ─────────────────────────────────────────────── */
const JOURNEY_STEPS = [
  { icon: Target, label: "Assess", desc: "12-min diagnostic across 8 dimensions", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Sparkles, label: "Gap Analysis", desc: "See exactly where to build first", color: "text-primary", bg: "bg-primary/10" },
  { icon: Compass, label: "Scenarios", desc: "Practice real situations safely", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: TrendingUp, label: "Skill Badges", desc: "Earn badges, track real growth", color: "text-green-400", bg: "bg-green-500/10" },
];

/* ─── Survey Steps ───────────────────────────────────────────────────────── */
const SURVEY_STEPS = [
  {
    id: "role",
    title: "What best describes you right now?",
    guide: "This helps me tailor your gap analysis and scenario recommendations from day one.",
    type: "single",
    options: [
      { id: "first_time_manager", label: "First-Time Manager", sub: "0–2 years leading a team", icon: "🎯" },
      { id: "individual_contributor", label: "Ambitious IC", sub: "Preparing to step into leadership", icon: "🚀" },
      { id: "experienced_manager", label: "Experienced Manager", sub: "2+ years, ready to level up", icon: "⚡" },
    ],
  },
  {
    id: "biggest_challenge",
    title: "What's your biggest challenge right now?",
    guide: "I'll prioritize scenarios and playbooks around this immediately.",
    type: "single",
    options: [
      { id: "difficult_conversations", label: "Difficult Conversations", sub: "Feedback, conflict, underperformers", icon: "💬" },
      { id: "politics", label: "Workplace Politics", sub: "Navigating power, stakeholders, credit", icon: "♟️" },
      { id: "visibility", label: "Visibility & Recognition", sub: "Being seen, getting credit, standing out", icon: "👁️" },
      { id: "imposter_syndrome", label: "Imposter Syndrome", sub: "Confidence, authority, being taken seriously", icon: "🧠" },
    ],
  },
  {
    id: "confidence",
    title: "How confident do you feel as a leader today?",
    guide: "Honest answer only. This calibrates the difficulty of your starting scenarios.",
    type: "scale",
    min: 1,
    max: 10,
    labels: ["Not confident", "Fully confident"],
  },
];

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = React.useState(0); // 0=welcome, 1=journey, 2-4=survey
  const [data, setData] = React.useState<any>({});
  const submitMutation = useSubmitOnboarding();

  const totalSteps = 2 + SURVEY_STEPS.length; // welcome + journey + 3 questions
  const progress = ((step) / (totalSteps - 1)) * 100;
  const surveyIndex = step - 2; // -1 = not a survey step yet
  const isSurveyStep = step >= 2;
  const currentSurvey = isSurveyStep ? SURVEY_STEPS[surveyIndex] : null;

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
    } else {
      try {
        await submitMutation.mutateAsync({
          data: {
            roleType: data.role || "first_time_manager",
            biggestChallenge: data.biggest_challenge || "politics",
            confidenceLevel: data.confidence || 5,
            yearsExperience: "0-2",
            teamSize: "1-5",
            industry: "Tech",
            fearAreas: [],
            desiredReputation: [],
          }
        });
        setLocation("/assess/management-readiness");
      } catch (err) {
        console.error(err);
        setLocation("/dashboard");
      }
    }
  };

  const canProceed = () => {
    if (!isSurveyStep) return true;
    const s = SURVEY_STEPS[surveyIndex];
    if (s.type === "single") return !!data[s.id];
    if (s.type === "scale") return true;
    return true;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex gap-1.5 justify-center">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i <= step ? "bg-primary" : "bg-white/10",
                  i === step ? "w-8" : "w-4"
                )}
              />
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">Step {step + 1} of {totalSteps}</p>
        </div>

        {/* ── Step 0: Welcome ── */}
        {step === 0 && (
          <Card className="bg-card/60 backdrop-blur-xl border-white/5 animate-slide-up">
            <CardContent className="p-8 text-center">
              {/* Big avatar */}
              <div className="flex justify-center mb-6">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse-slow">
                  <circle cx="40" cy="40" r="38" fill="url(#welcomeGlow)" opacity="0.25" />
                  <ellipse cx="40" cy="64" rx="20" ry="12" fill="url(#welcomeBody)" />
                  <rect x="34" y="50" width="12" height="8" rx="4" fill="url(#welcomeSkin)" />
                  <circle cx="40" cy="38" r="15" fill="url(#welcomeSkin)" />
                  <circle cx="34" cy="37" r="2.5" fill="#1a1a2e" />
                  <circle cx="46" cy="37" r="2.5" fill="#1a1a2e" />
                  <text x="36" y="33" fontSize="8" fill="#f59e0b">★</text>
                  <defs>
                    <radialGradient id="welcomeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="welcomeSkin" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#c4b5fd" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                    <linearGradient id="welcomeBody" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-4">
                <Sparkles className="w-3 h-3" /> Your AI Coach
              </div>
              <h1 className="text-3xl font-display font-bold mb-3">Hey, I'm your Standout Manager guide.</h1>
              <p className="text-muted-foreground leading-relaxed mb-6">
                I'll walk you through a quick setup, then point you straight to the diagnostic that tells you exactly where you stand — and what to build first.
              </p>
              <p className="text-sm text-muted-foreground mb-8">This takes about <strong className="text-foreground">3 minutes</strong> — then you're ready to start.</p>
              <Button variant="premium" className="w-full gap-2" onClick={handleNext}>
                Let's Go <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Step 1: Journey Overview ── */}
        {step === 1 && (
          <Card className="bg-card/60 backdrop-blur-xl border-white/5 animate-slide-up">
            <CardContent className="p-8">
              <AvatarGuide
                message="Here's exactly how this works. Four phases that build on each other — no guessing, no wasted time."
                animated
              />

              <h2 className="text-2xl font-display font-bold mb-6 text-center">Your growth loop</h2>

              <div className="space-y-3 mb-8">
                {JOURNEY_STEPS.map((s, i) => (
                  <div key={s.label} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-background/40">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", s.bg)}>
                      <s.icon className={cn("w-4 h-4", s.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-muted-foreground">0{i + 1}</span>
                        <span className="font-semibold text-sm">{s.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                    {i < JOURNEY_STEPS.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-2.5" />
                    )}
                  </div>
                ))}
              </div>

              <Button variant="premium" className="w-full gap-2" onClick={handleNext}>
                Got It — Let's Personalize <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── Steps 2-4: Survey ── */}
        {isSurveyStep && currentSurvey && (
          <Card className="bg-card/60 backdrop-blur-xl border-white/5 animate-slide-up" key={step}>
            <CardContent className="p-8">
              <AvatarGuide message={currentSurvey.guide} />

              <h2 className="text-2xl font-display font-bold mb-6">{currentSurvey.title}</h2>

              <div className="space-y-3 mb-8">
                {currentSurvey.type === "single" && currentSurvey.options?.map((opt: any) => (
                  <button
                    key={opt.id}
                    onClick={() => setData({ ...data, [currentSurvey.id]: opt.id })}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all duration-200",
                      data[currentSurvey.id] === opt.id
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background/50 border-white/5 hover:border-white/20 text-foreground"
                    )}
                  >
                    <span className="text-xl w-8 text-center flex-shrink-0">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{opt.label}</div>
                      <div className={cn("text-xs mt-0.5", data[currentSurvey.id] === opt.id ? "text-primary/80" : "text-muted-foreground")}>{opt.sub}</div>
                    </div>
                    {data[currentSurvey.id] === opt.id && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                  </button>
                ))}

                {currentSurvey.type === "scale" && (
                  <div className="px-2 py-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-3">
                      {currentSurvey.labels?.map((l: string) => <span key={l}>{l}</span>)}
                    </div>
                    <input
                      type="range"
                      min={currentSurvey.min}
                      max={currentSurvey.max}
                      value={data[currentSurvey.id] || 5}
                      onChange={e => setData({ ...data, [currentSurvey.id]: Number(e.target.value) })}
                      className="w-full accent-primary"
                    />
                    <div className="text-center mt-3">
                      <span className="text-4xl font-display font-black text-primary">{data[currentSurvey.id] || 5}</span>
                      <span className="text-muted-foreground text-sm"> / 10</span>
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="premium"
                className="w-full gap-2"
                onClick={handleNext}
                disabled={!canProceed() || submitMutation.isPending}
                isLoading={submitMutation.isPending}
              >
                {surveyIndex === SURVEY_STEPS.length - 1
                  ? "Take Me to My Diagnostic"
                  : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
