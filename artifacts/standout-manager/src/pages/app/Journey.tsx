import React from "react";
import { Link } from "wouter";
import { useGetJourney } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, Badge, Button } from "@/components/ui/shared";
import {
  Sparkles, CheckCircle2, Flame, Target, MessageSquare, BookOpen,
  Compass, Lock, ChevronRight, PenLine, Star, Trophy, Zap, ArrowRight,
  Shield, Users, TrendingUp, Award, Circle
} from "lucide-react";
import { cn, getToken } from "@/lib/utils";

/* ─── Rank System ────────────────────────────────────────────────────────── */
const RANKS = [
  { name: "New Manager",          minDay: 0,  maxDay: 7,  icon: "🌱", color: "text-slate-400",  ring: "ring-slate-500/30",  glow: "#94a3b8" },
  { name: "Building Credibility", minDay: 8,  maxDay: 14, icon: "📈", color: "text-blue-400",   ring: "ring-blue-500/40",   glow: "#60a5fa" },
  { name: "Developing Leader",    minDay: 15, maxDay: 21, icon: "⚡", color: "text-purple-400", ring: "ring-purple-500/40", glow: "#c084fc" },
  { name: "Standout Manager",     minDay: 22, maxDay: 30, icon: "🏆", color: "text-amber-400",  ring: "ring-amber-500/40",  glow: "#f59e0b" },
];

function getRank(day: number) { return RANKS.find(r => day >= r.minDay && day <= r.maxDay) || RANKS[0]; }
function getNextRank(day: number) { const idx = RANKS.findIndex(r => day >= r.minDay && day <= r.maxDay); return RANKS[idx + 1] || null; }
function getRankProgress(day: number) { const r = getRank(day); return Math.min(100, Math.round(((day - r.minDay) / (r.maxDay - r.minDay)) * 100)); }

/* ─── Badge Tracks ───────────────────────────────────────────────────────── */
const BADGE_TRACKS = [
  {
    id: "communication",
    badge: "Communication Mastery",
    icon: MessageSquare,
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    glow: "shadow-blue-500/15",
    earnedColor: "from-blue-500/30 to-blue-600/10",
    description: "Master the conversations that define your reputation as a leader.",
    items: [
      { title: "Complete the Management Readiness Diagnostic", type: "assess", href: "/assess/management-readiness", desc: "Get your baseline — know where you stand before building." },
      { title: "Study: The 1:1 Operating System", type: "system", href: "/systems", desc: "Transform your 1:1s from status updates to strategic alignment." },
      { title: "Scenario: Your Boss Challenges Your Judgment Publicly", type: "scenario", href: "/scenarios", desc: "Build composure and executive presence under fire." },
      { title: "Coach: Draft a difficult message you've been avoiding", type: "coach", href: "/coach", desc: "Write it with precision, strategy, and care." },
    ],
  },
  {
    id: "conflict",
    badge: "Conflict Resolution",
    icon: Shield,
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    glow: "shadow-purple-500/15",
    earnedColor: "from-purple-500/30 to-purple-600/10",
    description: "Navigate difficult dynamics without burning bridges or backing down.",
    items: [
      { title: "Scenario: Stakeholder Conflict Escalation", type: "scenario", href: "/scenarios", desc: "Navigate competing priorities without losing allies." },
      { title: "Scenario: The Credit-Stealing Peer", type: "scenario", href: "/scenarios", desc: "Respond to intellectual theft without creating enemies." },
      { title: "Study: Influence Without Authority", type: "system", href: "/systems", desc: "Build leverage before you have the title to demand it." },
      { title: "Coach: Map your current political exposures", type: "coach", href: "/coach", desc: "Identify where you're vulnerable before it becomes a problem." },
    ],
  },
  {
    id: "performance",
    badge: "Performance Management",
    icon: TrendingUp,
    color: "text-amber-400",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    glow: "shadow-amber-500/15",
    earnedColor: "from-amber-500/30 to-amber-600/10",
    description: "Hold your team to a high standard while keeping them motivated and trusted.",
    items: [
      { title: "Scenario: The Underperforming Employee Everyone Likes", type: "scenario", href: "/scenarios", desc: "Manage performance without losing team trust." },
      { title: "Study: The Feedback Protocol", type: "system", href: "/systems", desc: "The exact framework for delivering hard feedback that lands." },
      { title: "Study: The Delegation System", type: "system", href: "/systems", desc: "Build a team that doesn't need you for every decision." },
      { title: "Coach: Write a performance conversation script", type: "coach", href: "/coach", desc: "Say the hard thing, the right way, at the right time." },
    ],
  },
  {
    id: "presence",
    badge: "Leadership Presence",
    icon: Award,
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/10",
    glow: "shadow-green-500/15",
    earnedColor: "from-green-500/30 to-green-600/10",
    description: "Shape how you're perceived — in the room and when you're not in it.",
    items: [
      { title: "Complete: Brand Equity Audit", type: "assess", href: "/assess", desc: "Measure the gap between intended and actual reputation." },
      { title: "Study: The Executive Presence System", type: "system", href: "/systems", desc: "What high performers do differently in meetings and emails." },
      { title: "Set Up Your Brand Lab Profile", type: "other", href: "/brand-lab", desc: "Define and intentionally build your professional identity." },
      { title: "Scenario: Managing Up in a Crisis", type: "scenario", href: "/scenarios", desc: "Keep your reputation intact when a project goes sideways." },
    ],
  },
];

