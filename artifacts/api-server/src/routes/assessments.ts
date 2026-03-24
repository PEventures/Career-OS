import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { assessmentsTable, assessmentResultsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "./auth";

const router: IRouter = Router();

router.get("/", requireAuth, async (req: any, res) => {
  const assessments = await db.select().from(assessmentsTable);
  const userResults = await db.select().from(assessmentResultsTable).where(eq(assessmentResultsTable.userId, req.user.id));

  const resultMap = new Map(userResults.map(r => [r.assessmentId, r]));

  const response = assessments.map((a) => {
    const result = resultMap.get(a.id);
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      category: a.category,
      estimatedMinutes: a.estimatedMinutes,
      questions: a.questions,
      isCompleted: !!result,
      completedAt: result?.completedAt?.toISOString() || null,
      score: result?.score || null,
    };
  });

  res.json(response);
});

router.get("/results", requireAuth, async (req: any, res) => {
  const results = await db.select().from(assessmentResultsTable).where(eq(assessmentResultsTable.userId, req.user.id));
  const assessments = await db.select().from(assessmentsTable);
  const assessmentMap = new Map(assessments.map(a => [a.id, a]));

  const response = results.map((r) => {
    const assessment = assessmentMap.get(r.assessmentId);
    return {
      id: r.id,
      assessmentId: r.assessmentId,
      assessmentTitle: assessment?.title || "Unknown",
      score: r.score,
      scoreLabel: getScoreLabel(r.score),
      completedAt: r.completedAt.toISOString(),
      strengths: r.strengths,
      blindSpots: r.blindSpots,
      recommendations: r.recommendations,
      breakdown: r.breakdown,
    };
  });

  res.json(response);
});

router.get("/:id", requireAuth, async (req: any, res) => {
  const [assessment] = await db.select().from(assessmentsTable).where(eq(assessmentsTable.id, req.params.id));
  if (!assessment) return res.status(404).json({ error: "Not found" });

  const [result] = await db.select().from(assessmentResultsTable).where(
    and(eq(assessmentResultsTable.assessmentId, assessment.id), eq(assessmentResultsTable.userId, req.user.id))
  );

  res.json({
    ...assessment,
    isCompleted: !!result,
    completedAt: result?.completedAt?.toISOString() || null,
    score: result?.score || null,
  });
});

router.post("/management-readiness/submit", requireAuth, async (req: any, res) => {
  const { answers, dimensionResults } = req.body;
  if (!dimensionResults || !Array.isArray(dimensionResults)) {
    return res.status(400).json({ error: "dimensionResults required" });
  }

  const ASSESSMENT_ID = "management-readiness-v1";

  // Ensure the assessment row exists
  const [existing] = await db.select().from(assessmentsTable).where(eq(assessmentsTable.id, ASSESSMENT_ID));
  if (!existing) {
    await db.insert(assessmentsTable).values({
      id: ASSESSMENT_ID,
      title: "Management Readiness Diagnostic",
      description: "An 8-dimension gap assessment for new and aspiring managers.",
      category: "management_readiness",
      estimatedMinutes: 10,
      questions: [],
    }).onConflictDoNothing();
  }

  const breakdown = dimensionResults.map((d: any) => ({
    category: d.label,
    score: d.avgWeight * 25,
    label: d.level,
  }));

  const gapDimensions = dimensionResults
    .filter((d: any) => d.level === "early" || d.level === "developing")
    .map((d: any) => d.label);

  const strengthDimensions = dimensionResults
    .filter((d: any) => d.level === "strong" || d.level === "capable")
    .map((d: any) => d.label);

  // Delete any previous result for this user+assessment, then insert fresh
  await db.delete(assessmentResultsTable).where(
    and(
      eq(assessmentResultsTable.userId, req.user.id),
      eq(assessmentResultsTable.assessmentId, ASSESSMENT_ID)
    )
  );

  await db.insert(assessmentResultsTable).values({
    userId: req.user.id,
    assessmentId: ASSESSMENT_ID,
    answers: answers || [],
    score: 0,
    strengths: strengthDimensions,
    blindSpots: gapDimensions,
    recommendations: [],
    breakdown,
  });

  res.json({ success: true, gaps: gapDimensions, strengths: strengthDimensions });
});

