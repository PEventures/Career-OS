import React from "react";
import { useGetDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, Progress, Badge, Button } from "@/components/ui/shared";
import { Link } from "wouter";
import { Shield, Target, Flame, Activity, ArrowRight, PlayCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function Dashboard() {
  const { data, isLoading } = useGetDashboard();

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading workspace...</div>;
  if (!data) return null;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Welcome back, {data.user.name?.split(' ')[0] || 'Manager'}</h1>
        <p className="text-muted-foreground mt-2 text-lg">Here is your strategic overview for today.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-card to-card/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Brand Score</p>
              <p className="text-4xl font-display font-bold text-foreground">{data.brandScore}<span className="text-lg text-muted-foreground">/100</span></p>
            </div>
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="w-7 h-7" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Journey Day</p>
              <p className="text-4xl font-display font-bold text-foreground">{data.journeyProgress.currentDay}<span className="text-lg text-muted-foreground">/30</span></p>
            </div>
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Target className="w-7 h-7" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Current Streak</p>
              <p className="text-4xl font-display font-bold text-foreground">{data.journeyProgress.streakDays} <span className="text-lg text-muted-foreground">days</span></p>
            </div>
            <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Flame className="w-7 h-7" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-8">
          
          <Card className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="text-primary w-5 h-5" />
                Up Next on Your Journey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-background/50 rounded-xl p-5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Badge variant="premium" className="mb-2">Day {data.journeyProgress.currentDay} Action</Badge>
                  <h4 className="text-lg font-semibold">Complete "Difficult Feedback" Scenario</h4>
                  <p className="text-sm text-muted-foreground mt-1">Practice delivering harsh truths without losing team trust.</p>
                </div>
                <Link href="/scenarios">
                  <Button variant="premium">Start Scenario</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skill Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-foreground">Scenarios Navigated</span>
                  <span className="text-muted-foreground">{data.scenariosProgress.completed} / {data.scenariosProgress.total}</span>
                </div>
                <Progress value={(data.scenariosProgress.completed / Math.max(data.scenariosProgress.total, 1)) * 100} className="h-3" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-foreground">Assessments Completed</span>
                  <span className="text-muted-foreground">{data.assessmentProgress.completed} / {data.assessmentProgress.total}</span>
                </div>
                <Progress value={(data.assessmentProgress.completed / Math.max(data.assessmentProgress.total, 1)) * 100} className="h-3 bg-secondary [&>div]:bg-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 span) */}
        <div className="space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Priority Areas</CardTitle>
            </CardHeader>
            <CardContent>
              {data.topPriorityAreas.length > 0 ? (
                <ul className="space-y-3">
                  {data.topPriorityAreas.map((area, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
                      <span className="text-foreground/90">{area}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Complete assessments to identify your priority growth areas.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {data.recentActivity.map((activity, i) => (
                  <div key={i} className="flex gap-4 relative">
                    {i !== data.recentActivity.length - 1 && (
                      <div className="absolute left-2 top-6 bottom-[-20px] w-px bg-white/10" />
                    )}
                    <div className="w-4 h-4 rounded-full bg-secondary border-2 border-background z-10 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDate(activity.completedAt)} • {activity.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
