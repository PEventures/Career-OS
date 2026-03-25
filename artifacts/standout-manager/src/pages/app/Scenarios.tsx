import React from "react";
import { useListScenarios } from "@workspace/api-client-react";
import { Card, CardContent, Badge, Button } from "@/components/ui/shared";
import { Link } from "wouter";
import { Compass, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { UpgradeModal } from "@/components/ui/UpgradeModal";

export default function Scenarios() {
  const { data: scenarios, isLoading } = useListScenarios();
  const [filter, setFilter] = React.useState("all");
  const [upgradeTarget, setUpgradeTarget] = React.useState<{ name: string; description: string } | null>(null);

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading scenarios...</div>;

  const filtered = filter === "all" ? scenarios : scenarios?.filter(s => s.category.toLowerCase() === filter.toLowerCase());

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

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["All", "Performance", "Politics", "Conflict", "Visibility"].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat.toLowerCase())}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
              filter === cat.toLowerCase() 
                ? "bg-primary/20 border-primary text-primary" 
                : "bg-card border-white/5 text-muted-foreground hover:bg-white/5"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered?.map((scenario) => (
          <Card
            key={scenario.id}
            className={cn(
              "group relative overflow-hidden flex flex-col h-full transition-colors",
              scenario.isPremium
                ? "border-amber-500/20 hover:border-amber-500/40 cursor-pointer"
                : "hover:border-primary/50 cursor-pointer"
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
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="uppercase tracking-wider text-[10px]">{scenario.category}</Badge>
                {scenario.isPremium && (
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
                    <Lock className="w-3 h-3 mr-1" /> Premium
                  </Badge>
                )}
              </div>
              <h3 className={cn(
                "text-xl font-bold mb-2 transition-colors",
                scenario.isPremium ? "group-hover:text-amber-400" : "group-hover:text-primary"
              )}>
                {scenario.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
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
        ))}
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
