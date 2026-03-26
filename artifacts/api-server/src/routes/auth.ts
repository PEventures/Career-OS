import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, sessionsTable, onboardingProfilesTable, userStatsTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";

const router: IRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

function generateToken(): string {
  return crypto.randomUUID() + "-" + crypto.randomUUID();
}

export async function getUserFromToken(token: string) {
  if (!token) return null;
  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(and(eq(sessionsTable.token, token), gt(sessionsTable.expiresAt, new Date())));
  if (!session) return null;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, session.userId));
  return user || null;
}

export function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.slice(7);
  getUserFromToken(token).then((user) => {
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    req.user = user;
    next();
  }).catch(next);
}

export function requireAdmin(req: any, res: any, next: any) {
  requireAuth(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  });
}

router.get("/me", requireAuth, async (req: any, res) => {
  const user = req.user;
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tier: user.tier,
    onboardingCompleted: user.onboardingCompleted,
    createdAt: user.createdAt,
  });
});

router.post("/register", async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Validation error", message: result.error.message });
  }
  const { email, password, name } = result.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
  if (existing.length > 0) {
    return res.status(400).json({ error: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(usersTable).values({
    email: email.toLowerCase(),
    passwordHash,
    name,
    role: "user",
    tier: "free",
    onboardingCompleted: false,
  }).returning();

  await db.insert(userStatsTable).values({ userId: user.id });

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await db.insert(sessionsTable).values({ userId: user.id, token, expiresAt });

  res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tier: user.tier,
      onboardingCompleted: user.onboardingCompleted,
      createdAt: user.createdAt,
    },
    token,
  });
});

router.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: "Validation error" });
  }
  const { email, password } = result.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await db.insert(sessionsTable).values({ userId: user.id, token, expiresAt });

  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tier: user.tier,
      onboardingCompleted: user.onboardingCompleted,
      createdAt: user.createdAt,
    },
    token,
  });
});

const PROMO_CODES: Record<string, string> = {
  "FREE26": "premium",
  "STANDOUT50": "premium",
};

router.post("/upgrade", requireAuth, async (req: any, res) => {
  const { code } = req.body;
  const upper = (code || "").trim().toUpperCase();
  const newTier = PROMO_CODES[upper];
  if (!newTier) {
    return res.status(400).json({ error: "Invalid promo code" });
  }
  if (req.user.tier === newTier || req.user.tier === "premium") {
    return res.json({ success: true, tier: req.user.tier, alreadyUpgraded: true });
  }
  await db.update(usersTable)
    .set({ tier: newTier, updatedAt: new Date() })
    .where(eq(usersTable.id, req.user.id));
  res.json({ success: true, tier: newTier });
});

router.post("/logout", requireAuth, async (req: any, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7);
  if (token) {
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
  }
  res.json({ success: true, message: "Logged out" });
});

export default router;
