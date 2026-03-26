import React from "react";
import { useListScenarios } from "@workspace/api-client-react";
import { Card, CardContent, Badge, Button } from "@/components/ui/shared";
import { Link } from "wouter";
import { Compass, Clock, Lock, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UpgradeModal } from "@/components/ui/UpgradeModal";

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  intermediate: { label: "Intermediate", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  director: { label: "Director", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  executive: { label: "Executive", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
};

export default function Scenarios() {
  const { data: scenarios, isLoading } = useListScenarios();
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [difficultyFilter, setDifficultyFilter] = React.useState("all");
  const [upgradeTarget, setUpgradeTarget] = React.useState<{ name: string; description: string } | null>(null);

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading scenarios...</div>;

  const allScenarios = scenarios || [];

  const filtered = allScenarios.filter(s => {
    const catMatch = categoryFilter === "all" || s.category.toLowerCase() === categoryFilter.toLowerCase();
    const diffMatch = difficultyFilter === "all" || (s as any).difficulty === difficultyFilter;
    return catMatch && diffMatch;
  });

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Compass className="w-8 h-8 text-primary" />
          Scenario Simulator
        </h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
          Navigate realistic workplace tension. Build your judgment in a safe environment before you face it in the real world.
        </p>
      </div>

      {/* Category filters */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Category</p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-wrap">
          {["All", "Performance", "Politics", "Conflict", "Visibility"].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat.toLowerCase())}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                categoryFilter === cat.toLowerCase()
                  ? "bg-primary/20 border-primary text-primary"
                  : "bg-card border-white/5 text-muted-foreground hover:bg-white/5"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty filters */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Difficulty Level</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { id: "all", label: "All Levels", color: "text-foreground", bg: "bg-card", border: "border-white/5" },
            { id: "intermediate", label: "Intermediate", ...DIFFICULTY_CONFIG.intermediate },
            { id: "director", label: "Director", ...DIFFICULTY_CONFIG.director },
            { id: "executive", label: "Executive", ...DIFFICULTY_CONFIG.executive },
          ].map(d => (
            <button
              key={d.id}
              onClick={() => setDifficultyFilter(d.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border flex items-center gap-1.5",
                difficultyFilter === d.id
                  ? cn(d.bg, "border-current", d.color, "opacity-100")
                  : "bg-card border-white/5 text-muted-foreground hover:bg-white/5"
              )}
            >
              {d.id !== "all" && <BarChart2 className="w-3 h-3" />}
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No scenarios match these filters. Try adjusting the category or difficulty.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((scenario) => {
          const diff = DIFFICULTY_CONFIG[(scenario as any).difficulty] || DIFFICULTY_CONFIG.intermediate;
          return (
            <Card
              key={scenario.id}
              className={cn(
                "group relative overflow-hidden flex flex-col h-full transition-colors cursor-pointer",
                scenario.isPremium
                  ? "border-amber-500/20 hover:border-amber-500/40"
                  : "hover:border-primary/50"
              )}
              onClick={() => {
                if (scenario.isPremium) {
                  setUpgradeTarget({ name: scenario.title, description: scenario.description });
                }
              }}
            >
              {scenario.isCompleted && (
                <div className="absolute top-0 right-0 p-2 z-10">
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">Completed</Badge>
                </div>
              )}
              {scenario.isPremium && (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
              )}
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge variant="outline" className="uppercase tracking-wider text-[10px]">{scenario.category}</Badge>
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", diff.bg, diff.color, diff.border)}>
                    {diff.label}
                  </span>
                  {scenario.isPremium && (
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
                      <Lock className="w-3 h-3 mr-1" /> Pro
                    </Badge>
                  )}
                </div>
                <h3 className={cn(
                  "text-lg font-bold mb-2 transition-colors leading-snug",
                  scenario.isPremium ? "group-hover:text-amber-400" : "group-hover:text-primary"
                )}>
                  {scenario.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-5 flex-1">
                  {scenario.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div className="flex items-center text-xs text-muted-foreground font-medium">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    {scenario.estimatedMinutes} min
                  </div>
                  {scenario.isPremium ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/50"
                      onClick={e => {
                        e.stopPropagation();
                        setUpgradeTarget({ name: scenario.title, description: scenario.description });
                      }}
                    >
                      <Lock className="w-3 h-3 mr-1.5" /> Unlock
                    </Button>
                  ) : (
                    <Link href={`/scenarios/${scenario.id}`} onClick={e => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
                      >
                        {scenario.isCompleted ? "Review" : "Simulate"}
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {upgradeTarget && (
        <UpgradeModal
          onClose={() => setUpgradeTarget(null)}
          featureName={upgradeTarget.name}
          featureDescription={upgradeTarget.description}
        />
      )}
    </div>
  );
}
