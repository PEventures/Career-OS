import React from "react";
import { useListSystems } from "@workspace/api-client-react";
import { Card, CardContent, Badge, Button } from "@/components/ui/shared";
import { BookOpen, ChevronRight, Lock } from "lucide-react";

export default function Systems() {
  const { data: systems, isLoading } = useListSystems();

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading playbooks...</div>;

  // Fallback data if API is empty for UI display
  const displaySystems = systems?.length ? systems : [
    { id: "1", title: "The 1:1 Operating System", description: "Transform 1:1s from status updates into strategic alignment sessions.", category: "Communication", estimatedMinutes: 5, isPremium: false },
    { id: "2", title: "Radical Upward Management", description: "How to manage your boss without them feeling managed.", category: "Politics", estimatedMinutes: 8, isPremium: true },
    { id: "3", title: "The Feedback Protocol", description: "Deliver harsh truths without damaging trust or causing defensiveness.", category: "Performance", estimatedMinutes: 10, isPremium: false }
  ] as any[];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          Systems & Playbooks
        </h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
          Repeatable frameworks and scripts. Don't rely on inspiration—rely on a system.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displaySystems.map((system) => (
          <Card key={system.id} className="group relative overflow-hidden flex flex-col hover:border-white/20 transition-all duration-300">
            <CardContent className="p-6 md:p-8 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                  <BookOpen className="w-6 h-6" />
                </div>
                {system.isPremium && <Badge variant="secondary" className="bg-amber-500/10 text-amber-500"><Lock className="w-3 h-3 mr-1"/> Premium</Badge>}
              </div>
              
              <Badge variant="outline" className="w-fit mb-4 text-[10px] uppercase tracking-wider">{system.category}</Badge>
              <h3 className="text-2xl font-display font-bold mb-3">{system.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
                {system.description}
              </p>
              
              <Button variant="outline" className="w-full justify-between group-hover:bg-white/5 border-white/10">
                View Playbook
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
