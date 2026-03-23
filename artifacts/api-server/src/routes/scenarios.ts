import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { scenariosTable, userScenarioCompletionsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "./auth";

const router: IRouter = Router();

router.get("/", requireAuth, async (req: any, res) => {
  const { category, difficulty } = req.query;
  let scenarios = await db.select().from(scenariosTable);

  if (category) {
    scenarios = scenarios.filter(s => s.category.toLowerCase() === (category as string).toLowerCase());
  }
  if (difficulty) {
    scenarios = scenarios.filter(s => s.difficulty === difficulty);
  }

  const completions = await db.select().from(userScenarioCompletionsTable).where(eq(userScenarioCompletionsTable.userId, req.user.id));
  const completionMap = new Map(completions.map(c => [c.scenarioId, c]));

  const response = scenarios.map((s) => {
    const completion = completionMap.get(s.id);
    const isFreeTier = req.user.tier === "free";
    const isLocked = s.isPremium && isFreeTier;
    return {
      id: s.id,
      title: s.title,
      description: s.description,
      situation: isLocked ? s.situation.slice(0, 100) + "..." : s.situation,
      category: s.category,
      difficulty: s.difficulty,
      estimatedMinutes: s.estimatedMinutes,
      options: isLocked ? [] : s.options,
      tags: s.tags,
      isCompleted: !!completion,
      userScore: completion?.score || null,
      isPremium: s.isPremium,
    };
  });

  res.json(response);
});

router.get("/:id", requireAuth, async (req: any, res) => {
  const [scenario] = await db.select().from(scenariosTable).where(eq(scenariosTable.id, req.params.id));
  if (!scenario) return res.status(404).json({ error: "Not found" });

  const isFreeTier = req.user.tier === "free";
  const isLocked = scenario.isPremium && isFreeTier;
  if (isLocked) {
    return res.status(403).json({ error: "Premium content. Upgrade to access this scenario." });
  }

  const [completion] = await db.select().from(userScenarioCompletionsTable).where(
    and(eq(userScenarioCompletionsTable.scenarioId, scenario.id), eq(userScenarioCompletionsTable.userId, req.user.id))
  );

  res.json({
    ...scenario,
    isCompleted: !!completion,
    userScore: completion?.score || null,
  });
});

router.post("/:id/complete", requireAuth, async (req: any, res) => {
  const [scenario] = await db.select().from(scenariosTable).where(eq(scenariosTable.id, req.params.id));
  if (!scenario) return res.status(404).json({ error: "Not found" });

  const { selectedOptionId } = req.body;
  if (!selectedOptionId) return res.status(400).json({ error: "selectedOptionId required" });

  const selectedOption = (scenario.options as any[]).find((o: any) => o.id === selectedOptionId);
  if (!selectedOption) return res.status(400).json({ error: "Invalid option" });

  await db.insert(userScenarioCompletionsTable).values({
    userId: req.user.id,
    scenarioId: scenario.id,
    selectedOptionId,
    score: selectedOption.score,
  }).onConflictDoNothing();

  const feedbackByQuality: Record<string, string> = {
    strong: "Excellent judgment. You read the situation accurately and chose the response that protects your credibility while addressing the root issue. This is how standout managers operate.",
    acceptable: "Solid approach. This response manages the situation without major risk. There's room to sharpen your precision — a stronger response would address the political dynamics more explicitly.",
    weak: "This approach leaves you exposed. While the intent may be reasonable, the execution signals a lack of strategic awareness. Stakeholders will notice. Revisit the playbook and try again.",
    risky: "High risk. This response prioritizes short-term comfort over long-term credibility. Standout managers recognize that how you handle this moment defines how others will handle you in the future.",
  };

  const keyLessons: Record<string, string> = {
    strong: "The strongest managers lead with clarity and specificity, not vagueness or deference. People respect precision.",
    acceptable: "Good enough rarely builds a standout reputation. The gap between acceptable and excellent is narrower than you think — it lives in how you frame your response.",
    weak: "Weak responses often come from trying to avoid conflict. But unaddressed conflict compounds. Address it early, directly, and with empathy.",
    risky: "Brand damage rarely comes from one catastrophic moment. It comes from a pattern of responses that signal uncertainty, poor judgment, or political naivety.",
  };

  res.json({
    scenarioId: scenario.id,
    selectedOption,
    score: selectedOption.score,
    feedback: feedbackByQuality[selectedOption.quality] || feedbackByQuality.acceptable,
    keyLesson: keyLessons[selectedOption.quality] || keyLessons.acceptable,
    brandImpactSummary: selectedOption.brandImpact,
  });
});

export default router;
