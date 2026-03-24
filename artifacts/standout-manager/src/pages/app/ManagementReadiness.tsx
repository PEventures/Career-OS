import React from "react";
import { Link } from "wouter";
import {
  DIMENSIONS,
  ALL_QUESTIONS,
  TOTAL_QUESTIONS,
  computeGapAnalysis,
  GAP_LEVELS,
  type GapLevel,
  type DimensionResult,
  ASSESSMENT_ID,
} from "@/data/management-readiness";
import { Card, CardContent, Badge, Button } from "@/components/ui/shared";
import { ArrowLeft, ChevronRight, Timer, X, CheckCircle2, ArrowRight, Sparkles, AlertTriangle, TrendingUp } from "lucide-react";
import { cn, getToken } from "@/lib/utils";

type Phase = "intro" | "taking" | "results";

function useTimer(running: boolean) {
  const [secs, setSecs] = React.useState(0);
  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return { display: `${m}:${s}`, totalSecs: secs };
}

/* ─── Intro Screen ─────────────────────────────────────────────────────── */
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="max-w-2xl mx-auto pb-12 animate-fade-in">
      <Link href="/assess" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Link>

      <div className="text-center mb-12">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-amber-600/20 border border-primary/30 flex items-center justify-center text-4xl mx-auto mb-6">
          🎯
        </div>
        <Badge variant="outline" className="mb-4 uppercase tracking-widest text-xs">Management Readiness Diagnostic</Badge>
        <h1 className="text-4xl font-display font-bold mb-4 leading-tight">Where Are You, Really?</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          This isn't a test you can pass or fail. It's a mirror. 24 scenario-based questions across 8 dimensions of management readiness — designed to surface the real gaps between where you are and where you need to be.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        {[
          { icon: "⏱️", label: "9–12 minutes", sub: "At your honest pace" },
          { icon: "🧭", label: "8 dimensions", sub: "Not a single score" },
          { icon: "🔍", label: "Gap analysis", sub: "Specific, not generic" },
          { icon: "🔒", label: "Confidential", sub: "Your workspace only" },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-white/5 rounded-xl p-5 text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="font-semibold text-sm">{item.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{item.sub}</div>
          </div>
        ))}
      </div>

      <Card className="border-amber-500/20 bg-amber-500/5 mb-10">
        <CardContent className="p-6">
          <p className="text-sm text-foreground/90 leading-relaxed">
            <span className="font-bold text-amber-400">One instruction:</span> Choose the answer that reflects what you would <em>actually</em> do — not what you think you should do. The gap analysis is only useful if it's honest.
          </p>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">You'll be assessed across</h3>
        <div className="space-y-2">
          {DIMENSIONS.map((dim, i) => (
            <div key={dim.id} className="flex items-center gap-3 text-sm">
              <span className="text-lg">{dim.icon}</span>
              <span className={cn("font-semibold", dim.color)}>{dim.label}</span>
              <span className="text-muted-foreground">— {dim.description}</span>
            </div>
          ))}
        </div>
      </div>

      <Button variant="premium" size="lg" onClick={onStart} className="w-full text-base">
        Start Diagnostic <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}

