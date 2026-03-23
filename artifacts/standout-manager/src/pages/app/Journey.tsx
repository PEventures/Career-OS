import React from "react";
import { useGetJourney } from "@workspace/api-client-react";
import { Card, CardContent, Badge, Button } from "@/components/ui/shared";
import { Sparkles, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Journey() {
  const { data: journey, isLoading } = useGetJourney();

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading journey...</div>;

  // Fallback data
  const data = journey || {
    currentDay: 4,
    totalDays: 30,
    streakDays: 4,
    weeklyActions: [
      { id: "1", title: "Complete Scenario: The Passive Aggressive Peer", isCompleted: true, type: "scenario" },
      { id: "2", title: "Read Playbook: 1:1 Operating System", isCompleted: true, type: "system" },
      { id: "3", title: "Reflection: When were you last undermined?", isCompleted: false, type: "reflection" }
    ]
  } as any;

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          The 30-Day Path
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Your personalized curriculum to build baseline credibility.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Timeline */}
        <div className="flex-1 space-y-6">
          <h2 className="text-xl font-bold mb-4">Week 1: Establishing Authority</h2>
          
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            
            {data.weeklyActions.map((action: any, i: number) => (
              <div key={action.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors">
                  {action.isCompleted ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                </div>
                
                <Card className={cn(
                  "w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] transition-all",
                  action.isCompleted ? "border-primary/20 bg-primary/5" : "hover:border-white/20"
                )}>
                  <CardContent className="p-5">
                    <Badge variant="outline" className="mb-2 text-[10px]">{action.type}</Badge>
                    <h4 className={cn("font-bold", action.isCompleted ? "text-foreground" : "text-foreground/80")}>{action.title}</h4>
                    {!action.isCompleted && (
                      <Button variant="premium" size="sm" className="mt-4 w-full">Start Action</Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Status */}
        <div className="w-full md:w-80 space-y-6">
          <Card className="bg-gradient-to-br from-card to-card/50 border-white/5">
            <CardContent className="p-6 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Current Status</p>
              <div className="text-5xl font-display font-bold text-primary mb-2">Day {data.currentDay}</div>
              <p className="text-muted-foreground mb-6">of {data.totalDays} Day Foundation</p>
              
              <div className="flex items-center justify-center gap-2 text-sm font-medium bg-background/50 rounded-lg p-3">
                <span className="text-orange-500">🔥 {data.streakDays} Day Streak</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
