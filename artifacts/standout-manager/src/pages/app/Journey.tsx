import React from "react";
import { Link } from "wouter";
import { useGetJourney } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, Badge, Button } from "@/components/ui/shared";
import {
  Sparkles, CheckCircle2, Flame, Target, MessageSquare, BookOpen,
  Compass, Lock, ChevronRight, PenLine, Star, Trophy, Zap, ArrowRight,
  Circle
} from "lucide-react";
import { cn, getToken } from "@/lib/utils";

const THIRTY_DAY_CURRICULUM = [
  {
    week: 1,
    theme: "Establishing Authority",
    color: "blue",
    milestone: "Authority Unlocked",
    days: [
      { day: 1, title: "Complete the Management Readiness Diagnostic", type: "assess", description: "Get your baseline. Know exactly where you stand before building.", href: "/assess/management-readiness" },
      { day: 2, title: "Read: The 1:1 Operating System", type: "system", description: "Transform your 1:1s from status updates into strategic alignment sessions.", href: "/systems" },
      { day: 3, title: "Scenario: The Underperforming Employee Everyone Likes", type: "scenario", description: "Practice managing performance without losing team trust.", href: "/scenarios" },
      { day: 4, title: "Reflection: Where are you being liked but not respected?", type: "reflection", description: "Honesty is the starting point for change.", href: "/coach" },
      { day: 5, title: "Read: The Feedback Protocol", type: "system", description: "The exact framework for delivering hard feedback that lands well.", href: "/systems" },
      { day: 6, title: "Scenario: Your Boss Challenges Your Judgment Publicly", type: "scenario", description: "Build composure and executive presence under fire.", href: "/scenarios" },
      { day: 7, title: "Weekly Reflection: What pattern do you need to break?", type: "reflection", description: "End the week with honest self-assessment.", href: "/coach" },
    ],
  },
  {
    week: 2,
    theme: "Political Intelligence",
    color: "purple",
    milestone: "Operator Status",
    days: [
      { day: 8, title: "Read: Radical Upward Management", type: "system", description: "Manage your boss strategically without them feeling managed.", href: "/systems" },
      { day: 9, title: "Scenario: Stakeholder Conflict Escalation", type: "scenario", description: "Navigate competing priorities without losing allies.", href: "/scenarios" },
      { day: 10, title: "Complete: Political Vulnerability Scan", type: "assess", description: "Assess your exposure to workplace politics.", href: "/assess" },
      { day: 11, title: "Read: The Influence Without Authority Playbook", type: "system", description: "Build influence before you have the title to demand it.", href: "/systems" },
      { day: 12, title: "Reflection: Who has power you don't — and what are they doing differently?", type: "reflection", description: "Study the people above you strategically.", href: "/coach" },
      { day: 13, title: "Scenario: The Credit-Stealing Peer", type: "scenario", description: "Respond to intellectual theft without burning bridges.", href: "/scenarios" },
      { day: 14, title: "Weekly Reflection: What relationships need deliberate investment?", type: "reflection", description: "Map your stakeholder landscape.", href: "/coach" },
    ],
  },
  {
    week: 3,
    theme: "Brand & Reputation",
    color: "amber",
    milestone: "Brand Activated",
    days: [
      { day: 15, title: "Complete: Brand Equity Audit", type: "assess", description: "Measure the gap between your intended and perceived reputation.", href: "/assess" },
      { day: 16, title: "Read: The Executive Presence System", type: "system", description: "What high performers do differently in meetings, presentations, and emails.", href: "/systems" },
      { day: 17, title: "Scenario: Managing Up in a Crisis", type: "scenario", description: "Keep your reputation intact when a project goes sideways.", href: "/scenarios" },
      { day: 18, title: "Set Up Your Brand Lab Profile", type: "system", description: "Define your desired professional identity.", href: "/brand-lab" },
      { day: 19, title: "Reflection: What is your reputation right now — not what you want, what is it?", type: "reflection", description: "The truth is your most valuable data.", href: "/coach" },
      { day: 20, title: "Scenario: The Performance Review Pivot", type: "scenario", description: "Use your review to build allies, not just defend your record.", href: "/scenarios" },
      { day: 21, title: "Weekly Reflection: What behavior do you need to eliminate?", type: "reflection", description: "Subtraction is as powerful as addition.", href: "/coach" },
    ],
  },
  {
    week: 4,
    theme: "Operational Excellence",
    color: "green",
    milestone: "Standout Manager",
    days: [
      { day: 22, title: "Read: The Meeting Control Framework", type: "system", description: "Run meetings that accomplish things and build your reputation.", href: "/systems" },
      { day: 23, title: "Scenario: Team Morale Crisis", type: "scenario", description: "Lead through uncertainty without false optimism.", href: "/scenarios" },
      { day: 24, title: "Read: The Delegation System", type: "system", description: "Build a team that doesn't need you for every decision.", href: "/systems" },
      { day: 25, title: "Reflection: Where are you the bottleneck in your own team?", type: "reflection", description: "The bottleneck is always at the top of the bottle.", href: "/coach" },
      { day: 26, title: "Scenario: Cross-Functional Project Conflict", type: "scenario", description: "Navigate competing timelines and ownership disputes.", href: "/scenarios" },
      { day: 27, title: "Coach Session: Your 90-Day Action Plan", type: "coach", description: "Build a personalized strategic action plan with your AI Coach.", href: "/coach" },
      { day: 28, title: "Reflection: What kind of manager do you want to be known as?", type: "reflection", description: "The 30-day journey ends. The real work begins.", href: "/coach" },
    ],
  },
];

