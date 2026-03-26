import React from "react";
import { Link } from "wouter";
import { Card, CardContent, Badge, Button } from "@/components/ui/shared";
import { getToken } from "@/lib/utils";
import {
  Users, TrendingUp, Compass, MessageSquare, Target, BarChart2,
  ArrowLeft, Activity, Zap, BookOpen, AlertTriangle, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

type Analytics = {
  totalUsers: number;
  activeUsers: number;
  onboardingCompletionRate: number;
  assessmentCompletionRate: number;
  scenarioUsage: number;
  aiCoachUsage: number;
  tierBreakdown: { free: number; core: number; premium: number };
  topScenarioCategories: { category: string; count: number }[];
  featureEngagement?: { feature: string; count: number; pct: number }[];
  recentSignups?: number;
  dailyActiveUsers?: number;
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "text-primary",
  bg = "bg-primary/10",
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  bg?: string;
}) {
  return (
    <Card className="border-white/10">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bg)}>
            <Icon className={cn("w-5 h-5", color)} />
          </div>
        </div>
        <div className="text-3xl font-display font-black mb-1">{value}</div>
        <div className="text-sm font-medium text-foreground mb-0.5">{label}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </CardContent>
    </Card>
  );
}

function PctBar({ value, color = "bg-primary" }: { value: number; color?: string }) {
  return (
    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
      <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = React.useState<Analytics | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/analytics", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.status === 403) { setError("Access denied. Admin only."); setLoading(false); return; }
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 text-primary animate-pulse mx-auto mb-3" />
          <p className="text-muted-foreground">Loading admin analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <AlertTriangle className="w-10 h-10 text-orange-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Issue</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/dashboard"><Button variant="outline" size="sm">← Back to App</Button></Link>
        </div>
      </div>
    );
  }

  const d = data!;
  const tierTotal = d.tierBreakdown.free + d.tierBreakdown.core + d.tierBreakdown.premium;
  const conversionRate = tierTotal > 0 ? Math.round(((d.tierBreakdown.core + d.tierBreakdown.premium) / tierTotal) * 100) : 0;

  const FEATURE_METRICS = [
    { feature: "Diagnostics", count: Math.round(d.totalUsers * d.assessmentCompletionRate), icon: Target, color: "text-blue-400", bar: "bg-blue-500", pct: Math.round(d.assessmentCompletionRate * 100) },
    { feature: "Scenario Simulator", count: d.scenarioUsage, icon: Compass, color: "text-orange-400", bar: "bg-orange-500", pct: d.totalUsers > 0 ? Math.min(100, Math.round((d.scenarioUsage / d.totalUsers) * 100)) : 0 },
    { feature: "AI Coach", count: d.aiCoachUsage, icon: MessageSquare, color: "text-primary", bar: "bg-primary", pct: d.totalUsers > 0 ? Math.min(100, Math.round((d.aiCoachUsage / d.totalUsers) * 100)) : 0 },
    { feature: "Onboarding", count: Math.round(d.totalUsers * d.onboardingCompletionRate), icon: Zap, color: "text-green-400", bar: "bg-green-500", pct: Math.round(d.onboardingCompletionRate * 100) },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/5 bg-card/50 sticky top-0 z-50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="text-muted-foreground hover:text-foreground transition-colors mr-1">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-background text-sm font-bold">S</div>
            <span className="font-display font-bold">Admin Dashboard</span>
            <Badge variant="secondary" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/20">Admin Only</Badge>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground hidden sm:block">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={fetchData} className="gap-1.5 text-xs">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ── Key Metrics ── */}
        <div>
          <h2 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Key Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total Users" value={d.totalUsers} sub="All time registrations" />
            <StatCard icon={Activity} label="Active (7d)" value={d.activeUsers} sub="Used app in last 7 days" color="text-green-400" bg="bg-green-500/10" />
            <StatCard icon={TrendingUp} label="Conversion Rate" value={`${conversionRate}%`} sub="Free → Paid upgrade" color="text-amber-400" bg="bg-amber-500/10" />
            <StatCard icon={BarChart2} label="Scenario Completions" value={d.scenarioUsage} sub="Total across all users" color="text-orange-400" bg="bg-orange-500/10" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ── Feature Engagement ── */}
          <Card className="border-white/10">
            <CardContent className="p-6">
              <h3 className="font-display font-bold mb-5 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary" /> Feature Engagement
              </h3>
              <div className="space-y-5">
                {FEATURE_METRICS.map(f => (
                  <div key={f.feature}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <f.icon className={cn("w-4 h-4", f.color)} />
                        <span className="text-sm font-medium">{f.feature}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold">{f.count}</span>
                        <span className="text-xs text-muted-foreground ml-1">users ({f.pct}%)</span>
                      </div>
                    </div>
                    <PctBar value={f.pct} color={f.bar} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ── Tier Breakdown ── */}
          <Card className="border-white/10">
            <CardContent className="p-6">
              <h3 className="font-display font-bold mb-5 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> User Tier Breakdown
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Free Tier", count: d.tierBreakdown.free, color: "text-slate-400", bar: "bg-slate-500", border: "border-slate-500/20" },
                  { label: "Core (Paid)", count: d.tierBreakdown.core, color: "text-blue-400", bar: "bg-blue-500", border: "border-blue-500/20" },
                  { label: "Premium", count: d.tierBreakdown.premium, color: "text-amber-400", bar: "bg-amber-500", border: "border-amber-500/20" },
                ].map(t => {
                  const pct = tierTotal > 0 ? Math.round((t.count / tierTotal) * 100) : 0;
                  return (
                    <div key={t.label} className={cn("rounded-xl border p-4", t.border, "bg-background/30")}>
                      <div className="flex justify-between mb-2">
                        <span className={cn("text-sm font-semibold", t.color)}>{t.label}</span>
                        <span className="font-bold">{t.count} <span className="text-xs text-muted-foreground font-normal">({pct}%)</span></span>
                      </div>
                      <PctBar value={pct} color={t.bar} />
                    </div>
                  );
                })}

                <div className="mt-4 pt-4 border-t border-white/5 text-center">
                  <p className="text-2xl font-display font-black text-primary">{conversionRate}%</p>
                  <p className="text-xs text-muted-foreground">Paid conversion rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Top Scenario Categories ── */}
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="font-display font-bold mb-5 flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" /> Most Used Scenarios (Top Drop-off / Engagement Signal)
            </h3>
            <div className="space-y-3">
              {(d.topScenarioCategories || []).map((item, idx) => {
                const maxCount = Math.max(...(d.topScenarioCategories || []).map(i => i.count));
                const pct = Math.round((item.count / maxCount) * 100);
                return (
                  <div key={item.category} className="flex items-center gap-4">
                    <span className="text-xs font-bold text-muted-foreground w-4">{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-muted-foreground">{item.count} completions</span>
                      </div>
                      <PctBar value={pct} color={idx === 0 ? "bg-primary" : idx === 1 ? "bg-blue-500" : "bg-white/20"} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Completion Funnel ── */}
        <Card className="border-white/10">
          <CardContent className="p-6">
            <h3 className="font-display font-bold mb-5 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> User Journey Funnel (Drop-off Analysis)
            </h3>
            <div className="space-y-3">
              {[
                { label: "Registered", count: d.totalUsers, pct: 100, bar: "bg-primary" },
                { label: "Completed Onboarding", count: Math.round(d.totalUsers * d.onboardingCompletionRate), pct: Math.round(d.onboardingCompletionRate * 100), bar: "bg-blue-500" },
                { label: "Completed Assessment", count: Math.round(d.totalUsers * d.assessmentCompletionRate), pct: Math.round(d.assessmentCompletionRate * 100), bar: "bg-purple-500" },
                { label: "Used Scenario Simulator", count: d.scenarioUsage, pct: d.totalUsers > 0 ? Math.min(100, Math.round((d.scenarioUsage / d.totalUsers) * 100)) : 0, bar: "bg-amber-500" },
                { label: "Used AI Coach", count: d.aiCoachUsage, pct: d.totalUsers > 0 ? Math.min(100, Math.round((d.aiCoachUsage / d.totalUsers) * 100)) : 0, bar: "bg-green-500" },
                { label: "Upgraded (Paid)", count: d.tierBreakdown.core + d.tierBreakdown.premium, pct: conversionRate, bar: "bg-orange-500" },
              ].map((step, idx) => (
                <div key={step.label} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{step.label}</span>
                      <span className="font-bold">{step.count} <span className="text-muted-foreground font-normal text-xs">({step.pct}%)</span></span>
                    </div>
                    <PctBar value={step.pct} color={step.bar} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
