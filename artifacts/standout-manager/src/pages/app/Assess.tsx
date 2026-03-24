import React from "react";
import { useListAssessments, useGetAssessment } from "@workspace/api-client-react";
import { Card, CardContent, Badge, Button, Progress } from "@/components/ui/shared";
import { Target, Lock, ArrowRight, Clock, ChevronRight, CheckCircle2, AlertTriangle, TrendingUp, X, Timer, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getToken } from "@/lib/utils";
import { Link } from "wouter";

type AssessmentPhase = "list" | "taking" | "results";

type Answer = { questionId: string; selectedOptionId: string };

type Result = {
  id: string;
  assessmentTitle: string;
  score: number;
  scoreLabel: string;
  strengths: string[];
  blindSpots: string[];
  recommendations: string[];
  breakdown: Array<{ category: string; score: number; label: string }>;
};

function useTimer(running: boolean) {
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return { display: `${mins}:${secs}`, totalSeconds: seconds };
}

function AssessmentTaker({
  assessmentId,
  onClose,
  onComplete,
}: {
  assessmentId: string;
  onClose: () => void;
  onComplete: (result: Result) => void;
}) {
  const { data: assessment, isLoading } = useGetAssessment(assessmentId);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answer[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const { display: timerDisplay, totalSeconds } = useTimer(!isLoading);

  if (isLoading || !assessment) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading assessment...</div>
      </div>
    );
  }

  const questions = (assessment as any).questions || [];
  const currentQ = questions[currentIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQ?.id);
  const progress = ((currentIndex) / questions.length) * 100;
  const targetMin = (assessment as any).estimatedMinutes || 10;
  const isOnTrack = totalSeconds <= targetMin * 60;

  const handleSelect = (optionId: string) => {
    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== currentQ.id);
      return [...filtered, { questionId: currentQ.id, selectedOptionId: optionId }];
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/assessments/${assessmentId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ answers }),
      });
      const result = await response.json();
      onComplete(result);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isLast = currentIndex === questions.length - 1;

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
              <p className="text-sm font-medium text-foreground">{(assessment as any).title}</p>
              <p className="text-xs text-muted-foreground">Question {currentIndex + 1} of {questions.length}</p>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-mono font-bold",
            isOnTrack ? "bg-green-500/10 text-green-400" : "bg-orange-500/10 text-orange-400"
          )}>
            <Timer className="w-4 h-4" />
            {timerDisplay}
            <span className="text-xs font-sans font-normal opacity-70">/ {targetMin}:00 target</span>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 pb-2">
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      {/* Question */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10 animate-fade-in" key={currentIndex}>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">{currentIndex + 1}</span>
            {currentQ.type === "scale" ? "Rate yourself" : "Choose your answer"}
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground leading-tight mb-10">
            {currentQ.text}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((opt: any) => (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={cn(
                  "w-full text-left px-6 py-5 rounded-2xl border transition-all duration-200 group",
                  currentAnswer?.selectedOptionId === opt.id
                    ? "bg-primary/10 border-primary shadow-md shadow-primary/10 scale-[1.01]"
                    : "bg-card border-white/5 hover:border-white/20 hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors",
                    currentAnswer?.selectedOptionId === opt.id
                      ? "border-primary bg-primary"
                      : "border-white/20"
                  )}>
                    {currentAnswer?.selectedOptionId === opt.id && (
                      <div className="w-full h-full rounded-full bg-primary flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-background" />
                      </div>
                    )}
                  </div>
                  <span className={cn(
                    "text-base leading-relaxed",
                    currentAnswer?.selectedOptionId === opt.id ? "text-foreground font-medium" : "text-muted-foreground"
                  )}>
                    {opt.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <Button variant="ghost" onClick={handleBack} disabled={currentIndex === 0} className="text-muted-foreground">
            ← Back
          </Button>
          {isLast ? (
            <Button
              variant="premium"
              size="lg"
              onClick={handleSubmit}
              disabled={!currentAnswer || submitting || answers.length < questions.length}
              isLoading={submitting}
            >
              {answers.length < questions.length
                ? `Answer all ${questions.length} questions first`
                : "Submit & Get Results"}
            </Button>
          ) : (
            <Button
              variant="premium"
              onClick={handleNext}
              disabled={!currentAnswer}
            >
              Next Question <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        {isLast && answers.length < questions.length && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            {questions.length - answers.length} question{questions.length - answers.length > 1 ? "s" : ""} unanswered — scroll back to complete them
          </p>
        )}
      </div>
    </div>
  );
}

function ResultsView({ result, onRetake, onBack }: { result: Result; onRetake: () => void; onBack: () => void }) {
  const scoreColor =
    result.score >= 75 ? "text-green-400" :
    result.score >= 50 ? "text-primary" :
    "text-orange-400";

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto animate-fade-in">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground text-sm mb-8 flex items-center gap-2 transition-colors">
          <X className="w-4 h-4" /> Close Results
        </button>

        {/* Score Hero */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-6 uppercase tracking-widest text-xs">Diagnostic Complete</Badge>
          <h1 className="text-4xl font-display font-bold mb-2">{result.assessmentTitle}</h1>
          <div className={cn("text-8xl font-display font-black my-6", scoreColor)}>
            {Math.round(result.score)}
          </div>
          <p className="text-xl text-muted-foreground">out of 100 — <span className="text-foreground font-semibold">{result.scoreLabel}</span></p>
        </div>

        {/* Score Breakdown */}
        <Card className="mb-6 border-white/10">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Skill Breakdown
            </h3>
            <div className="space-y-5">
              {result.breakdown.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-foreground">{item.category}</span>
                    <span className={cn(
                      "font-bold",
                      item.score >= 75 ? "text-green-400" : item.score >= 50 ? "text-primary" : "text-orange-400"
                    )}>{Math.round(item.score)}</span>
                  </div>
                  <Progress value={item.score} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Strengths */}
          <Card className="border-green-500/20 bg-green-500/5">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-green-400">
                <CheckCircle2 className="w-5 h-5" /> Confirmed Strengths
              </h3>
              <ul className="space-y-3">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex gap-3">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Blind Spots */}
          <Card className="border-orange-500/20 bg-orange-500/5">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-400">
                <AlertTriangle className="w-5 h-5" /> Blind Spots Found
              </h3>
              <ul className="space-y-3">
                {result.blindSpots.map((s, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex gap-3">
                    <span className="text-orange-400 mt-0.5 flex-shrink-0">!</span>
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="border-primary/20 mb-8">
          <CardContent className="p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" /> Your Priority Actions
            </h3>
            <ol className="space-y-4">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground/90">{rec}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onRetake}>Retake Assessment</Button>
          <Button variant="premium" onClick={onBack}>Back to All Assessments</Button>
        </div>
      </div>
    </div>
  );
}

export default function Assess() {
  const { data: assessments, isLoading, refetch } = useListAssessments();
  const [phase, setPhase] = React.useState<AssessmentPhase>("list");
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<Result | null>(null);

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading assessments...</div>;

  const displayData = (assessments as any[]) || [];

  if (phase === "taking" && activeId) {
    return (
      <AssessmentTaker
        assessmentId={activeId}
        onClose={() => { setPhase("list"); setActiveId(null); }}
        onComplete={(res) => { setResult(res); setPhase("results"); }}
      />
    );
  }

  if (phase === "results" && result) {
    return (
      <ResultsView
        result={result}
        onRetake={() => { setPhase("taking"); }}
        onBack={() => { setPhase("list"); setActiveId(null); setResult(null); refetch(); }}
      />
    );
  }

  return (
    <div className="space-y-10 pb-12 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Target className="w-8 h-8 text-primary" />
          Diagnostics
        </h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
          Radical self-awareness is your biggest competitive advantage. Each test takes 9–12 minutes and gives you an honest read on where you stand.
        </p>
      </div>

      {/* Featured: Management Readiness */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Start Here</span>
        </div>
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-card relative overflow-hidden shadow-xl shadow-primary/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <CardContent className="p-8 md:p-10 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="premium" className="uppercase tracking-widest text-xs">Flagship Diagnostic</Badge>
                  <Badge variant="outline" className="text-xs">Free</Badge>
                </div>
                <h2 className="text-3xl font-display font-bold mb-3">Management Readiness Diagnostic</h2>
                <p className="text-muted-foreground leading-relaxed mb-6 text-lg max-w-xl">
                  24 scenario-based questions across 8 dimensions. No score — just an honest gap map showing exactly where you stand and where to build first.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {["Competence", "Confidence", "Communication", "Presence", "Engagement", "Proactive vs Reactive", "Political Awareness", "Stakeholder Awareness"].map(dim => (
                    <span key={dim} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">{dim}</span>
                  ))}
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 9–12 minutes</span>
                  <span>24 questions</span>
                  <span>8 dimensions</span>
                  <span>Gap analysis, not a score</span>
                </div>
              </div>
              <div className="lg:flex-shrink-0">
                <Link href="/assess/management-readiness">
                  <Button variant="premium" size="lg" className="w-full lg:w-auto gap-3 text-base px-8 py-4 h-auto">
                    Start Assessment
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground text-center mt-3">Takes 9–12 min to complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Other Assessments */}
      {displayData.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">More Diagnostics</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayData.map((assessment: any) => (
          <Card key={assessment.id} className="flex flex-col relative overflow-hidden border-white/10 hover:border-primary/30 transition-colors">
            <CardContent className="p-8 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <Badge variant="outline" className="uppercase text-[10px] tracking-widest">{assessment.category}</Badge>
                {assessment.isPremium && <Badge variant="secondary" className="bg-amber-500/10 text-amber-500"><Lock className="w-3 h-3 mr-1" /> Premium</Badge>}
              </div>

              <h3 className="text-2xl font-bold mb-4">{assessment.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-8 flex-1">{assessment.description}</p>

              {assessment.isCompleted ? (
                <div className="bg-background/50 rounded-xl p-5 border border-white/5 space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" /> Completed
                    </span>
                    <span className={cn(
                      "text-lg font-bold",
                      assessment.score >= 75 ? "text-green-400" : assessment.score >= 50 ? "text-primary" : "text-orange-400"
                    )}>
                      {Math.round(assessment.score)}/100
                    </span>
                  </div>
                  <Progress value={assessment.score} className="h-2 mb-4" />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => { setActiveId(assessment.id); setPhase("taking"); }}
                  >
                    Retake Assessment
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-auto">
                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {assessment.estimatedMinutes || 10}–11 min
                  </span>
                  <Button
                    variant="premium"
                    size="sm"
                    onClick={() => { setActiveId(assessment.id); setPhase("taking"); }}
                  >
                    Start Test <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
          </div>
        </div>
      )}
    </div>
  );
}