const TYPE_CONFIG: Record<string, { icon: typeof Target; color: string; bg: string; label: string }> = {
  assess:     { icon: Target,       color: "text-blue-400",   bg: "bg-blue-500/10",   label: "Diagnostic"    },
  system:     { icon: BookOpen,     color: "text-green-400",  bg: "bg-green-500/10",  label: "Playbook"      },
  scenario:   { icon: Compass,      color: "text-orange-400", bg: "bg-orange-500/10", label: "Scenario"      },
  reflection: { icon: PenLine,      color: "text-purple-400", bg: "bg-purple-500/10", label: "Reflection"    },
  coach:      { icon: MessageSquare,color: "text-primary",    bg: "bg-primary/10",    label: "Coach Session" },
};

const WEEK_COLORS: Record<string, { text: string; border: string; bg: string; glow: string }> = {
  blue:   { text: "text-blue-400",   border: "border-blue-500/30",  bg: "bg-blue-500/10",  glow: "shadow-blue-500/20"  },
  purple: { text: "text-purple-400", border: "border-purple-500/30",bg: "bg-purple-500/10",glow: "shadow-purple-500/20"},
  amber:  { text: "text-amber-400",  border: "border-amber-500/30", bg: "bg-amber-500/10", glow: "shadow-amber-500/20" },
  green:  { text: "text-green-400",  border: "border-green-500/30", bg: "bg-green-500/10", glow: "shadow-green-500/20" },
};

const RANKS = [
  { name: "New Manager",        minDay: 0,  maxDay: 7,  icon: "🌱", color: "text-slate-400",  ring: "ring-slate-500/30",  glow: "#94a3b8" },
  { name: "Building Credibility",minDay: 8, maxDay: 14, icon: "📈", color: "text-blue-400",   ring: "ring-blue-500/40",   glow: "#60a5fa" },
  { name: "Developing Leader",   minDay: 15,maxDay: 21, icon: "⚡", color: "text-purple-400", ring: "ring-purple-500/40", glow: "#c084fc" },
  { name: "Standout Manager",    minDay: 22,maxDay: 30, icon: "🏆", color: "text-amber-400",  ring: "ring-amber-500/40",  glow: "#f59e0b" },
];

function getRank(day: number) {
  return RANKS.find(r => day >= r.minDay && day <= r.maxDay) || RANKS[0];
}

