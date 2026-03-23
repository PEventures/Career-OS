import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { systemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "./auth";

const router: IRouter = Router();

router.get("/", requireAuth, async (req: any, res) => {
  const { category } = req.query;
  let systems = await db.select().from(systemsTable);

  if (category) {
    systems = systems.filter(s => s.category.toLowerCase() === (category as string).toLowerCase());
  }

  const isFreeTier = req.user.tier === "free";
  const response = systems.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    category: s.category,
    estimatedMinutes: s.estimatedMinutes,
    steps: s.isPremium && isFreeTier ? (s.steps as any[]).slice(0, 2) : s.steps,
    keyPrinciples: s.isPremium && isFreeTier ? (s.keyPrinciples as any[]).slice(0, 2) : s.keyPrinciples,
    scripts: s.isPremium && isFreeTier ? [] : s.scripts,
    isPremium: s.isPremium,
  }));

  res.json(response);
});

router.get("/:id", requireAuth, async (req: any, res) => {
  const [system] = await db.select().from(systemsTable).where(eq(systemsTable.id, req.params.id));
  if (!system) return res.status(404).json({ error: "Not found" });

  res.json(system);
});

export default router;
