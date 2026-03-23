import React from "react";
import { useListAssessments } from "@workspace/api-client-react";
import { Card, CardContent, Badge, Button, Progress } from "@/components/ui/shared";
import { Target, Lock, ArrowRight } from "lucide-react";

export default function Assess() {
  const { data: assessments, isLoading } = useListAssessments();

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading assessments...</div>;

  // Fallback data
  const displayData = assessments?.length ? assessments : [
    { id: "1", title: "Management Readiness Index", description: "Diagnose your foundational management skills and identify urgent blind spots.", category: "Foundations", estimatedMinutes: 10, isCompleted: true, score: 72 },
    { id: "2", title: "Political Vulnerability Scan", description: "Assess your exposure to workplace politics and stakeholder misalignment.", category: "Advanced", estimatedMinutes: 15, isCompleted: false, isPremium: true },
    { id: "3", title: "Brand Equity Audit", description: "Measure the strength of your reputation among peers and leadership.", category: "Brand", estimatedMinutes: 12, isCompleted: false }
  ] as any[];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Target className="w-8 h-8 text-primary" />
          Diagnostics
        </h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
          Radical self-awareness is your biggest competitive advantage. Find out exactly where you stand.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayData.map((assessment) => (
          <Card key={assessment.id} className="flex flex-col relative overflow-hidden border-white/10 hover:border-primary/30 transition-colors">
            <CardContent className="p-8 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <Badge variant="outline" className="uppercase text-[10px] tracking-widest">{assessment.category}</Badge>
                {assessment.isPremium && <Badge variant="secondary" className="bg-amber-500/10 text-amber-500"><Lock className="w-3 h-3 mr-1"/> Premium</Badge>}
              </div>
              
              <h3 className="text-2xl font-bold mb-4">{assessment.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-8 flex-1">{assessment.description}</p>
              
              {assessment.isCompleted ? (
                <div className="bg-background/50 rounded-xl p-4 border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">Latest Score</span>
                    <span className="text-lg font-bold text-primary">{assessment.score}/100</span>
                  </div>
                  <Progress value={assessment.score} className="h-2 mb-4" />
                  <Button variant="outline" className="w-full">View Full Report</Button>
                </div>
              ) : (
                <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-auto">
                  <span className="text-sm text-muted-foreground">{assessment.estimatedMinutes} min to complete</span>
                  <Button variant="premium" size="sm">
                    Start <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
