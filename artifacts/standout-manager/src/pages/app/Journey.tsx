import React from "react";
import { useGetJourney } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, Badge, Button } from "@/components/ui/shared";
import { Sparkles, CheckCircle2, Circle, Flame, Calendar, Target, MessageSquare, BookOpen, Compass, Lock, ChevronRight, PenLine } from "lucide-react";
import { cn, getToken } from "@/lib/utils";

const THIRTY_DAY_CURRICULUM = [
  {
    week: 1,
    theme: "Establishing Authority",
    days: [
      { day: 1, title: "Complete the Management Readiness Diagnostic", type: "assess", description: "Get your baseline score. Know exactly where you stand before building." },
      { day: 2, title: "Read: The 1:1 Operating System", type: "system", description: "Transform your 1:1s from status updates into strategic alignment sessions." },
      { day: 3, title: "Scenario: The Underperforming Employee Everyone Likes", type: "scenario", description: "Practice managing performance without losing team trust." },
      { day: 4, title: "Reflection: Where are you being liked but not respected?", type: "reflection", description: "Honesty is the starting point for change. Write it down." },
      { day: 5, title: "Read: The Feedback Protocol", type: "system", description: "Learn the exact framework for delivering hard feedback that lands well." },
      { day: 6, title: "Scenario: Your Boss Challenges Your Judgment Publicly", type: "scenario", description: "Build composure and executive presence under fire." },
      { day: 7, title: "Weekly Reflection: What's one pattern you need to break?", type: "reflection", description: "End the week with honest self-assessment." },
    ],
  },
  {
    week: 2,
    theme: "Political Intelligence",
    days: [
      { day: 8, title: "Read: Radical Upward Management", type: "system", description: "Manage your boss strategically without them feeling managed." },
      { day: 9, title: "Scenario: Stakeholder Conflict Escalation", type: "scenario", description: "Navigate competing priorities between departments without losing allies." },
      { day: 10, title: "Complete: Political Vulnerability Scan", type: "assess", description: "Assess your exposure to workplace politics and stakeholder misalignment." },
      { day: 11, title: "Read: The Influence Without Authority Playbook", type: "system", description: "Build influence before you have the title to demand it." },
      { day: 12, title: "Reflection: Who has power you don't, and what are they doing differently?", type: "reflection", description: "Study the people above you strategically." },
      { day: 13, title: "Scenario: The Credit-Stealing Peer", type: "scenario", description: "Respond to intellectual theft without burning bridges or looking petty." },
      { day: 14, title: "Weekly Reflection: What relationships need deliberate investment?", type: "reflection", description: "Map your stakeholder landscape and find the gaps." },
    ],
  },
  {
    week: 3,
    theme: "Brand & Reputation",
    days: [
      { day: 15, title: "Complete: Brand Equity Audit", type: "assess", description: "Measure the gap between your intended and perceived professional reputation." },
      { day: 16, title: "Read: The Executive Presence System", type: "system", description: "What high performers do differently in meetings, presentations, and emails." },
      { day: 17, title: "Scenario: Managing Up in a Crisis", type: "scenario", description: "Keep your reputation intact when a project goes sideways." },
      { day: 18, title: "Set Up Your Brand Lab Profile", type: "system", description: "Define your desired professional identity and the words you want to own." },
      { day: 19, title: "Reflection: What is your reputation right now — not what you want, what is it?", type: "reflection", description: "The truth about how others see you is your most valuable data." },
      { day: 20, title: "Scenario: The Performance Review Pivot", type: "scenario", description: "Use your review to build allies, not just defend your record." },
      { day: 21, title: "Weekly Reflection: What's one behavior you need to eliminate?", type: "reflection", description: "Subtraction is as powerful as addition in brand building." },
    ],
  },
  {
    week: 4,
    theme: "Operational Excellence",
    days: [
      { day: 22, title: "Read: The Meeting Control Framework", type: "system", description: "Run meetings that accomplish things and build your reputation as a high performer." },
      { day: 23, title: "Scenario: Team Morale Crisis", type: "scenario", description: "Lead through uncertainty and restore team confidence without false optimism." },
      { day: 24, title: "Read: The Delegation System", type: "system", description: "Build a team that doesn't need you for every decision." },
      { day: 25, title: "Reflection: Where are you the bottleneck in your own team?", type: "reflection", description: "The bottleneck is always at the top of the bottle." },
      { day: 26, title: "Scenario: Cross-Functional Project Conflict", type: "scenario", description: "Navigate competing timelines and ownership disputes strategically." },
      { day: 27, title: "Coach Session: Your 90-Day Action Plan", type: "coach", description: "Use the AI Coach to build a personalized strategic action plan." },
      { day: 28, title: "Reflection: What kind of manager do you want to be known as?", type: "reflection", description: "The 30-day journey ends. The real work begins." },
    ],
  },
];