function getNextRank(day: number) {
  const idx = RANKS.findIndex(r => day >= r.minDay && day <= r.maxDay);
  return RANKS[idx + 1] || null;
}

function getRankProgress(day: number) {
  const rank = getRank(day);
  const span = rank.maxDay - rank.minDay;
  const progress = day - rank.minDay;
  return Math.min(100, Math.round((progress / span) * 100));
}

/* ─── Faceless Avatar ──────────────────────────────────────────────────── */
function FacelessAvatar({ day, size = 120 }: { day: number; size?: number }) {
  const rank = getRank(day);
  const progress = getRankProgress(day);
  const isStandout = day >= 22;
  const isDeveloping = day >= 15;
  const isBuilding = day >= 8;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer glow ring */}
      <div
        className={cn(
          "absolute inset-0 rounded-full transition-all duration-1000",
          isStandout ? "opacity-60 animate-pulse" : isDeveloping ? "opacity-40" : isBuilding ? "opacity-20" : "opacity-0"
        )}
        style={{
          background: `radial-gradient(circle, ${rank.glow}40 0%, transparent 70%)`,
          filter: "blur(8px)",
        }}
      />

      {/* Avatar container */}
      <div
        className={cn("relative rounded-full ring-2 flex items-center justify-center overflow-hidden", rank.ring)}
        style={{ width: size, height: size, background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}
      >
        {/* Faceless SVG figure */}
        <svg
          viewBox="0 0 100 120"
          width={size * 0.65}
          height={size * 0.65 * 1.2}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body glow filter */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={rank.glow} stopOpacity={isBuilding ? 0.9 : 0.5} />
              <stop offset="100%" stopColor={rank.glow} stopOpacity={isBuilding ? 0.5 : 0.2} />
            </linearGradient>
          </defs>

          {/* Head */}
          <ellipse
            cx="50" cy="22" rx="18" ry="20"
            fill="url(#bodyGrad)"
            filter={isDeveloping ? "url(#glow)" : undefined}
            opacity={0.9}
          />

          {/* Neck */}
          <rect x="44" y="40" width="12" height="8" rx="4" fill="url(#bodyGrad)" opacity={0.8} />

          {/* Shoulders/Body */}
          <path
            d="M 10 60 Q 20 48 34 50 L 50 52 L 66 50 Q 80 48 90 60 L 88 95 Q 75 100 50 100 Q 25 100 12 95 Z"
            fill="url(#bodyGrad)"
            filter={isStandout ? "url(#glow)" : undefined}
            opacity={0.85}
          />

          {/* Suit lapels (visible at higher levels) */}
          {isBuilding && (
            <>
              <path d="M 40 52 L 44 70 L 50 60 L 56 70 L 60 52" fill="none" stroke={rank.glow} strokeWidth="1.5" opacity={0.6} />
            </>
          )}

          {/* Badge/rank indicator */}
          {isDeveloping && (
            <circle cx="50" cy="75" r="6" fill={rank.glow} opacity={0.8} />
          )}
          {isStandout && (
            <>
              <circle cx="50" cy="75" r="7" fill={rank.glow} opacity={0.9} filter="url(#glow)" />
              {/* Star */}
              <text x="50" y="79" textAnchor="middle" fontSize="8" fill="#0f172a" fontWeight="bold">★</text>
            </>
          )}

          {/* Rank-specific crown for Standout */}
          {isStandout && (
            <path
              d="M 30 8 L 36 2 L 50 10 L 64 2 L 70 8 L 67 14 L 33 14 Z"
              fill={rank.glow}
              filter="url(#glow)"
              opacity={0.9}
            />
          )}
        </svg>

        {/* Progress overlay shimmer */}
        {progress > 50 && (
          <div
            className="absolute bottom-0 left-0 right-0 h-1/3 rounded-b-full opacity-10"
            style={{ background: `linear-gradient(to top, ${rank.glow}, transparent)` }}
          />
        )}
      </div>

      {/* Rank icon badge */}
      <div
        className={cn(
          "absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-sm",
          "bg-card shadow-lg"
        )}
      >
        {rank.icon}
      </div>
    </div>
  );
}

