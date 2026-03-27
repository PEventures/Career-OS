import React from "react";
import { useListSystems } from "@workspace/api-client-react";
import { Card, CardContent, Badge, Button } from "@/components/ui/shared";
import { BookOpen, ChevronRight, Lock, Filter } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { UpgradeModal } from "@/components/ui/UpgradeModal";

const CATEGORIES = ["All", "Communication", "Performance", "Politics", "Visibility", "Conflict"];
const ICONS: Record<string, string> = {
  Communication: "💬", Performance: "📊", Politics: "♟️", Visibility: "👁️", Conflict: "⚡", Foundations: "🏗️"
};

export default function Systems() {
  const { data: systems, isLoading } = useListSystems();
  const [filter, setFilter] = React.useState("All");
  const [upgradeTarget, setUpgradeTarget] = React.useState<{ name: string; description: string } | null>(null);

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading playbooks...</div>;

  const allSystems = (systems as any[]) || [];
  const filtered = filter === "All" ? allSystems : allSystems.filter(s => s.category === filter);

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          Systems & Playbooks
        </h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
          Repeatable frameworks, exact scripts, and step-by-step systems. Stop relying on instinct — rely on a system.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
              filter === cat
                ? "bg-primary/20 border-primary text-primary"
                : "bg-card border-white/5 text-muted-foreground hover:bg-white/5"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No playbooks in this category yet.</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((system: any) => (
          <Card
            key={system.id}
            className={cn(
              "group relative overflow-hidden flex flex-col transition-all duration-300",
              system.isLocked
                ? "border-amber-500/20 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 cursor-pointer"
                : "hover:border-white/20 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
            )}
            onClick={() => {
              if (system.isLocked) {
                setUpgradeTarget({ name: system.title, description: system.description });
              }
            }}
          >
            {system.isLocked && (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
            )}
            <CardContent className="p-6 md:p-8 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all",
                  system.isLocked
                    ? "bg-amber-500/10 group-hover:bg-amber-500/20 group-hover:scale-110"
                    : "bg-secondary group-hover:scale-110 group-hover:bg-primary/10"
                )}>
                  {ICONS[system.category] || "📋"}
                </div>
                <div className="flex items-center gap-2">
                  {system.isPremium && (
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">
                      <Lock className="w-3 h-3 mr-1" /> Premium
                    </Badge>
                  )}
                </div>
              </div>

              <Badge variant="outline" className="w-fit mb-4 text-[10px] uppercase tracking-wider">{system.category}</Badge>
              <h3 className={cn(
                "text-xl font-display font-bold mb-3 transition-colors",
                system.isLocked ? "group-hover:text-amber-400" : "group-hover:text-primary"
              )}>
                {system.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6 flex-1 text-sm">
                {system.description}
              </p>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span>{(system.steps || []).length} steps</span>
                <span>{system.estimatedMinutes} min read</span>
                {(system.scripts || []).length > 0 && <span>{(system.scripts || []).length} scripts</span>}
              </div>

              {system.isLocked ? (
                <Button
                  variant="outline"
                  className="w-full justify-between border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all"
                  onClick={e => {
                    e.stopPropagation();
                    setUpgradeTarget({ name: system.title, description: system.description });
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Unlock Playbook
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Link href={`/systems/${system.id}`} onClick={e => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    className="w-full justify-between group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary border-white/10 transition-all"
                  >
                    View Full Playbook
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Button>
                </Link>
              )}
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