const TYPE_CONFIG: Record<string, { icon: typeof Target; color: string; label: string; href: string }> = {
  assess: { icon: Target, color: "text-blue-400", label: "Diagnostic", href: "/assess" },
  system: { icon: BookOpen, color: "text-green-400", label: "Playbook", href: "/systems" },
  scenario: { icon: Compass, color: "text-orange-400", label: "Scenario", href: "/scenarios" },
  reflection: { icon: PenLine, color: "text-purple-400", label: "Reflection", href: "/coach" },
  coach: { icon: MessageSquare, color: "text-primary", label: "Coach Session", href: "/coach" },
};

type JourneyAction = {
  id: string;
  title: string;
  type: string;
  day: number;
  isCompleted: boolean;
  description?: string;
};

function ReflectionModal({
  actionId,
  title,
  onClose,
  onSubmit,
}: {
  actionId: string;
  title: string;
  onClose: () => void;
  onSubmit: (text: string) => void;
}) {
  const [text, setText] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/journey/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ actionId, reflectionText: text }),
      });
      onSubmit(text);
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-white/10 shadow-2xl">
        <CardContent className="p-8">
          <Badge variant="outline" className="mb-4 text-[10px] uppercase tracking-widest">Reflection</Badge>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm mb-6">Write honestly. This is your private workspace.</p>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write your honest reflection here..."
            className="w-full bg-background border border-white/10 rounded-xl p-4 text-foreground resize-none h-36 focus:outline-none focus:border-primary transition-colors text-sm"
            autoFocus
          />
          <div className="flex gap-3 mt-4">
            <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
            <Button variant="premium" onClick={handleSubmit} disabled={!text.trim()} isLoading={submitting} className="flex-1">
              Save Reflection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Journey() {
  const { data: journey, isLoading, refetch } = useGetJourney();
  const queryClient = useQueryClient();
  const [reflection, setReflection] = React.useState<{ id: string; title: string } | null>(null);
  const [completingId, setCompletingId] = React.useState<string | null>(null);
  const [activeWeek, setActiveWeek] = React.useState(1);

  if (isLoading) return (
    <div className="p-8 text-center text-muted-foreground animate-pulse">Loading your journey...</div>
  );

  const data = journey as any;
  const currentDay: number = data?.currentDay || 1;
  const streakDays: number = data?.streakDays || 0;
  const completedActions: number = data?.completedActions || 0;
  const totalActions: number = data?.totalActions || 0;

  // Build a map of completed/existing actions from DB
  const dbActions: JourneyAction[] = data?.weeklyActions || [];
  const dbActionMap = new Map(dbActions.map((a: JourneyAction) => [a.day, a]));

  const currentWeek = THIRTY_DAY_CURRICULUM.find(w => w.days.some(d => d.day === currentDay))?.week || 1;

  const handleComplete = async (action: any) => {
    if (action.type === "reflection") {
      setReflection({ id: action.id || action.day.toString(), title: action.title });
      return;
    }
    setCompletingId(action.id);
    try {
      await fetch("/api/journey/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ actionId: action.id }),
      });
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/journey"] });
    } finally {
      setCompletingId(null);
    }
  };

  const activeWeekData = THIRTY_DAY_CURRICULUM.find(w => w.week === activeWeek) || THIRTY_DAY_CURRICULUM[0];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {reflection && (
        <ReflectionModal
          actionId={reflection.id}
          title={reflection.title}
          onClose={() => setReflection(null)}
          onSubmit={() => { refetch(); }}
        />
      )}

      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary" />
          The 30-Day Standout Foundation
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">A structured curriculum to build baseline credibility as a manager or high-performing IC.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-card border-primary/20">
          <CardContent className="p-5 text-center">
            <div className="text-3xl font-display font-bold text-primary">{currentDay}</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Current Day</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <div className="text-3xl font-display font-bold text-orange-400">{streakDays}</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" /> Day Streak
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <div className="text-3xl font-display font-bold text-green-400">{completedActions}</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <div className="text-3xl font-display font-bold">{30 - currentDay}</div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Days Remaining</div>
          </CardContent>
        </Card>
      </div>

      {/* Week Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {THIRTY_DAY_CURRICULUM.map(week => (
          <button
            key={week.week}
            onClick={() => setActiveWeek(week.week)}
            className={cn(
              "flex-shrink-0 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all",
              activeWeek === week.week
                ? "bg-primary/20 border-primary text-primary"
                : week.week === currentWeek
                ? "bg-card border-white/20 text-foreground"
                : "bg-card border-white/5 text-muted-foreground hover:bg-white/5"
            )}
          >
            <div>Week {week.week}</div>
            <div className="text-[10px] opacity-70">{week.theme}</div>
          </button>
        ))}
      </div>

      {/* Week Detail */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold">Week {activeWeekData.week}: {activeWeekData.theme}</h2>
            <p className="text-muted-foreground text-sm mt-1">Days {activeWeekData.days[0].day}–{activeWeekData.days[activeWeekData.days.length - 1].day}</p>
          </div>
          {activeWeek < currentWeek && (
            <Badge variant="secondary" className="bg-green-500/10 text-green-400">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Week Complete
            </Badge>
          )}
          {activeWeek > currentWeek && (
            <Badge variant="secondary" className="bg-white/5 text-muted-foreground">
              <Lock className="w-3 h-3 mr-1" /> Coming Up
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          {activeWeekData.days.map((dayItem, i) => {
            const dbAction = dbActionMap.get(dayItem.day);
            const isCompleted = dbAction?.isCompleted || dayItem.day < currentDay - 2;
            const isToday = dayItem.day === currentDay;
            const isFuture = dayItem.day > currentDay;
            const typeConfig = TYPE_CONFIG[dayItem.type] || TYPE_CONFIG.system;
            const TypeIcon = typeConfig.icon;

            return (
              <Card
                key={dayItem.day}
                className={cn(
                  "transition-all border",
                  isCompleted ? "border-green-500/10 bg-green-500/5" :
                  isToday ? "border-primary/40 shadow-lg shadow-primary/10 bg-primary/5" :
                  isFuture ? "border-white/5 opacity-60" :
                  "border-white/10 hover:border-white/20"
                )}
              >
                <CardContent className="p-5 flex items-center gap-4">
                  {/* Day number */}
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0",
                    isCompleted ? "bg-green-500/20 text-green-400" :
                    isToday ? "bg-primary/20 text-primary" :
                    "bg-secondary text-muted-foreground"
                  )}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : dayItem.day}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider", typeConfig.color, "border-current/20 bg-current/5")}>
                        <TypeIcon className="w-2.5 h-2.5 mr-1" />
                        {typeConfig.label}
                      </Badge>
                      {isToday && <Badge variant="secondary" className="text-[10px] bg-primary/20 text-primary">Today</Badge>}
                    </div>
                    <h4 className={cn("font-semibold text-sm", isCompleted ? "text-foreground/60 line-through" : "text-foreground")}>
                      {dayItem.title}
                    </h4>
                    {!isCompleted && (
                      <p className="text-xs text-muted-foreground mt-0.5">{dayItem.description}</p>
                    )}
                  </div>

                  {/* Action */}
                  {!isFuture && !isCompleted && (
                    <div className="flex-shrink-0 flex items-center gap-2">
                      {dbAction?.id ? (
                        <Button
                          variant={isToday ? "premium" : "outline"}
                          size="sm"
                          onClick={() => handleComplete(dbAction)}
                          isLoading={completingId === dbAction.id}
                          className="text-xs"
                        >
                          {dayItem.type === "reflection" ? "Reflect" : "Mark Done"}
                        </Button>
                      ) : (
                        <a href={typeConfig.href}>
                          <Button variant={isToday ? "premium" : "outline"} size="sm" className="text-xs">
                            Start <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Reflection Prompts */}
      {(data?.reflectionPrompts || []).length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <PenLine className="w-5 h-5 text-purple-400" />
            This Week's Reflection Prompts
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {(data?.reflectionPrompts || []).map((prompt: string, i: number) => (
              <Card key={i} className="border-white/5 hover:border-purple-500/20 transition-colors group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-purple-400 text-lg mt-0.5">"</span>
                    <p className="text-sm text-foreground/80 italic leading-relaxed flex-1">{prompt}</p>
                  </div>
                  <a href="/coach">
                    <Button variant="ghost" size="sm" className="mt-4 w-full text-xs text-muted-foreground group-hover:text-primary">
                      Explore with Coach →
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