/* ─── Journey Map Path ─────────────────────────────────────────────────── */
function JourneyMap({ currentDay, completedDays }: { currentDay: number; completedDays: Set<number> }) {
  return (
    <div className="relative overflow-x-auto pb-2">
      <div className="flex items-center gap-0 min-w-max px-2">
        {THIRTY_DAY_CURRICULUM.map((week, wi) => {
          const wc = WEEK_COLORS[week.color];
          return (
            <React.Fragment key={week.week}>
              {/* Week group */}
              <div className="flex items-center gap-0">
                {week.days.map((day, di) => {
                  const isDone = completedDays.has(day.day) || day.day < currentDay - 1;
                  const isToday = day.day === currentDay;
                  const isFuture = day.day > currentDay;
                  const typeConfig = TYPE_CONFIG[day.type];
                  const TypeIcon = typeConfig.icon;

                  return (
                    <React.Fragment key={day.day}>
                      {/* Connecting line */}
                      {di > 0 && (
                        <div
                          className={cn(
                            "h-0.5 w-5 flex-shrink-0 transition-colors duration-500",
                            isDone ? "bg-green-500/60" : isFuture ? "bg-white/10" : "bg-primary/30"
                          )}
                        />
                      )}

                      {/* Day node */}
                      <div className="relative flex-shrink-0 group" title={`Day ${day.day}: ${day.title}`}>
                        <div
                          className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                            isDone
                              ? "bg-green-500/20 border-green-500/60 text-green-400"
                              : isToday
                              ? cn("border-primary bg-primary/20 text-primary shadow-lg shadow-primary/30", "animate-pulse-slow")
                              : isFuture
                              ? "bg-card border-white/10 text-muted-foreground/30"
                              : "bg-card border-white/20 text-muted-foreground"
                          )}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : isToday ? (
                            <Star className="w-4 h-4 fill-primary" />
                          ) : isFuture ? (
                            <span className="text-[10px] font-bold">{day.day}</span>
                          ) : (
                            <TypeIcon className="w-3.5 h-3.5" />
                          )}
                        </div>

                        {/* Today pulse ring */}
                        {isToday && (
                          <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-ping" />
                        )}

                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 pointer-events-none">
                          <div className="bg-card border border-white/10 rounded-lg px-3 py-2 shadow-xl text-xs whitespace-nowrap max-w-48">
                            <div className="font-bold text-foreground">Day {day.day}</div>
                            <div className="text-muted-foreground truncate max-w-40">{day.title}</div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Week milestone marker */}
              {wi < THIRTY_DAY_CURRICULUM.length - 1 && (
                <>
                  <div className={cn("h-0.5 w-5 flex-shrink-0", wc.border, "border-t-2 border-dashed opacity-50")} />
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border-2 text-sm font-bold transition-all",
                      currentDay > week.days[week.days.length - 1].day
                        ? cn(wc.text, wc.border, wc.bg, "shadow-md", wc.glow)
                        : "border-white/5 bg-card text-muted-foreground/20"
                    )}
                  >
                    W{week.week}
                  </div>
                  <div className="h-0.5 w-5 flex-shrink-0 border-t-2 border-dashed border-white/10" />
                </>
              )}
            </React.Fragment>
          );
        })}

        {/* Final goal */}
        <div className="h-0.5 w-5 bg-amber-500/30 flex-shrink-0" />
        <div
          className={cn(
            "w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center border-2 text-xl transition-all",
            currentDay >= 28
              ? "border-amber-500/60 bg-amber-500/20 shadow-lg shadow-amber-500/30"
              : "border-white/10 bg-card opacity-30"
          )}
        >
          🏆
        </div>
      </div>

      {/* Week labels */}
      <div className="flex gap-0 mt-2 min-w-max px-2 text-[9px] text-muted-foreground">
        {THIRTY_DAY_CURRICULUM.map((week, wi) => {
          const wc = WEEK_COLORS[week.color];
          return (
            <React.Fragment key={week.week}>
              <div className="flex gap-0">
                {week.days.map((d, di) => (
                  <React.Fragment key={d.day}>
                    {di > 0 && <div className="w-5 flex-shrink-0" />}
                    <div className="w-9 text-center flex-shrink-0 uppercase tracking-wide">{d.day}</div>
                  </React.Fragment>
                ))}
              </div>
              {wi < THIRTY_DAY_CURRICULUM.length - 1 && (
                <>
                  <div className="w-5 flex-shrink-0" />
                  <div className={cn("w-10 text-center flex-shrink-0", wc.text, "font-bold uppercase")}>W{week.week + 1}</div>
                  <div className="w-5 flex-shrink-0" />
                </>
              )}
            </React.Fragment>
          );
        })}
        <div className="w-5 flex-shrink-0" />
        <div className="w-12 text-center flex-shrink-0 text-amber-400 font-bold uppercase tracking-wide">Goal</div>
      </div>
    </div>
  );
}

