import React from "react";
import { useParams, Link } from "wouter";
import { useGetScenario, useCompleteScenario } from "@workspace/api-client-react";
import { Card, CardContent, Button, Badge } from "@/components/ui/shared";
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle, Star, ChevronDown, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const QUALITY_CONFIG = {
  strong: { icon: CheckCircle, color: "text-green-400", border: "border-green-500/30 bg-green-500/5", label: "Strong Move", rank: 1 },
  acceptable: { icon: CheckCircle, color: "text-blue-400", border: "border-blue-500/30 bg-blue-500/5", label: "Acceptable", rank: 2 },
  weak: { icon: AlertTriangle, color: "text-orange-400", border: "border-orange-500/30 bg-orange-500/5", label: "Weak Move", rank: 3 },
  risky: { icon: XCircle, color: "text-red-400", border: "border-red-500/30 bg-red-500/5", label: "Risky Move", rank: 4 },
};

export default function ScenarioDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: scenario, isLoading } = useGetScenario(id!);
  const completeMutation = useCompleteScenario();

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<any>(null);
  const [showAllOptions, setShowAllOptions] = React.useState(false);

  if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading simulation...</div>;
  if (!scenario) return <div className="p-8 text-center text-muted-foreground">Scenario not found.</div>;

  const s = scenario as any;

  const handleComplete = async () => {
    if (!selectedId) return;
    try {
      const res = await completeMutation.mutateAsync({ id: s.id, data: { selectedOptionId: selectedId } });
      setResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const getQualityConfig = (quality: string) => QUALITY_CONFIG[quality as keyof typeof QUALITY_CONFIG] || QUALITY_CONFIG.acceptable;

  const sortedOptions = result
    ? [...(s.options || [])].sort((a: any, b: any) => {
        const aRank = getQualityConfig(a.quality).rank;
        const bRank = getQualityConfig(b.quality).rank;
        return aRank - bRank;
      })
    : s.options || [];

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      <Link href="/scenarios" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
      </Link>

      {!result ? (
        /* ── Decision Phase ── */
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline">{s.category}</Badge>
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wide capitalize">{s.difficulty}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6 leading-tight">{s.title}</h1>

            <div className="relative p-6 md:p-8 rounded-2xl bg-card border border-white/10 shadow-xl">
              <div className="absolute top-4 left-4 text-5xl text-white/5 font-serif">"</div>
              <p className="text-foreground/90 text-lg leading-relaxed whitespace-pre-line relative z-10">{s.situation}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">How do you respond?</h3>
            <p className="text-muted-foreground text-sm mb-6">Choose the response that best represents what you would actually do — not what you think you "should" do.</p>
            <div className="space-y-3">
              {(s.options || []).map((opt: any) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedId(opt.id)}
                  className={cn(
                    "w-full text-left p-6 rounded-2xl border transition-all duration-300 group",
                    selectedId === opt.id
                      ? "bg-primary/10 border-primary shadow-md shadow-primary/10 scale-[1.01]"
                      : "bg-background/50 border-white/5 hover:border-white/20 hover:bg-white/5"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 transition-colors",
                      selectedId === opt.id ? "border-primary bg-primary" : "border-white/20"
                    )}>
                      {selectedId === opt.id && <div className="w-full h-full rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-background" /></div>}
                    </div>
                    <p className={cn("text-base leading-relaxed", selectedId === opt.id ? "text-foreground font-medium" : "text-muted-foreground")}>
                      {opt.text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <Button
              size="lg"
              variant="premium"
              disabled={!selectedId}
              onClick={handleComplete}
              isLoading={completeMutation.isPending}
            >
              Lock In Decision →
            </Button>
          </div>
        </div>
      ) : (
        /* ── Results Phase ── */
        <div className="space-y-8 animate-fade-in">

          {/* Verdict */}
          <div className="text-center py-6">
            <Badge variant="outline" className="mb-4 uppercase tracking-widest text-xs">Analysis Complete</Badge>
            <h2 className="text-3xl font-display font-bold mb-2">Here's how that plays out.</h2>
            <p className="text-muted-foreground">Your choice was rated against what a standout manager would do.</p>
          </div>

          {/* Selected Option Card */}
          {(() => {
            const qc = getQualityConfig(result.selectedOption?.quality);
            const QIcon = qc.icon;
            return (
              <Card className={cn("border-t-4", qc.border.split(" ")[0].replace("border-", "border-t-"))}>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center bg-background border border-white/10")}>
                      <QIcon className={cn("w-5 h-5", qc.color)} />
                    </div>
                    <div>
                      <Badge variant="outline" className={cn("text-[10px] uppercase", qc.color, "border-current/20")}>{qc.label}</Badge>
                      <p className="text-sm text-muted-foreground mt-0.5">Your selected response</p>
                    </div>
                    <div className="ml-auto text-right">
                      <div className={cn("text-2xl font-bold", qc.color)}>{result.score}</div>
                      <div className="text-xs text-muted-foreground">/ 100</div>
                    </div>
                  </div>

                  <blockquote className="text-lg text-foreground/80 italic border-l-2 border-white/10 pl-4 mb-6">
                    "{result.selectedOption?.text}"
                  </blockquote>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Why this plays out this way</h4>
                      <p className="text-foreground/90 leading-relaxed">{result.selectedOption?.explanation}</p>
                    </div>

                    <div className={cn("rounded-xl p-5 border", qc.border)}>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <h4 className="font-bold text-sm text-foreground">Brand Impact</h4>
                      </div>
                      <p className="text-foreground/80 text-sm">{result.selectedOption?.brandImpact}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">The deeper lesson</h4>
                      <p className="text-primary font-medium border-l-2 border-primary pl-4 py-1">{result.keyLesson}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {/* Optimal Play Reveal */}
          <div>
            <button
              onClick={() => setShowAllOptions(!showAllOptions)}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-card hover:border-white/20 transition-colors text-sm font-medium"
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                See how all options ranked
              </div>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showAllOptions && "rotate-180")} />
            </button>

            {showAllOptions && (
              <div className="mt-4 space-y-3 animate-fade-in">
                {sortedOptions.map((opt: any, i: number) => {
                  const qc = getQualityConfig(opt.quality);
                  const QIcon = qc.icon;
                  const isSelected = opt.id === result.selectedOption?.id;
                  return (
                    <Card key={opt.id} className={cn("border", qc.border, isSelected && "ring-1 ring-primary")}>
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <QIcon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", qc.color)} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className={cn("text-[10px] uppercase", qc.color, "border-current/20")}>{qc.label}</Badge>
                              {isSelected && <Badge variant="secondary" className="text-[10px] bg-primary/20 text-primary">Your choice</Badge>}
                              <span className="text-xs text-muted-foreground ml-auto">{opt.score}/100</span>
                            </div>
                            <p className="text-sm text-foreground/80 mb-2 italic">"{opt.text}"</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">{opt.explanation}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 border-t border-white/5">
            <Link href="/scenarios">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">← More Scenarios</Button>
            </Link>
            <Link href="/coach">
              <Button variant="premium" size="lg" className="w-full sm:w-auto gap-2">
                <MessageSquare className="w-4 h-4" />
                Debrief with Coach
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
