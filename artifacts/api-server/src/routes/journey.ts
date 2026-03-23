import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { journeyActionsTable, journeyMilestonesTable, userStatsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "./auth";

const router: IRouter = Router();

const REFLECTION_PROMPTS = [
  "What is one situation this week where you held back from saying something you should have said?",
  "If your team described your management style in three words, what would those words be — and would you be satisfied with them?",
  "Where are you currently being liked but not respected?",
  "Who in your organization has influence you do not, and what specifically are they doing differently?",
  "What feedback have you been avoiding giving someone on your team?",
  "In your last difficult conversation, what did you do well — and what would a more seasoned manager have done differently?",
  "Where are you confusing effort with impact right now?",
  "What would your most politically savvy peer do differently in your current situation?",
];

router.get("/", requireAuth, async (req: any, res) => {
  const actions = await db.select().from(journeyActionsTable).where(eq(journeyActionsTable.userId, req.user.id));
  const milestones = await db.select().from(journeyMilestonesTable).where(eq(journeyMilestonesTable.userId, req.user.id));
  const [stats] = await db.select().from(userStatsTable).where(eq(userStatsTable.userId, req.user.id));

  const completedActions = actions.filter(a => a.isCompleted).length;
  const totalActions = actions.length;
  const maxDay = actions.reduce((max, a) => Math.max(max, a.day), 0);

  const userCreatedAt = req.user.createdAt ? new Date(req.user.createdAt) : new Date();
  const daysSinceJoined = Math.floor((Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24));
  const currentDay = Math.max(1, Math.min(daysSinceJoined + 1, 30));

  res.json({
    currentDay,
    totalDays: 30,
    currentPath: "30-Day Standout Manager Foundation",
    streakDays: stats?.streakDays || 0,
    completedActions,
    totalActions,
    milestones: milestones.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      isCompleted: m.isCompleted,
      completedAt: m.completedAt?.toISOString() || null,
      dayTarget: m.dayTarget,
    })),
    weeklyActions: actions.slice(0, 14).map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      type: a.type,
      isCompleted: a.isCompleted,
      completedAt: a.completedAt?.toISOString() || null,
      day: a.day,
    })),
    reflectionPrompts: REFLECTION_PROMPTS.slice(0, 4),
  });
});

router.post("/checkin", requireAuth, async (req: any, res) => {
  const { actionId, reflectionText } = req.body;
  if (!actionId) return res.status(400).json({ error: "actionId required" });

  const [action] = await db.select().from(journeyActionsTable).where(eq(journeyActionsTable.id, actionId));
  if (!action || action.userId !== req.user.id) {
    return res.status(404).json({ error: "Action not found" });
  }

  await db.update(journeyActionsTable).set({
    isCompleted: true,
    completedAt: new Date(),
    reflectionText: reflectionText || null,
  }).where(eq(journeyActionsTable.id, actionId));

  // Update streak
  const [stats] = await db.select().from(userStatsTable).where(eq(userStatsTable.userId, req.user.id));
  if (stats) {
    const lastCheckin = stats.lastCheckinDate;
    const today = new Date();
    const isConsecutive = lastCheckin && (today.getTime() - lastCheckin.getTime()) < 48 * 60 * 60 * 1000;
    await db.update(userStatsTable).set({
      streakDays: isConsecutive ? (stats.streakDays + 1) : 1,
      lastCheckinDate: today,
      updatedAt: today,
    }).where(eq(userStatsTable.userId, req.user.id));
  }

  res.json({ success: true, message: "Check-in recorded" });
});

export default router;
