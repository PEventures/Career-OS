import React from "react";
import { useParams, Link } from "wouter";
import { useGetScenario, useCompleteScenario } from "@workspace/api-client-react";
import { Card, CardContent, Button, Badge } from "@/components/ui/shared";
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScenarioDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: scenario, isLoading } = useGetScenario(id!);
  const completeMutation = useCompleteScenario();
  
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<any>(null);

  if (isLoading) return <div className="p-8 text-center">Loading simulation...</div>;
  if (!scenario) return <div>Scenario not found</div>;

  const handleComplete = async () => {
    if (!selectedId) return;
    try {
      const res = await completeMutation.mutateAsync({ id: scenario.id, data: { selectedOptionId: selectedId } });
      setResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const getQualityIcon = (quality: string) => {
    switch(quality) {
      case 'strong': return <CheckCircle className="text-green-500 w-5 h-5" />;
      case 'acceptable': return <CheckCircle className="text-blue-500 w-5 h-5" />;
      case 'weak': return <AlertTriangle className="text-orange-500 w-5 h-5" />;
      case 'risky': return <XCircle className="text-red-500 w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      <Link href="/scenarios" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
      </Link>

      {!result ? (
        <div className="space-y-8">
          <div>
            <Badge variant="outline" className="mb-4">{scenario.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">{scenario.title}</h1>
            <div className="p-6 md:p-8 rounded-2xl bg-card border border-white/10 text-lg text-foreground/90 leading-relaxed shadow-xl">
              {scenario.situation}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">How do you respond?</h3>
            <div className="space-y-4">
              {scenario.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedId(opt.id)}
                  className={cn(
                    "w-full text-left p-6 rounded-2xl border transition-all duration-300",
                    selectedId === opt.id 
                      ? "bg-primary/10 border-primary shadow-md shadow-primary/10 scale-[1.01]" 
                      : "bg-background/50 border-white/5 hover:border-white/20 hover:bg-white/5"
                  )}
                >
                  <p className={cn("text-lg", selectedId === opt.id ? "text-foreground font-medium" : "text-muted-foreground")}>{opt.text}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button size="lg" variant="premium" disabled={!selectedId} onClick={handleComplete} isLoading={completeMutation.isPending}>
              Lock in Decision
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-slide-up">
          <div className="text-center py-8">
            <Badge variant="outline" className="mb-4">Analysis</Badge>
            <h2 className="text-3xl font-display font-bold">Here is how that plays out.</h2>
          </div>

          <Card className={cn(
            "border-t-4",
            result.selectedOption.quality === 'strong' ? 'border-t-green-500' :
            result.selectedOption.quality === 'risky' ? 'border-t-red-500' :
            'border-t-primary'
          )}>
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-8 pb-8 border-b border-white/10">
                <div className="mt-1 bg-background p-2 rounded-full border border-white/5">
                  {getQualityIcon(result.selectedOption.quality)}
                </div>
                <div>
                  <h4 className="text-lg font-bold capitalize text-foreground mb-2">Response Rated: {result.selectedOption.quality}</h4>
                  <p className="text-lg text-muted-foreground italic">"{result.selectedOption.text}"</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Why this happens</h4>
                  <p className="text-foreground/90 text-lg leading-relaxed">{result.selectedOption.explanation}</p>
                </div>

                <div className="bg-secondary/50 rounded-xl p-6 border border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <h4 className="font-bold text-foreground">Brand Impact</h4>
                  </div>
                  <p className="text-foreground/80 leading-relaxed">{result.selectedOption.brandImpact}</p>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Key Lesson</h4>
                  <p className="text-primary font-medium text-lg border-l-2 border-primary pl-4 py-1">{result.keyLesson}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center pt-8">
            <Link href="/scenarios">
              <Button variant="outline" size="lg">Return to Scenarios</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
