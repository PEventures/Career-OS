import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { brandProfilesTable, reflectionResponsesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "./auth";

const router: IRouter = Router();

const BRAND_HABITS = [
  { id: "h1", title: "Weekly Team Pulse Check", description: "Ask at least one team member a meaningful question about their experience this week", streakDays: 0 },
  { id: "h2", title: "One Intentional Stakeholder Touch", description: "Proactively reach out to one stakeholder with a useful update or insight", streakDays: 0 },
  { id: "h3", title: "Deliver Feedback in 24 Hours", description: "Never let feedback opportunities go stale. Address them within one business day", streakDays: 0 },
  { id: "h4", title: "Executive Communication Practice", description: "Frame one update today using the BLUF method: Bottom Line Up Front", streakDays: 0 },
  { id: "h5", title: "End-of-Day Brand Audit", description: "Review your actions today. Were they consistent with the manager you intend to be?", streakDays: 0 },
  { id: "h6", title: "Meeting Presence Practice", description: "In your next meeting, make one comment that demonstrates strategic thinking", streakDays: 0 },
];

const REFLECTION_PROMPTS = [
  { id: "r1", text: "What do people most likely say about you when you are not in the room?", category: "Perception" },
  { id: "r2", text: "Where are you respected but not fully trusted yet?", category: "Trust" },
  { id: "r3", text: "Where are you liked but not taken seriously as a strategic thinker?", category: "Credibility" },
  { id: "r4", text: "What signals are you sending unintentionally through your behavior this week?", category: "Signals" },
  { id: "r5", text: "Who in your organization has significantly more influence than you — and what are they doing differently?", category: "Influence" },
  { id: "r6", text: "In what situations does your confidence drop — and how do others read that?", category: "Presence" },
  { id: "r7", text: "What is one behavior you know you should stop doing because it is hurting your brand?", category: "Behavior" },
  { id: "r8", text: "If you were promoted today, what would your biggest critics say is missing from your leadership?", category: "Growth" },
  { id: "r9", text: "When do you most compromise your values or standards — and what is the pressure that causes it?", category: "Integrity" },
  { id: "r10", text: "What would a senior leader who respects you say is your single greatest strength — and do you leverage it enough?", category: "Strengths" },
];

router.get("/", requireAuth, async (req: any, res) => {
  const [profile] = await db.select().from(brandProfilesTable).where(eq(brandProfilesTable.userId, req.user.id));

  if (!profile) {
    return res.json({
      desiredIdentity: [],
      currentPerceptions: [],
      brandScore: 0,
      gapAreas: [],
      strengths: [],
      habits: BRAND_HABITS.map(h => ({ ...h, isActive: false })),
      lastUpdated: null,
    });
  }

  const activeIds = profile.activeHabitIds as string[];
  res.json({
    desiredIdentity: profile.desiredIdentity,
    currentPerceptions: profile.currentPerceptions,
    brandScore: profile.brandScore,
    gapAreas: profile.gapAreas,
    strengths: profile.strengths,
    habits: BRAND_HABITS.map(h => ({ ...h, isActive: activeIds.includes(h.id) })),
    lastUpdated: profile.updatedAt?.toISOString() || null,
  });
});

router.put("/", requireAuth, async (req: any, res) => {
  const { desiredIdentity, currentPerceptions, habitIds } = req.body;

  const gapAreas = (desiredIdentity || []).filter((d: string) => !(currentPerceptions || []).includes(d));
  const strengths = (desiredIdentity || []).filter((d: string) => (currentPerceptions || []).includes(d));
  const brandScore = Math.min(100, (strengths.length / Math.max(1, (desiredIdentity || []).length)) * 100);

  const [existing] = await db.select().from(brandProfilesTable).where(eq(brandProfilesTable.userId, req.user.id));

  if (existing) {
    const [updated] = await db.update(brandProfilesTable).set({
      desiredIdentity: desiredIdentity || existing.desiredIdentity,
      currentPerceptions: currentPerceptions || existing.currentPerceptions,
      activeHabitIds: habitIds || existing.activeHabitIds,
      gapAreas,
      strengths,
      brandScore,
      updatedAt: new Date(),
    }).where(eq(brandProfilesTable.userId, req.user.id)).returning();

    const activeIds = updated.activeHabitIds as string[];
    return res.json({
      desiredIdentity: updated.desiredIdentity,
      currentPerceptions: updated.currentPerceptions,
      brandScore: updated.brandScore,
      gapAreas: updated.gapAreas,
      strengths: updated.strengths,
      habits: BRAND_HABITS.map(h => ({ ...h, isActive: activeIds.includes(h.id) })),
      lastUpdated: updated.updatedAt?.toISOString(),
    });
  } else {
    const [created] = await db.insert(brandProfilesTable).values({
      userId: req.user.id,
      desiredIdentity: desiredIdentity || [],
      currentPerceptions: currentPerceptions || [],
      activeHabitIds: habitIds || [],
      gapAreas,
      strengths,
      brandScore,
    }).returning();

    const activeIds = created.activeHabitIds as string[];
    return res.json({
      desiredIdentity: created.desiredIdentity,
      currentPerceptions: created.currentPerceptions,
      brandScore: created.brandScore,
      gapAreas: created.gapAreas,
      strengths: created.strengths,
      habits: BRAND_HABITS.map(h => ({ ...h, isActive: activeIds.includes(h.id) })),
      lastUpdated: created.updatedAt?.toISOString(),
    });
  }
});

router.get("/reflections", requireAuth, async (req: any, res) => {
  const responses = await db.select().from(reflectionResponsesTable).where(eq(reflectionResponsesTable.userId, req.user.id));
  const responseMap = new Map(responses.map(r => [r.promptId, r]));

  const response = REFLECTION_PROMPTS.map((p) => {
    const answer = responseMap.get(p.id);
    return {
      id: p.id,
      text: p.text,
      category: p.category,
      isAnswered: !!answer,
      answer: answer?.answer || null,
    };
  });

  res.json(response);
});

router.post("/reflections", requireAuth, async (req: any, res) => {
  const { promptId, answer } = req.body;
  if (!promptId || !answer) {
    return res.status(400).json({ error: "promptId and answer required" });
  }

  const prompt = REFLECTION_PROMPTS.find(p => p.id === promptId);
  if (!prompt) return res.status(404).json({ error: "Prompt not found" });

  await db.insert(reflectionResponsesTable).values({
    userId: req.user.id,
    promptId,
    answer,
  });

  res.json({ success: true, message: "Reflection saved" });
});

export default router;