/* ─── Question Taker ───────────────────────────────────────────────────── */
function QuestionTaker({
  onComplete,
  onClose,
}: {
  onComplete: (answers: Record<string, string>) => void;
  onClose: () => void;
}) {
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const { display: timerDisplay, totalSecs } = useTimer(true);

  const currentQ = ALL_QUESTIONS[currentIdx];
  const currentDim = DIMENSIONS.find((d) => d.questions.some((q) => q.id === currentQ.id));
  const dimProgress = DIMENSIONS.findIndex((d) => d.questions.some((q) => q.id === currentQ.id));
  const qInDim = currentDim?.questions.findIndex((q) => q.id === currentQ.id) ?? 0;
  const progress = ((currentIdx) / TOTAL_QUESTIONS) * 100;
  const isLast = currentIdx === TOTAL_QUESTIONS - 1;
  const selected = answers[currentQ.id];
  const isOnTrack = totalSecs <= 11 * 60;

  const isFirstInDim = qInDim === 0;

  const handleSelect = (optId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));
  };

  const handleNext = () => {
    if (isLast) {
      onComplete(answers);
    } else {
      setCurrentIdx((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-white/5 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{currentDim?.icon}</span>
                <span className={cn("text-sm font-bold", currentDim?.color)}>{currentDim?.label}</span>
                <span className="text-muted-foreground text-xs">· Question {qInDim + 1} of {currentDim?.questions.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">{currentIdx + 1} of {TOTAL_QUESTIONS} total</p>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-mono font-bold",
            isOnTrack ? "bg-green-500/10 text-green-400" : "bg-orange-500/10 text-orange-400"
          )}>
            <Timer className="w-4 h-4" />
            {timerDisplay}
          </div>
        </div>
        {/* Progress */}
        <div className="h-1 bg-white/5 relative">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Dimension strip */}
        <div className="max-w-3xl mx-auto px-6 py-2 flex gap-1 overflow-x-auto scrollbar-hide">
          {DIMENSIONS.map((d, i) => (
            <div
              key={d.id}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i < dimProgress ? "bg-primary" :
                i === dimProgress ? "bg-primary/40" :
                "bg-white/5"
              )}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="max-w-3xl mx-auto px-6 py-10" key={currentIdx}>
        {isFirstInDim && (
          <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 text-sm font-medium", currentDim?.color, "border-current/20 bg-current/5")}>
            <span className="text-base">{currentDim?.icon}</span>
            Dimension {dimProgress + 1}: {currentDim?.label}
          </div>
        )}

        {currentQ.context && (
          <p className="text-xs text-muted-foreground mb-4 italic">{currentQ.context}</p>
        )}

        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground leading-tight mb-10">
          {currentQ.text}
        </h2>

        <div className="space-y-3">
          {currentQ.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={cn(
                "w-full text-left px-6 py-5 rounded-2xl border transition-all duration-200",
                selected === opt.id
                  ? "bg-primary/10 border-primary shadow-md shadow-primary/10 scale-[1.005]"
                  : "bg-card border-white/5 hover:border-white/20 hover:bg-white/5"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-colors",
                  selected === opt.id ? "border-primary" : "border-white/20"
                )}>
                  {selected === opt.id && (
                    <div className="w-full h-full rounded-full bg-primary flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-background" />
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-[15px] leading-relaxed",
                  selected === opt.id ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {opt.text}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center pt-8 border-t border-white/5 mt-8">
          <Button variant="ghost" onClick={handleBack} disabled={currentIdx === 0} className="text-muted-foreground">
            ← Back
          </Button>
          <Button
            variant="premium"
            size="lg"
            onClick={handleNext}
            disabled={!selected}
          >
            {isLast ? "See My Gap Analysis" : "Next"} <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Results: Gap Analysis ────────────────────────────────────────────── */
function levelBarWidth(level: GapLevel): number {
  return { early: 20, developing: 45, capable: 70, strong: 95 }[level];
}

function GapResults({
  dimResults,
  onRetake,
  onBack,
}: {
  dimResults: DimensionResult[];
  onRetake: () => void;
  onBack: () => void;
}) {
  const sorted = [...dimResults].sort((a, b) => a.avgWeight - b.avgWeight);
  const topGaps = sorted.filter((d) => d.level === "early" || d.level === "developing").slice(0, 3);
  const strengths = sorted.filter((d) => d.level === "strong" || d.level === "capable").slice(-2).reverse();

  const gapCounts = {
    early: dimResults.filter((d) => d.level === "early").length,
    developing: dimResults.filter((d) => d.level === "developing").length,
    capable: dimResults.filter((d) => d.level === "capable").length,
    strong: dimResults.filter((d) => d.level === "strong").length,
  };

  return (
    <div className="max-w-3xl mx-auto pb-16 animate-fade-in">
      <button onClick={onBack} className="text-muted-foreground hover:text-foreground text-sm mb-8 flex items-center gap-2 transition-colors">
        <X className="w-4 h-4" /> Close
      </button>

      {/* Hero */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 uppercase tracking-widest text-xs">Diagnostic Complete</Badge>
        <h1 className="text-4xl font-display font-bold mb-4">Your Management Readiness Profile</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          No score. Just an honest map of where you are across 8 dimensions — and a clear view of where to focus first.
        </p>
        <div className="flex justify-center gap-6 mt-8 flex-wrap">
          {Object.entries(gapCounts).map(([level, count]) => {
            if (count === 0) return null;
            const cfg = GAP_LEVELS[level as GapLevel];
            return (
              <div key={level} className={cn("px-4 py-2 rounded-full border text-sm font-medium", cfg.bg, cfg.border, cfg.color)}>
                {count} {cfg.short}
              </div>
            );
          })}
        </div>
      </div>

      {/* All 8 Dimensions */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          All 8 Dimensions
        </h2>
        <div className="space-y-4">
          {sorted.map((dim) => {
            const cfg = GAP_LEVELS[dim.level];
            const dimData = DIMENSIONS.find((d) => d.id === dim.id)!;
            return (
              <div key={dim.id} className={cn("rounded-2xl border p-5 transition-all", cfg.border, cfg.bg)}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{dim.icon}</span>
                    <span className={cn("font-bold", dim.color)}>{dim.label}</span>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wide", cfg.color, "border-current/20")}>
                    {cfg.label}
                  </Badge>
                </div>
                {/* Visual bar */}
                <div className="mb-3">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        dim.level === "early" ? "bg-red-500" :
                        dim.level === "developing" ? "bg-orange-500" :
                        dim.level === "capable" ? "bg-blue-500" : "bg-green-500"
                      )}
                      style={{ width: `${levelBarWidth(dim.level)}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{cfg.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Priority Gaps */}
      {topGaps.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-400" />
            Start Here
          </h2>
          <p className="text-muted-foreground mb-6">
            These are your highest-priority development areas. Address them first — everything else depends on this foundation.
          </p>
          <div className="space-y-6">
            {topGaps.map((dim, i) => {
              const cfg = GAP_LEVELS[dim.level];
              const dimData = DIMENSIONS.find((d) => d.id === dim.id)!;
              return (
                <Card key={dim.id} className={cn("border", cfg.border)}>
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start gap-4 mb-5">
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0", cfg.bg)}>
                        {dim.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={cn("font-bold text-lg", dim.color)}>{dim.label}</h3>
                          <Badge variant="outline" className={cn("text-[10px] uppercase", cfg.color, "border-current/20")}>
                            {cfg.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{dimData.description}</p>
                      </div>
                    </div>

                    <div className={cn("rounded-xl p-4 border mb-5", cfg.border, cfg.bg)}>
                      <p className="text-sm text-foreground/90 leading-relaxed">{dimData.gapContext}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Recommended actions</h4>
                      <div className="space-y-2">
                        {dimData.resources.map((res, j) => (
                          <Link key={j} href={res.href}>
                            <div className="flex items-center gap-3 p-3 rounded-xl border border-white/5 hover:border-white/15 hover:bg-white/5 transition-colors cursor-pointer group">
                              <span className="text-base">
                                {res.type === "playbook" ? "📘" : res.type === "scenario" ? "🎭" : res.type === "coach" ? "💬" : "🎯"}
                              </span>
                              <span className="text-sm font-medium group-hover:text-primary transition-colors">{res.label}</span>
                              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmed Strengths */}
      {strengths.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-display font-bold mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            Your Existing Strengths
          </h2>
          <p className="text-muted-foreground mb-5">
            These are real assets. Deploy them visibly — and protect them from the complacency that comes with confidence.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {strengths.map((dim) => {
              const dimData = DIMENSIONS.find((d) => d.id === dim.id)!;
              return (
                <Card key={dim.id} className="border-green-500/20 bg-green-500/5">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{dim.icon}</span>
                      <span className="font-bold text-green-400">{dim.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{dimData.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* What this means for your Journey */}
      <Card className="border-primary/20 bg-primary/5 mb-10">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl flex-shrink-0">
              🗺️
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">What This Means for Your 30-Day Journey</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Your diagnostic results shape which parts of the platform to prioritize. Your gap areas should drive your scenario practice, which playbooks you go deep on, and what you bring to your AI Coach sessions. The 30-day journey builds the structure — your gaps tell you where to go deep.
              </p>
              <Link href="/journey">
                <Button variant="premium">
                  Start the 30-Day Foundation <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" onClick={onRetake} className="flex-1">Retake Assessment</Button>
        <Link href="/assess" className="flex-1">
          <Button variant="ghost" className="w-full">Back to All Diagnostics</Button>
        </Link>
        <Link href="/coach" className="flex-1">
          <Button variant="premium" className="w-full gap-2">
            <Sparkles className="w-4 h-4" /> Debrief with Coach
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* ─── Main Orchestrator ────────────────────────────────────────────────── */
export default function ManagementReadiness() {
  const [phase, setPhase] = React.useState<Phase>("intro");
  const [dimResults, setDimResults] = React.useState<DimensionResult[] | null>(null);
  const [saving, setSaving] = React.useState(false);

  const handleComplete = async (answers: Record<string, string>) => {
    const results = computeGapAnalysis(answers);
    setDimResults(results);
    setPhase("results");

    // Save to backend
    setSaving(true);
    try {
      await fetch("/api/assessments/management-readiness/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ answers, dimensionResults: results }),
      });
    } catch (err) {
      console.error("Failed to save results", err);
    } finally {
      setSaving(false);
    }
  };

  if (phase === "intro") {
    return (
      <div className="py-4">
        <IntroScreen onStart={() => setPhase("taking")} />
      </div>
    );
  }

  if (phase === "taking") {
    return (
      <QuestionTaker
        onComplete={handleComplete}
        onClose={() => setPhase("intro")}
      />
    );
  }

  if (phase === "results" && dimResults) {
    return (
      <div className="py-4">
        <GapResults
          dimResults={dimResults}
          onRetake={() => { setDimResults(null); setPhase("taking"); }}
          onBack={() => { setDimResults(null); setPhase("intro"); }}
        />
      </div>
    );
  }

  return null;
}
