import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { onboardingProfilesTable, usersTable, journeyActionsTable, journeyMilestonesTable, brandProfilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "./auth";

const router: IRouter = Router();

const onboardingSchema = z.object({
  roleType: z.enum(["first_time_manager", "individual_contributor"]),
  yearsExperience: z.string(),
  teamSize: z.string(),
  industry: z.string(),
  biggestChallenge: z.string(),
  confidenceLevel: z.number().int().min(1).max(10),
  fearAreas: z.array(z.string()),
  desiredReputation: z.array(z.string()),
});

router.post("/", requireAuth, async (req: any, res) => {
  const result = onboardingSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Validation error", message: result.error.message });
  }

  const userId = req.user.id;
  const data = result.data;

  await db.insert(onboardingProfilesTable).values({
    userId,
    ...data,
    fearAreas: data.fearAreas,
    desiredReputation: data.desiredReputation,
  }).onConflictDoNothing();

  await db.update(usersTable).set({ onboardingCompleted: true, updatedAt: new Date() }).where(eq(usersTable.id, userId));

  // Create initial brand profile
  const existing = await db.select().from(brandProfilesTable).where(eq(brandProfilesTable.userId, userId));
  if (existing.length === 0) {
    await db.insert(brandProfilesTable).values({
      userId,
      desiredIdentity: data.desiredReputation,
      currentPerceptions: [],
      gapAreas: [],
      strengths: [],
      activeHabitIds: [],
      brandScore: 0,
    });
  }

  // Create personalized journey milestones
  const milestones = [
    { title: "Build Your Foundation", description: "Complete your first assessment and understand your baseline", dayTarget: 7 },
    { title: "Strengthen Your Presence", description: "Navigate 3 real-world scenarios and study 2 management systems", dayTarget: 14 },
    { title: "Handle Conflict Better", description: "Learn conflict de-escalation and practice difficult conversations", dayTarget: 21 },
    { title: "Improve Executive Communication", description: "Master upward management and meeting presence", dayTarget: 28 },
    { title: "Become Trusted by Your Team", description: "Build team trust habits and strengthen your workplace brand", dayTarget: 30 },
  ];

  const existingMilestones = await db.select().from(journeyMilestonesTable).where(eq(journeyMilestonesTable.userId, userId));
  if (existingMilestones.length === 0) {
    await db.insert(journeyMilestonesTable).values(
      milestones.map((m) => ({ ...m, userId }))
    );
  }

  // Create first week of journey actions
  const actions = [
    { title: "Complete the Management Readiness Assessment", description: "Understand where you stand today", type: "assessment", day: 1 },
    { title: "Read: The 1:1 Meeting System", description: "Master the most powerful tool in your management toolkit", type: "system", day: 2 },
    { title: "Navigate: The Underperforming Team Member", description: "Practice handling your first difficult performance conversation", type: "scenario", day: 3 },
    { title: "Reflect: What do people currently say about you?", description: "Honest self-assessment of your current reputation", type: "reflection", day: 4 },
    { title: "Start your Brand Lab profile", description: "Define the manager you intend to become", type: "habit", day: 5 },
    { title: "Navigate: Your Boss Challenges You Publicly", description: "Practice handling executive scrutiny with grace", type: "scenario", day: 6 },
    { title: "Weekly Reflection", description: "What have you learned this week? Where did you struggle?", type: "reflection", day: 7 },
  ];

  const existingActions = await db.select().from(journeyActionsTable).where(eq(journeyActionsTable.userId, userId));
  if (existingActions.length === 0) {
    await db.insert(journeyActionsTable).values(
      actions.map((a) => ({ ...a, userId }))
    );
  }

  res.json({ success: true, message: "Onboarding complete" });
});

export default router;