const TYPE_CONFIG: Record<string, { icon: typeof Target; color: string; bg: string; label: string }> = {
  assess:   { icon: Target,        color: "text-blue-400",   bg: "bg-blue-500/10",   label: "Diagnostic"    },
  system:   { icon: BookOpen,      color: "text-green-400",  bg: "bg-green-500/10",  label: "Playbook"      },
  scenario: { icon: Compass,       color: "text-orange-400", bg: "bg-orange-500/10", label: "Scenario"      },
  coach:    { icon: MessageSquare, color: "text-primary",    bg: "bg-primary/10",    label: "Coach Session" },
  other:    { icon: Star,          color: "text-amber-400",  bg: "bg-amber-500/10",  label: "Activity"      },
};

/* ─── Faceless Avatar ─────────────────────────────────────────────────────── */
function FacelessAvatar({ day, size = 120 }: { day: number; size?: number }) {
  const rank = getRank(day);
  const progress = getRankProgress(day);
  const isStandout  = day >= 22;
  const isDeveloping = day >= 15;
  const isBuilding   = day >= 8;

  const glowColor = rank.glow;
  const headGrad   = isStandout ? ["#fbbf24","#f59e0b"] : isDeveloping ? ["#d8b4fe","#a855f7"] : isBuilding ? ["#93c5fd","#3b82f6"] : ["#cbd5e1","#94a3b8"];
  const bodyGrad   = isStandout ? ["#d97706","#92400e"] : isDeveloping ? ["#9333ea","#6b21a8"] : isBuilding ? ["#2563eb","#1e3a8a"] : ["#475569","#1e293b"];

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse-slow" style={{ background: glowColor }} />
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 drop-shadow-lg">
        {/* Progress ring */}
        <circle cx="50" cy="50" r="47" stroke="white" strokeOpacity="0.05" strokeWidth="2" fill="none" />
        <circle cx="50" cy="50" r="47" stroke={glowColor} strokeWidth="2.5" fill="none" strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 47}`}
          strokeDashoffset={`${2 * Math.PI * 47 * (1 - progress / 100)}`}
          transform="rotate(-90 50 50)" opacity="0.7"
        />
        {/* Body */}
        <ellipse cx="50" cy="82" rx="22" ry="14" fill={`url(#bodyGrad_${day})`} />
        {/* Neck */}
        <rect x="43" y="62" width="14" height="10" rx="5" fill={`url(#headGrad_${day})`} />
        {/* Head */}
        <circle cx="50" cy="46" r="18" fill={`url(#headGrad_${day})`} />
        {/* Eyes */}
        <circle cx="43" cy="45" r="2.5" fill="#0f172a" opacity="0.7" />
        <circle cx="57" cy="45" r="2.5" fill="#0f172a" opacity="0.7" />
        {/* Crown for standout */}
        {isStandout && <text x="43" y="36" fontSize="10" fill="#f59e0b" textAnchor="start">👑</text>}
        {/* Star for developing */}
        {isDeveloping && !isStandout && <text x="45" y="35" fontSize="9" fill="#c084fc">★</text>}
        {/* Dots for building */}
        {isBuilding && !isDeveloping && (
          <>
            <circle cx="50" cy="32" r="2" fill="#60a5fa" opacity="0.8" />
            <circle cx="44" cy="35" r="1.5" fill="#60a5fa" opacity="0.5" />
            <circle cx="56" cy="35" r="1.5" fill="#60a5fa" opacity="0.5" />
          </>
        )}
        <defs>
          <linearGradient id={`headGrad_${day}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={headGrad[0]} />
            <stop offset="100%" stopColor={headGrad[1]} />
          </linearGradient>
          <linearGradient id={`bodyGrad_${day}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={bodyGrad[0]} />
            <stop offset="100%" stopColor={bodyGrad[1]} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ─── Badge Track Card ───────────────────────────────────────────────────── */
function BadgeTrackCard({
  track,
  completedIds,
  onComplete,
  isLocked,
}: {
  track: typeof BADGE_TRACKS[0];
  completedIds: Set<string>;
  onComplete: (key: string) => void;
  isLocked: boolean;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const completedCount = track.items.filter(item => completedIds.has(`${track.id}:${item.title}`)).length;
  const totalCount = track.items.length;
  const isEarned = completedCount === totalCount;
  const pct = Math.round((completedCount / totalCount) * 100);

  return (
    <Card className={cn(
      "border transition-all duration-300 overflow-hidden",
      isEarned
        ? `border-current ${track.border} shadow-lg ${track.glow}`
        : isLocked
          ? "border-white/5 opacity-60"
          : "border-white/10 hover:border-white/20"
    )}>
      {isEarned && (
        <div className={cn("h-1 bg-gradient-to-r", track.earnedColor)} />
      )}
      <CardContent className="p-0">
        {/* Header */}
        <button
          className="w-full p-6 text-left flex items-start gap-4"
          onClick={() => setExpanded(e => !e)}
        >
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all",
            isEarned
              ? cn(track.bg, track.border, "shadow-md")
              : "bg-card border-white/10"
          )}>
            {isEarned ? (
              <Trophy className={cn("w-7 h-7", track.color)} />
            ) : isLocked ? (
              <Lock className="w-6 h-6 text-muted-foreground" />
            ) : (
              <track.icon className={cn("w-6 h-6", completedCount > 0 ? track.color : "text-muted-foreground")} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={cn("text-xs font-bold uppercase tracking-widest", track.color)}>
                Skill Badge
              </span>
              {isEarned && (
                <Badge variant="secondary" className={cn("text-[10px]", track.bg, track.color, track.border)}>
                  <Trophy className="w-2.5 h-2.5 mr-1" /> Earned
                </Badge>
              )}
              {isLocked && (
                <Badge variant="secondary" className="text-[10px] bg-white/5 text-muted-foreground">
                  <Lock className="w-2.5 h-2.5 mr-1" /> Locked
                </Badge>
              )}
            </div>
            <h3 className="font-display font-bold text-lg mb-1">{track.badge}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{track.description}</p>

            {/* Progress */}
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">{completedCount}/{totalCount} complete</span>
                {isEarned
                  ? <span className={cn("font-bold", track.color)}>Badge Earned!</span>
                  : <span className="text-muted-foreground">{pct}%</span>
                }
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-700", track.bg.replace("/10", "/60"))}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>

          <ChevronRight className={cn("w-5 h-5 text-muted-foreground flex-shrink-0 mt-1 transition-transform", expanded && "rotate-90")} />
        </button>

        {/* Expandable items */}
        {expanded && (
          <div className="px-6 pb-6 space-y-3 border-t border-white/5 pt-5">
            {track.items.map((item, idx) => {
              const key = `${track.id}:${item.title}`;
              const done = completedIds.has(key);
              const typeConf = TYPE_CONFIG[item.type] || TYPE_CONFIG.other;

              return (
                <div
                  key={idx}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border transition-all",
                    done
                      ? "bg-green-500/5 border-green-500/20"
                      : "bg-background/50 border-white/5 hover:border-white/15"
                  )}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", done ? "bg-green-500/20" : typeConf.bg)}>
                    {done
                      ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                      : <typeConf.icon className={cn("w-4 h-4", typeConf.color)} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider", done ? "text-green-400" : typeConf.color)}>
                        {typeConf.label}
                      </span>
                    </div>
                    <p className={cn("text-sm font-medium mb-0.5", done && "line-through opacity-60")}>{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {!done && !isLocked && (
                      <Link href={item.href}>
                        <Button variant="outline" size="sm" className="text-xs h-7 px-3">
                          Go <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    )}
                    {!done && !isLocked && (
                      <button
                        onClick={() => onComplete(key)}
                        className="text-[10px] text-muted-foreground hover:text-green-400 transition-colors"
                      >
                        Mark done ✓
                      </button>
                    )}
                    {done && (
                      <button onClick={() => onComplete(key)} className="text-[10px] text-muted-foreground hover:text-foreground">
                        Undo
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function Journey() {
  const { data: journey, isLoading } = useGetJourney();
  const queryClient = useQueryClient();
  const [completedIds, setCompletedIds] = React.useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("journey_completed") || "[]")); } catch { return new Set(); }
  });

  const toggleComplete = (key: string) => {
    setCompletedIds(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      localStorage.setItem("journey_completed", JSON.stringify([...next]));
      return next;
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading your journey...</div>;
  }

  const data = journey as any;
  const currentDay = data?.currentDay || 1;
  const streakDays = data?.streakDays || 0;
  const rank = getRank(currentDay);
  const nextRank = getNextRank(currentDay);
  const rankProgress = getRankProgress(currentDay);

  // Total badge progress
  const totalBadgeItems = BADGE_TRACKS.reduce((sum, t) => sum + t.items.length, 0);
  const totalBadgeCompleted = BADGE_TRACKS.reduce((sum, t) =>
    sum + t.items.filter(item => completedIds.has(`${t.id}:${item.title}`)).length, 0);
  const badgesEarned = BADGE_TRACKS.filter(t =>
    t.items.every(item => completedIds.has(`${t.id}:${item.title}`))).length;

  return (
    <div className="space-y-10 pb-16 animate-fade-in">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-card via-card to-primary/5 p-8 md:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none blur-2xl" />
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <FacelessAvatar day={currentDay} size={130} />
          </div>

          {/* Rank info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-2xl">{rank.icon}</span>
              <span className={cn("text-xl font-display font-bold", rank.color)}>{rank.name}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-bold mb-1">
              Your Standout Journey
            </h1>
            <p className="text-muted-foreground text-sm mb-5">
              Day {currentDay} of 30 · {badgesEarned}/{BADGE_TRACKS.length} badges earned
            </p>

            {/* XP Bar */}
            <div className="max-w-sm mx-auto md:mx-0">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-muted-foreground">{rank.name}</span>
                {nextRank && <span className="text-muted-foreground">{nextRank.name} →</span>}
              </div>
              <div className="h-2.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-amber-500 transition-all duration-700 relative overflow-hidden animate-shimmer"
                  style={{ width: `${rankProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{rankProgress}% to {nextRank?.name || "max rank"}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 flex-shrink-0">
            {[
              { label: "Day", value: currentDay, icon: "📅" },
              { label: "Streak", value: `${streakDays}d`, icon: "🔥" },
              { label: "Completed", value: totalBadgeCompleted, icon: "✅" },
              { label: "Badges", value: `${badgesEarned}/4`, icon: "🏆" },
            ].map(s => (
              <div key={s.label} className="bg-background/50 border border-white/5 rounded-xl p-3 text-center min-w-[80px]">
                <div className="text-base">{s.icon}</div>
                <div className="text-xl font-display font-black">{s.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Badge Tracks ── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-display font-bold flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              Skill Badge Tracks
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Complete all items in a track to earn the badge. Progress at your own pace.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{badgesEarned}</span> / {BADGE_TRACKS.length} earned
          </div>
        </div>

        <div className="space-y-4">
          {BADGE_TRACKS.map((track, idx) => (
            <BadgeTrackCard
              key={track.id}
              track={track}
              completedIds={completedIds}
              onComplete={toggleComplete}
              isLocked={false}
            />
          ))}
        </div>
      </div>

      {/* ── Rank Progression ── */}
      <div>
        <h2 className="text-xl font-display font-bold mb-5 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" /> Rank Progression
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {RANKS.map((r, i) => {
            const isActive = rank.name === r.name;
            const isAchieved = currentDay > r.maxDay;
            return (
              <div
                key={r.name}
                className={cn(
                  "rounded-2xl border p-4 text-center transition-all",
                  isActive
                    ? `border-current ${r.ring.replace("ring-", "border-")} bg-gradient-to-b from-white/5 to-transparent shadow-lg`
                    : isAchieved
                      ? "border-green-500/20 bg-green-500/5"
                      : "border-white/5 opacity-50"
                )}
              >
                <div className="text-2xl mb-2">{r.icon}</div>
                <div className={cn("text-xs font-bold mb-1", isActive ? r.color : isAchieved ? "text-green-400" : "text-muted-foreground")}>
                  {isActive ? "Current" : isAchieved ? "Achieved ✓" : `Day ${r.minDay}+`}
                </div>
                <div className="text-sm font-semibold">{r.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Reflection Prompts ── */}
      {data?.reflectionPrompts && data.reflectionPrompts.length > 0 && (
        <div>
          <h2 className="text-xl font-display font-bold mb-5 flex items-center gap-2">
            <PenLine className="w-5 h-5 text-primary" /> Weekly Reflection Prompts
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {data.reflectionPrompts.slice(0, 4).map((prompt: string, idx: number) => (
              <div key={idx} className="bg-card border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">"{prompt}"</p>
                </div>
                <Link href="/coach">
                  <Button variant="ghost" size="sm" className="mt-3 text-xs text-muted-foreground hover:text-foreground">
                    Explore with AI Coach <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
