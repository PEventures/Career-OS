import React from "react";
import { useLocation } from "wouter";
import { useGetBrandProfile } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Progress } from "@/components/ui/shared";
import { ShieldAlert, TrendingUp, Search } from "lucide-react";

export default function BrandLab() {
  const [, navigate] = useLocation();
  const { data: profile, isLoading } = useGetBrandProfile();

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading brand data...</div>;

  // Placeholder data if API doesn't return full profile yet
  const safeProfile = profile || {
    brandScore: 65,
    desiredIdentity: ["Strategic", "Calm under pressure", "Decisive"],
    currentPerceptions: ["Hard worker", "In the weeds", "Anxious"],
    gapAreas: ["Executive Presence", "Delegation"],
    strengths: ["Execution", "Technical Knowledge"],
    habits: [
      { id: "1", title: "Pause before reacting", streakDays: 4, isActive: true, description: "" },
      { id: "2", title: "Speak last in meetings", streakDays: 1, isActive: true, description: "" }
    ]
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-primary" />
          Brand Lab
        </h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
          Intentional reputation design. Track what people say about you when you leave the room.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-br from-card to-card/40 border-primary/20">
          <CardContent className="p-8 flex flex-col justify-between h-full">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Workplace Brand Equity</p>
              <div className="flex items-end gap-4 mb-6">
                <span className="text-6xl font-display font-bold text-foreground">{safeProfile.brandScore}</span>
                <span className="text-xl text-muted-foreground mb-1">/ 100</span>
              </div>
              <Progress value={safeProfile.brandScore} className="h-3 mb-6" />
              <p className="text-muted-foreground text-sm">Your brand equity is growing, but there is a gap between how you work and how you are perceived by leadership.</p>
            </div>
            <div className="mt-8 flex gap-3">
              <Button variant="premium" size="sm" onClick={() => navigate("/assess")}>Log Brand Event</Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/assess")}>Take Perception Audit</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Identity Gap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase text-muted-foreground mb-3 flex items-center gap-2">
                <Search className="w-3 h-3" /> Current Reality
              </h4>
              <div className="flex flex-wrap gap-2">
                {safeProfile.currentPerceptions.map(p => (
                  <Badge key={p} variant="secondary" className="bg-white/5">{p}</Badge>
                ))}
              </div>
            </div>
            
            <div className="h-px bg-white/5 w-full" />
            
            <div>
              <h4 className="text-xs font-bold uppercase text-primary mb-3 flex items-center gap-2">
                <Target className="w-3 h-3" /> Target Brand
              </h4>
              <div className="flex flex-wrap gap-2">
                {safeProfile.desiredIdentity.map(p => (
                  <Badge key={p} variant="outline" className="border-primary/30 text-primary">{p}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Active Brand Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {safeProfile.habits.map(habit => (
                <div key={habit.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-background/50 hover:bg-white/5 transition-colors">
                  <span className="font-medium text-foreground">{habit.title}</span>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold text-orange-500">{habit.streakDays}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-white/10 bg-transparent">
          <CardContent className="p-8 text-center flex flex-col items-center justify-center h-full">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Private Reflection</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">"Where are you currently respected for your effort, but not taken seriously for your strategy?"</p>
            <Button variant="outline">Write Reflection</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
// Added dummy Target and Flame import to fix missing icon issue locally
import { Target, Flame } from "lucide-react";