router.post("/:id/submit", requireAuth, async (req: any, res) => {
  const [assessment] = await db.select().from(assessmentsTable).where(eq(assessmentsTable.id, req.params.id));
  if (!assessment) return res.status(404).json({ error: "Not found" });

  const { answers } = req.body;
  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: "answers required" });
  }

  // Calculate score
  let totalValue = 0;
  let totalPossible = 0;
  const answerMap = new Map(answers.map((a: any) => [a.questionId, a]));

  for (const question of assessment.questions) {
    const answer = answerMap.get(question.id);
    if (!answer) continue;
    const maxOption = Math.max(...question.options.map((o: any) => o.value));
    totalPossible += maxOption;
    if (answer.selectedOptionId) {
      const selectedOption = question.options.find((o: any) => o.id === answer.selectedOptionId);
      if (selectedOption) totalValue += selectedOption.value;
    } else if (answer.value !== undefined) {
      totalValue += answer.value;
    }
  }

  const score = totalPossible > 0 ? (totalValue / totalPossible) * 100 : 0;

  // Generate results based on score
  const { strengths, blindSpots, recommendations, breakdown } = generateResults(assessment.category, score, answers, assessment.questions);

  const [result] = await db.insert(assessmentResultsTable).values({
    userId: req.user.id,
    assessmentId: assessment.id,
    answers,
    score,
    strengths,
    blindSpots,
    recommendations,
    breakdown,
  }).returning();

  res.json({
    id: result.id,
    assessmentId: result.assessmentId,
    assessmentTitle: assessment.title,
    score: result.score,
    scoreLabel: getScoreLabel(score),
    completedAt: result.completedAt.toISOString(),
    strengths: result.strengths,
    blindSpots: result.blindSpots,
    recommendations: result.recommendations,
    breakdown: result.breakdown,
  });
});

function getScoreLabel(score: number): string {
  if (score >= 80) return "High Performer";
  if (score >= 60) return "Developing Strength";
  if (score >= 40) return "Growth Area";
  return "Foundational Work Needed";
}

function generateResults(category: string, score: number, answers: any[], questions: any[]) {
  const allStrengths: Record<string, string[]> = {
    management_readiness: [
      "You demonstrate strong self-awareness about your management gaps",
      "You understand the importance of intentional communication",
      "You recognize the value of structured feedback conversations",
    ],
    brand_equity: [
      "You understand how reputation is built through consistent behavior",
      "You are aware of the gap between intent and perception",
      "You recognize the importance of managing upward relationships",
    ],
    self_awareness: [
      "You have a realistic view of your current competence level",
      "You recognize how your behavior affects team dynamics",
      "You understand your emotional triggers in high-pressure situations",
    ],
  };

  const allBlindSpots: Record<string, string[]> = {
    management_readiness: [
      "Avoiding difficult conversations under the belief they will resolve themselves",
      "Confusing being liked with being respected",
      "Failing to create structure that gives your team clarity and accountability",
    ],
    brand_equity: [
      "Underestimating how much perception diverges from intention",
      "Not managing upward visibility strategically",
      "Allowing strong technical work to substitute for executive presence",
    ],
    self_awareness: [
      "Blind spots around how stress affects your judgment and communication",
      "Overestimating your current influence with stakeholders",
      "Underestimating the political dynamics at play in your environment",
    ],
  };

  const allRecommendations: Record<string, string[]> = {
    management_readiness: [
      "Complete the 1:1 Meeting System playbook this week and implement it immediately",
      "Practice the Feedback Conversation framework in your next performance discussion",
      "Use the AI Coach to rehearse a difficult conversation you have been avoiding",
    ],
    brand_equity: [
      "Define your desired workplace identity in the Brand Lab today",
      "Audit the last 3 weeks of your behavior against your desired brand",
      "Identify one stakeholder relationship that needs intentional investment",
    ],
    self_awareness: [
      "Complete 3 scenario simulations focused on your identified fear areas",
      "Start the 30-day journey to build reflection habits",
      "Use the coach to get honest feedback on your default communication patterns",
    ],
  };

  const key = category.toLowerCase().replace(/[^a-z_]/g, "_");

  const strengths = score >= 60
    ? allStrengths[key]?.slice(0, 2) || allStrengths.management_readiness.slice(0, 2)
    : allStrengths[key]?.slice(0, 1) || [];

  const blindSpots = score < 80
    ? allBlindSpots[key]?.slice(0, score < 50 ? 3 : 2) || allBlindSpots.management_readiness.slice(0, 2)
    : allBlindSpots[key]?.slice(0, 1) || [];

  const recommendations = allRecommendations[key]?.slice(0, 3) || allRecommendations.management_readiness.slice(0, 3);

  const breakdown = [
    { category: "Self-Awareness", score: score * 0.9 + Math.random() * 10, label: getScoreLabel(score * 0.9) },
    { category: "Communication", score: score * 0.85 + Math.random() * 15, label: getScoreLabel(score * 0.85) },
    { category: "Political Intelligence", score: score * 0.7 + Math.random() * 20, label: getScoreLabel(score * 0.7) },
    { category: "Brand Awareness", score: score * 0.95 + Math.random() * 5, label: getScoreLabel(score * 0.95) },
  ].map(b => ({ ...b, score: Math.min(100, Math.max(0, b.score)) }));

  return { strengths, blindSpots, recommendations, breakdown };
}

export default router;
