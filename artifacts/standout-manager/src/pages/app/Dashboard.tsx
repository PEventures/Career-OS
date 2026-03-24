import React from "react";
import { useGetDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, Progress, Badge, Button } from "@/components/ui/shared";
import { Link } from "wouter";
import { Shield, Target, Flame, Activity, ArrowRight, PlayCircle, BookOpen, Compass, MessageSquare, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  { label: "Start a Diagnostic", href: "/assess", icon: Target, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Run a Scenario", href: "/scenarios", icon: Compass, color: "text-orange-400", bg: "bg-orange-500/10" },
  { label: "Read a Playbook", href: "/systems", icon: BookOpen, color: "text-green-400", bg: "bg-green-500/10" },
  { label: "Talk to Coach", href: "/coach", icon: MessageSquare, color: "text-primary", bg: "bg-primary/10" },
];

const ACTIVITY_ICONS: Record<string, typeof Target> = {
  assessment: Target,
  scenario: Compass,
  journey: Sparkles,
  coach: MessageSquare,
};

export default function Dashboard() {
  const { data, isLoading, error } = useGetDashboard();

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12 animate-pulse">
        <div className="h-8 bg-white/5 rounded w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-64 bg-white/5 rounded-2xl" />
          <div className="h-64 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-8 pb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">Welcome to Standout Manager</h1>
          <p className="text-muted-foreground mt-2">Start your journey to becoming the manager people trust and respect.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map(action => (
            <Link key={action.href} href={action.href}>
              <Card className="hover:border-white/20 transition-all cursor-pointer hover:shadow-lg group">
                <CardContent className="p-6 text-center">
                  <div className={cn("w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform", action.bg)}>
                    <action.icon className={cn("w-6 h-6", action.color)} />
                  </div>
                  <p className="text-sm font-medium">{action.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const d = data as any;
  const brandScore = d.brandScore || 0;
  const journeyProgress = d.journeyProgress || { currentDay: 1, streakDays: 0, completedActions: 0 };
  const assessmentProgress = d.assessmentProgress || { completed: 0, total: 3, averageScore: 0 };
  const scenariosProgress = d.scenariosProgress || { completed: 0, total: 12, averageScore: 0 };
  const recentActivity = d.recentActivity || [];
  const topPriorityAreas = d.topPriorityAreas || [];
  const firstName = d.user?.name?.split(" ")[0] || "Manager";
  const hasActivity = recentActivity.length > 0;
  const isNewUser = assessmentProgress.completed === 0 && scenariosProgress.completed === 0;

  const overallScore = assessmentProgress.completed > 0
    ? Math.round(assessmentProgress.averageScore)
    : null;

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Welcome back, {firstName}
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            {isNewUser ? "Your journey starts here. Let's build your foundation." : "Here is your strategic overview for today."}
          </p>
        </div>
        {overallScore !== null && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-white/10">
            <TrendingUp className="w-4 h-4 text-primary" />
            <div>
              <div className="text-xs text-muted-foreground">Avg Score</div>
              <div className="font-bold text-foreground">{overallScore}/100</div>
            </div>
          </div>
        )}
      </div>

      {/* New User CTA */}
      {isNewUser && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-card shadow-lg shadow-primary/5">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <Badge variant="premium" className="mb-3">Start Here</Badge>
                <h3 className="text-xl font-bold mb-2">Take Your First Diagnostic</h3>
                <p className="text-muted-foreground text-sm max-w-lg">
                  The 9–11 minute Management Readiness Assessment gives you an honest baseline score and shows exactly where to focus your energy first.
                </p>
              </div>
              <Link href="/assess">
                <Button variant="premium" size="lg" className="flex-shrink-0">
                  Start Assessment <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Brand Score</p>
              <p className="text-3xl font-display font-bold">{brandScore}<span className="text-sm text-muted-foreground">/100</span></p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Journey</p>
              <p className="text-3xl font-display font-bold">
                {journeyProgress.currentDay}<span className="text-sm text-muted-foreground">/30</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Streak</p>
              <p className="text-3xl font-display font-bold">
                {journeyProgress.streakDays}<span className="text-sm text-muted-foreground"> days</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wide">Scenarios</p>
              <p className="text-3xl font-display font-bold">
                {scenariosProgress.completed}<span className="text-sm text-muted-foreground">/{scenariosProgress.total}</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Up Next */}
          {!isNewUser && (
            <Card className="border-primary/20 shadow-lg shadow-primary/5">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <PlayCircle className="text-primary w-5 h-5" />
                  Up Next on Your Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-background/50 rounded-xl p-5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <Badge variant="premium" className="mb-2">Day {journeyProgress.currentDay} Action</Badge>
                    <h4 className="text-base font-semibold">Continue Building Your Foundation</h4>
                    <p className="text-sm text-muted-foreground mt-1">Complete today's scenario, playbook, or reflection to stay on track.</p>
                  </div>
                  <Link href="/journey">
                    <Button variant="premium" className="flex-shrink-0">View Journey</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Skill Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skill Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-foreground">Scenarios Navigated</span>
                  <span className="text-muted-foreground font-mono">{scenariosProgress.completed} / {scenariosProgress.total}</span>
                </div>
                <Progress value={(scenariosProgress.completed / Math.max(scenariosProgress.total, 1)) * 100} className="h-2.5" />
                {scenariosProgress.completed > 0 && (
                  <p className="text-xs text-muted-foreground mt-1.5">Avg score: {scenariosProgress.averageScore}/100</p>
                )}
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-foreground">Assessments Completed</span>
                  <span className="text-muted-foreground font-mono">{assessmentProgress.completed} / {assessmentProgress.total}</span>
                </div>
                <Progress value={(assessmentProgress.completed / Math.max(assessmentProgress.total, 1)) * 100} className="h-2.5 [&>div]:bg-blue-500" />
                {assessmentProgress.completed > 0 && (
                  <p className="text-xs text-muted-foreground mt-1.5">Avg score: {assessmentProgress.averageScore}/100</p>
                )}
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-foreground">Journey Progress</span>
                  <span className="text-muted-foreground font-mono">{journeyProgress.currentDay} / 30 days</span>
                </div>
                <Progress value={(journeyProgress.currentDay / 30) * 100} className="h-2.5 [&>div]:bg-orange-500" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map(action => (
                <Link key={action.href} href={action.href}>
                  <Card className="hover:border-white/20 transition-all cursor-pointer group hover:shadow-md">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform", action.bg)}>
                        <action.icon className={cn("w-4 h-4", action.color)} />
                      </div>
                      <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors">{action.label}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Priority Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Priority Focus Areas</CardTitle>
            </CardHeader>
            <CardContent>
              {topPriorityAreas.length > 0 ? (
                <ul className="space-y-3">
                  {topPriorityAreas.map((area: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                        i === 0 ? "bg-red-400" : i === 1 ? "bg-orange-400" : "bg-yellow-400"
                      )} />
                      <span className="text-foreground/90">{area}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Complete your first assessment to unlock your personalized priority areas.</p>
              )}
              {topPriorityAreas.length > 0 && (
                <Link href="/assess">
                  <Button variant="ghost" size="sm" className="w-full mt-4 text-muted-foreground">
                    Take Assessment →
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!hasActivity ? (
                <div className="text-center py-4 space-y-3">
                  <p className="text-sm text-muted-foreground">No activity yet. Complete your first module to see progress here.</p>
                  <Link href="/assess">
                    <Button variant="outline" size="sm" className="w-full">Get Started</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity: any, i: number) => {
                    const Icon = ACTIVITY_ICONS[activity.type] || Target;
                    return (
                      <div key={i} className="flex gap-3 relative">
                        {i !== recentActivity.length - 1 && (
                          <div className="absolute left-3.5 top-7 bottom-0 w-px bg-white/5" />
                        )}
                        <div className="w-7 h-7 rounded-full bg-secondary border border-white/5 z-10 flex-shrink-0 flex items-center justify-center mt-0.5">
                          <Icon className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{activity.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{formatDate(activity.completedAt)} · {activity.type}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
