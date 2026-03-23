import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  assessmentResultsTable,
  userScenarioCompletionsTable,
  journeyActionsTable,
  userStatsTable,
  brandProfilesTable,
  conversationsTable,
} from "@workspace/db";
import { eq, count, avg } from "drizzle-orm";
import { requireAuth } from "./auth";

const router: IRouter = Router();

router.get("/", requireAuth, async (req: any, res) => {
  const userId = req.user.id;

  const [assessmentResults, scenarioCompletions, journeyActions, stats, brandProfile, coachSessions] = await Promise.all([
    db.select().from(assessmentResultsTable).where(eq(assessmentResultsTable.userId, userId)),
    db.select().from(userScenarioCompletionsTable).where(eq(userScenarioCompletionsTable.userId, userId)),
    db.select().from(journeyActionsTable).where(eq(journeyActionsTable.userId, userId)),
    db.select().from(userStatsTable).where(eq(userStatsTable.userId, userId)).then(r => r[0] || null),
    db.select().from(brandProfilesTable).where(eq(brandProfilesTable.userId, userId)).then(r => r[0] || null),
    db.select().from(conversationsTable).where(eq(conversationsTable.userId, userId)),
  ]);

  const avgAssessmentScore = assessmentResults.length > 0
    ? assessmentResults.reduce((sum, r) => sum + r.score, 0) / assessmentResults.length
    : 0;

  const avgScenarioScore = scenarioCompletions.length > 0
    ? scenarioCompletions.reduce((sum, c) => sum + c.score, 0) / scenarioCompletions.length
    : 0;

  const completedActions = journeyActions.filter(a => a.isCompleted);
  const userCreatedAt = req.user.createdAt ? new Date(req.user.createdAt) : new Date();
  const daysSinceJoined = Math.floor((Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24));
  const currentDay = Math.max(1, Math.min(daysSinceJoined + 1, 30));

  const recentActivity: any[] = [
    ...assessmentResults.slice(-3).map(r => ({
      type: "assessment",
      title: `Completed an assessment`,
      completedAt: r.completedAt.toISOString(),
    })),
    ...scenarioCompletions.slice(-3).map(c => ({
      type: "scenario",
      title: `Completed a scenario`,
      completedAt: c.completedAt.toISOString(),
    })),
    ...completedActions.slice(-3).map(a => ({
      type: "journey",
      title: a.title,
      completedAt: a.completedAt?.toISOString() || new Date().toISOString(),
    })),
  ].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()).slice(0, 5);

  const topPriorityAreas = assessmentResults.length === 0
    ? ["Complete your first assessment", "Explore the Scenarios library", "Set up your Brand Lab profile"]
    : ["Build Executive Communication habits", "Practice Difficult Feedback scenarios", "Strengthen Stakeholder Relationships"];

  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      tier: req.user.tier,
      onboardingCompleted: req.user.onboardingCompleted,
      createdAt: req.user.createdAt,
    },
    assessmentProgress: {
      completed: assessmentResults.length,
      total: 3,
      averageScore: Math.round(avgAssessmentScore),
    },
    scenariosProgress: {
      completed: scenarioCompletions.length,
      total: 12,
      averageScore: Math.round(avgScenarioScore),
    },
    journeyProgress: {
      currentDay,
      streakDays: stats?.streakDays || 0,
      completedActions: completedActions.length,
    },
    brandScore: brandProfile?.brandScore || 0,
    coachUsageCount: coachSessions.length,
    recentActivity,
    topPriorityAreas,
  });
});

export default router;