/* ─── Reflection Modal ─────────────────────────────────────────────────── */
function ReflectionModal({
  actionId, title, onClose, onSubmit,
}: {
  actionId: string; title: string; onClose: () => void; onSubmit: () => void;
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
      onSubmit();
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-purple-500/20 shadow-2xl shadow-purple-500/10">
        <CardContent className="p-8">
          <Badge variant="outline" className="mb-4 text-[10px] uppercase tracking-widest text-purple-400 border-purple-500/30">Reflection</Badge>
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

/* ─── Today's Mission ──────────────────────────────────────────────────── */
function TodaysMission({ day, onComplete, completing }: {
  day: typeof THIRTY_DAY_CURRICULUM[0]["days"][0] | undefined;
  onComplete: (d: any) => void;
  completing: boolean;
}) {
  if (!day) return null;
  const typeConfig = TYPE_CONFIG[day.type] || TYPE_CONFIG.system;
  const TypeIcon = typeConfig.icon;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-amber-600/5 shadow-xl shadow-primary/10 p-6 md:p-8">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-full">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Today's Mission — Day {day.day}</span>
          </div>
        </div>
        <div className="flex items-start gap-5">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border", typeConfig.bg, "border-current/10")}>
            <TypeIcon className={cn("w-6 h-6", typeConfig.color)} />
          </div>
          <div className="flex-1">
            <Badge variant="outline" className={cn("text-[10px] uppercase tracking-widest mb-2", typeConfig.color, "border-current/20")}>
              {typeConfig.label}
            </Badge>
            <h3 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2 leading-tight">{day.title}</h3>
            <p className="text-muted-foreground text-sm mb-5">{day.description}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <Link href={day.href || "/"}>
                <Button variant="premium" className="gap-2">
                  Start <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onComplete(day)}
                isLoading={completing}
                className="text-xs"
              >
                {day.type === "reflection" ? "Open Reflection" : "Mark Complete"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─────────────────────────────────────────────────────────────── */
export default function Journey() {
  const { data: journey, isLoading, refetch } = useGetJourney();
  const queryClient = useQueryClient();
  const [reflection, setReflection] = React.useState<{ id: string; title: string } | null>(null);
  const [completingId, setCompletingId] = React.useState<string | null>(null);
  const [activeWeek, setActiveWeek] = React.useState(1);

  if (isLoading) return (
    <div className="min-h-64 flex items-center justify-center text-muted-foreground animate-pulse">
      Loading your journey...
    </div>
  );

  const data = journey as any;
  const currentDay: number = Math.max(1, data?.currentDay || 1);
  const streakDays: number = data?.streakDays || 0;
  const completedActions: number = data?.completedActions || 0;
  const totalActions: number = data?.totalActions || 28;

  const dbActions = (data?.weeklyActions || []) as { day: number; isCompleted: boolean; id: string }[];
  const completedSet = new Set<number>(dbActions.filter(a => a.isCompleted).map(a => a.day));
  // Also consider days significantly before current as completed
  for (let d = 1; d < currentDay - 1; d++) completedSet.add(d);

  const overallProgress = Math.round((completedActions / totalActions) * 100) || Math.round(((currentDay - 1) / 28) * 100);
  const rank = getRank(currentDay);
  const nextRank = getNextRank(currentDay);
  const rankProgress = getRankProgress(currentDay);

  const currentWeek = THIRTY_DAY_CURRICULUM.find(w => w.days.some(d => d.day === currentDay))?.week || 1;
  const activeWeekData = THIRTY_DAY_CURRICULUM.find(w => w.week === activeWeek) || THIRTY_DAY_CURRICULUM[0];

  // Today's day item from curriculum
  const todayItem = THIRTY_DAY_CURRICULUM.flatMap(w => w.days).find(d => d.day === currentDay);
  const dbTodayAction = dbActions.find(a => a.day === currentDay);

  const handleComplete = async (dayItem: any) => {
    if (dayItem.type === "reflection") {
      const id = dbActions.find(a => a.day === dayItem.day)?.id || dayItem.day.toString();
      setReflection({ id, title: dayItem.title });
      return;
    }
    const id = dbActions.find(a => a.day === dayItem.day)?.id || dayItem.day.toString();
    setCompletingId(id);
    try {
      await fetch("/api/journey/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ actionId: id }),
      });
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/journey"] });
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-fade-in">
      {reflection && (
        <ReflectionModal
          actionId={reflection.id}
          title={reflection.title}
          onClose={() => setReflection(null)}
          onSubmit={() => refetch()}
        />
      )}

      {/* ── Hero: Avatar + Rank ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-card via-card to-background p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-600/5 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">

          {/* Avatar */}
          <div className="flex flex-col items-center gap-4 flex-shrink-0">
            <FacelessAvatar day={currentDay} size={110} />
            <div className="text-center">
              <div className={cn("text-xs font-bold uppercase tracking-wider", rank.color)}>
                {rank.icon} {rank.name}
              </div>
            </div>
          </div>

          {/* Stats + Rank progress */}
          <div className="flex-1 w-full">
            <div className="mb-1">
              <h1 className="text-2xl md:text-3xl font-display font-bold">The 30-Day Standout Foundation</h1>
              <p className="text-muted-foreground text-sm mt-1">Build baseline credibility. One day at a time.</p>
            </div>

            {/* XP Bar */}
            <div className="mt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className={cn("text-xs font-bold uppercase tracking-wider", rank.color)}>
                  {rank.name}
                </span>
                {nextRank && (
                  <span className="text-xs text-muted-foreground">
                    Next: <span className={cn("font-semibold", nextRank.color)}>{nextRank.name}</span>
                  </span>
                )}
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden relative">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    currentDay >= 22 ? "bg-gradient-to-r from-amber-500 to-amber-400" :
                    currentDay >= 15 ? "bg-gradient-to-r from-purple-600 to-purple-400" :
                    currentDay >= 8  ? "bg-gradient-to-r from-blue-600 to-blue-400" :
                    "bg-gradient-to-r from-slate-500 to-slate-400"
                  )}
                  style={{ width: `${rankProgress}%` }}
                />
                {/* XP shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-muted-foreground">Day {rank.minDay}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{rankProgress}% to next rank</span>
                <span className="text-[10px] text-muted-foreground">Day {rank.maxDay}</span>
              </div>
            </div>

            {/* Stat pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-background/60 border border-primary/20 rounded-xl p-3 text-center">
                <div className="text-2xl font-display font-bold text-primary">{currentDay}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Current Day</div>
              </div>
              <div className="bg-background/60 border border-orange-500/20 rounded-xl p-3 text-center">
                <div className="text-2xl font-display font-bold text-orange-400 flex items-center justify-center gap-1">
                  <Flame className="w-5 h-5" />{streakDays}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Day Streak</div>
              </div>
              <div className="bg-background/60 border border-green-500/20 rounded-xl p-3 text-center">
                <div className="text-2xl font-display font-bold text-green-400">{completedActions}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Completed</div>
              </div>
              <div className="bg-background/60 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-display font-bold">{Math.max(0, 28 - currentDay + 1)}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Days Left</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Today's Mission ── */}
      {todayItem && !completedSet.has(currentDay) && (
        <TodaysMission
          day={todayItem}
          onComplete={handleComplete}
          completing={completingId !== null}
        />
      )}
      {completedSet.has(currentDay) && (
        <div className="rounded-2xl border border-green-500/30 bg-green-500/5 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-7 h-7 text-green-400" />
          </div>
          <div>
            <h3 className="font-bold text-green-400">Day {currentDay} complete!</h3>
            <p className="text-sm text-muted-foreground">Excellent work. Come back tomorrow to keep your streak alive.</p>
          </div>
          {streakDays > 0 && (
            <div className="ml-auto text-right hidden md:block">
              <div className="text-2xl font-display font-bold text-orange-400 flex items-center gap-1">
                <Flame className="w-6 h-6" />{streakDays}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase">day streak</div>
            </div>
          )}
        </div>
      )}

      {/* ── Journey Map ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Your Path
          </h2>
          <span className="text-xs text-muted-foreground">{overallProgress}% complete</span>
        </div>
        <div className="bg-card border border-white/5 rounded-2xl p-4 overflow-hidden">
          <JourneyMap currentDay={currentDay} completedDays={completedSet} />
        </div>
      </div>

      {/* ── Week Selector ── */}
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Week Breakdown
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-6">
          {THIRTY_DAY_CURRICULUM.map(week => {
            const wc = WEEK_COLORS[week.color];
            const weekDone = currentDay > week.days[week.days.length - 1].day;
            const isCurrent = week.week === currentWeek;
            const isActive = week.week === activeWeek;

            return (
              <button
                key={week.week}
                onClick={() => setActiveWeek(week.week)}
                className={cn(
                  "flex-shrink-0 px-5 py-3 rounded-xl border text-sm font-medium transition-all text-left",
                  isActive
                    ? cn(wc.bg, wc.border, wc.text, "shadow-md")
                    : isCurrent
                    ? "bg-card border-white/20 text-foreground"
                    : weekDone
                    ? "bg-green-500/5 border-green-500/20 text-green-400"
                    : "bg-card border-white/5 text-muted-foreground hover:bg-white/5"
                )}
              >
                <div className="font-bold">Week {week.week}</div>
                <div className="text-[10px] opacity-70 mt-0.5">{week.theme}</div>
                {weekDone && <div className="text-[9px] text-green-400 mt-1">✓ Complete</div>}
                {isCurrent && !weekDone && <div className="text-[9px] text-primary mt-1">● In Progress</div>}
              </button>
            );
          })}
        </div>

        {/* Week detail */}
        {(() => {
          const wc = WEEK_COLORS[activeWeekData.color];
          return (
            <div>
              <div className={cn("flex items-center gap-3 px-5 py-4 rounded-xl border mb-4", wc.bg, wc.border)}>
                <div className={cn("text-lg font-display font-bold", wc.text)}>
                  Week {activeWeekData.week}: {activeWeekData.theme}
                </div>
                <span className="text-sm text-muted-foreground ml-auto">
                  Days {activeWeekData.days[0].day}–{activeWeekData.days[activeWeekData.days.length - 1].day}
                </span>
              </div>

              <div className="space-y-2">
                {activeWeekData.days.map((dayItem) => {
                  const isDone = completedSet.has(dayItem.day);
                  const isToday = dayItem.day === currentDay;
                  const isFuture = dayItem.day > currentDay;
                  const typeConfig = TYPE_CONFIG[dayItem.type] || TYPE_CONFIG.system;
                  const TypeIcon = typeConfig.icon;
                  const dbAction = dbActions.find(a => a.day === dayItem.day);

                  return (
                    <div
                      key={dayItem.day}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border transition-all",
                        isDone
                          ? "border-green-500/15 bg-green-500/5"
                          : isToday
                          ? "border-primary/40 shadow-lg shadow-primary/5 bg-primary/5"
                          : isFuture
                          ? "border-white/5 opacity-50"
                          : "border-white/10 hover:border-white/20 bg-card/50"
                      )}
                    >
                      {/* Day bubble */}
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 border",
                        isDone ? "bg-green-500/20 border-green-500/30 text-green-400" :
                        isToday ? "bg-primary/20 border-primary/40 text-primary" :
                        isFuture ? "bg-white/5 border-white/5 text-muted-foreground/30" :
                        "bg-white/5 border-white/10 text-muted-foreground"
                      )}>
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : isToday ? <Star className="w-5 h-5 fill-primary" /> : dayItem.day}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Badge variant="outline" className={cn("text-[9px] uppercase tracking-wider", typeConfig.color, "border-current/20 bg-current/5")}>
                            <TypeIcon className="w-2.5 h-2.5 mr-1" />
                            {typeConfig.label}
                          </Badge>
                          {isToday && (
                            <Badge variant="secondary" className="text-[9px] bg-primary/20 text-primary border-primary/30">
                              Today
                            </Badge>
                          )}
                        </div>
                        <p className={cn(
                          "font-semibold text-sm leading-snug",
                          isDone ? "line-through text-foreground/40" : isToday ? "text-foreground" : "text-foreground/80"
                        )}>
                          {dayItem.title}
                        </p>
                        {!isDone && !isFuture && (
                          <p className="text-xs text-muted-foreground mt-0.5">{dayItem.description}</p>
                        )}
                      </div>

                      {/* CTA */}
                      {!isFuture && !isDone && (
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <Link href={dayItem.href || "/"}>
                            <Button variant={isToday ? "premium" : "outline"} size="sm" className="text-xs gap-1">
                              Start <ChevronRight className="w-3 h-3" />
                            </Button>
                          </Link>
                          {(dbAction?.id || isToday) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-muted-foreground"
                              onClick={() => handleComplete({ ...dayItem, id: dbAction?.id })}
                              isLoading={completingId === (dbAction?.id || dayItem.day.toString())}
                            >
                              ✓
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Week milestone */}
              {currentDay > activeWeekData.days[activeWeekData.days.length - 1].day && (
                <div className={cn("mt-4 rounded-xl border p-4 flex items-center gap-4", wc.border, wc.bg)}>
                  <Trophy className={cn("w-6 h-6", wc.text)} />
                  <div>
                    <div className={cn("font-bold text-sm", wc.text)}>Milestone Reached: {activeWeekData.milestone}</div>
                    <div className="text-xs text-muted-foreground">Week {activeWeekData.week} complete — keep the momentum</div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* ── Rank Milestones ── */}
      <div>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Rank Progression
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {RANKS.map((r, i) => {
            const reached = currentDay >= r.minDay;
            const isCurrent = currentDay >= r.minDay && currentDay <= r.maxDay;
            return (
              <div
                key={r.name}
                className={cn(
                  "rounded-2xl border p-4 text-center transition-all",
                  isCurrent
                    ? cn("border-current/40 shadow-lg", r.color, "bg-current/5")
                    : reached
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-white/5 bg-card/30 opacity-40"
                )}
              >
                <div className="text-3xl mb-2">{r.icon}</div>
                <div className={cn("text-xs font-bold", isCurrent ? r.color : reached ? "text-green-400" : "text-muted-foreground")}>
                  {isCurrent ? "Current" : reached ? "Achieved ✓" : "Locked"}
                </div>
                <div className={cn("text-sm font-bold mt-1", isCurrent ? r.color : "text-foreground")}>
                  {r.name}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">Day {r.minDay}–{r.maxDay}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
