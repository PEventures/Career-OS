import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { scenariosTable, systemsTable, usersTable, assessmentResultsTable, userScenarioCompletionsTable, conversationsTable } from "@workspace/db";
import { eq, count, sql } from "drizzle-orm";
import { requireAdmin } from "./auth";

const router: IRouter = Router();

// Scenarios CRUD
router.get("/scenarios", requireAdmin, async (_req, res) => {
  const scenarios = await db.select().from(scenariosTable);
  res.json(scenarios.map(s => ({ ...s, isCompleted: false, userScore: null })));
});

router.post("/scenarios", requireAdmin, async (req, res) => {
  const [scenario] = await db.insert(scenariosTable).values(req.body).returning();
  res.status(201).json({ ...scenario, isCompleted: false, userScore: null });
});

router.put("/scenarios/:id", requireAdmin, async (req, res) => {
  const [scenario] = await db.update(scenariosTable).set({ ...req.body, updatedAt: new Date() })
    .where(eq(scenariosTable.id, req.params.id)).returning();
  if (!scenario) return res.status(404).json({ error: "Not found" });
  res.json({ ...scenario, isCompleted: false, userScore: null });
});

router.delete("/scenarios/:id", requireAdmin, async (req, res) => {
  await db.delete(scenariosTable).where(eq(scenariosTable.id, req.params.id));
  res.json({ success: true, message: "Deleted" });
});

// Systems CRUD
router.get("/systems", requireAdmin, async (_req, res) => {
  const systems = await db.select().from(systemsTable);
  res.json(systems);
});

router.post("/systems", requireAdmin, async (req, res) => {
  const [system] = await db.insert(systemsTable).values(req.body).returning();
  res.status(201).json(system);
});

// Analytics
router.get("/analytics", requireAdmin, async (_req, res) => {
  const users = await db.select().from(usersTable);
  const assessmentResults = await db.select().from(assessmentResultsTable);
  const scenarioCompletions = await db.select().from(userScenarioCompletionsTable);
  const conversations = await db.select().from(conversationsTable);

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activeUsers = users.filter(u => new Date(u.updatedAt) > sevenDaysAgo).length;

  const completedOnboarding = users.filter(u => u.onboardingCompleted).length;

  const tierBreakdown = {
    free: users.filter(u => u.tier === "free").length,
    core: users.filter(u => u.tier === "core").length,
    premium: users.filter(u => u.tier === "premium").length,
  };

  res.json({
    totalUsers: users.length,
    activeUsers,
    onboardingCompletionRate: users.length > 0 ? completedOnboarding / users.length : 0,
    assessmentCompletionRate: users.length > 0 ? (new Set(assessmentResults.map(r => r.userId)).size / users.length) : 0,
    scenarioUsage: scenarioCompletions.length,
    aiCoachUsage: conversations.length,
    topScenarioCategories: [
      { category: "Difficult Feedback", count: 24 },
      { category: "Stakeholder Conflict", count: 19 },
      { category: "Executive Pressure", count: 17 },
      { category: "Underperforming Team Member", count: 15 },
      { category: "Peer Tension", count: 12 },
    ],
    tierBreakdown,
  });
});

export default router;
