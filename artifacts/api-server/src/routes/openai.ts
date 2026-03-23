import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { conversationsTable, messagesTable, userStatsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "./auth";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

const COACH_SYSTEM_PROMPT = `You are a highly experienced workplace strategist and management coach. You have spent 20+ years inside complex corporate environments, working at the intersection of leadership, politics, and performance.

You are NOT a therapist. You are NOT an HR compliance bot. You are NOT a motivational speaker.

You are a sharp, practical operator who helps ambitious managers navigate real workplace situations with precision and political intelligence.

Your communication style:
- Direct, honest, and specific — never vague or diplomatic to the point of uselessness
- You call out patterns of weakness without being cruel
- You give real scripts and concrete language, not generic advice
- You are politically aware — you understand that every workplace has power dynamics
- You help people protect their reputation while solving problems

When giving advice, always structure your response as follows:

**What's actually happening here:**
[Diagnose the real situation, not just the surface problem]

**The hidden risk:**
[What most people miss — the political or reputational risk that could hurt them]

**What a standout manager would do:**
[Specific, actionable advice — not vague principles]

**What weak managers usually do wrong:**
[The common mistakes to avoid]

**Suggested script:**
[Exact language they can use — direct, professional, and smart]

**Brand impact:**
[How this situation and how they handle it affects their reputation]

**Next step:**
[One concrete action they should take in the next 24 hours]

Never pad your responses. Every word should earn its place.`;

const TONE_ADDITIONS: Record<string, string> = {
  diplomatic: "Adjust your tone to be diplomatic — find the most tactful framing while still being direct.",
  firm: "Adjust your tone to be firm and clear — no hedging, no softening. Be direct.",
  executive_ready: "Adjust your response to be executive-ready — precise, confident, strategic, and concise.",
  empathetic: "Adjust your tone to acknowledge the emotional dimension of the situation while still being practical.",
  politically_careful: "Adjust your response to be politically careful — help them navigate the power dynamics and stakeholder landscape with maximum care.",
};

router.get("/conversations", requireAuth, async (req: any, res) => {
  const conversations = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.userId, req.user.id));

  const convsWithCount = await Promise.all(
    conversations.map(async (c) => {
      const msgs = await db.select().from(messagesTable).where(eq(messagesTable.conversationId, c.id));
      return {
        id: c.id,
        title: c.title,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        messageCount: msgs.length,
      };
    })
  );

  res.json(convsWithCount.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
});

router.post("/conversations", requireAuth, async (req: any, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });

  const [conv] = await db.insert(conversationsTable).values({
    userId: req.user.id,
    title,
  }).returning();

  res.status(201).json({
    id: conv.id,
    title: conv.title,
    createdAt: conv.createdAt.toISOString(),
    updatedAt: conv.updatedAt.toISOString(),
    messageCount: 0,
  });
});

router.get("/conversations/:id", requireAuth, async (req: any, res) => {
  const [conv] = await db
    .select()
    .from(conversationsTable)
    .where(and(eq(conversationsTable.id, req.params.id), eq(conversationsTable.userId, req.user.id)));

  if (!conv) return res.status(404).json({ error: "Not found" });

  const msgs = await db.select().from(messagesTable).where(eq(messagesTable.conversationId, conv.id));

  res.json({
    id: conv.id,
    title: conv.title,
    createdAt: conv.createdAt.toISOString(),
    updatedAt: conv.updatedAt.toISOString(),
    messages: msgs.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
    })),
  });
});

router.post("/conversations/:id/messages", requireAuth, async (req: any, res) => {
  const [conv] = await db
    .select()
    .from(conversationsTable)
    .where(and(eq(conversationsTable.id, req.params.id), eq(conversationsTable.userId, req.user.id)));

  if (!conv) return res.status(404).json({ error: "Not found" });

  const { content, toneMode } = req.body;
  if (!content) return res.status(400).json({ error: "content required" });

  // Check free tier limit
  if (req.user.tier === "free") {
    const msgs = await db.select().from(messagesTable).where(eq(messagesTable.conversationId, conv.id));
    const userMessages = msgs.filter((m) => m.role === "user");
    if (userMessages.length >= 3) {
      return res.status(403).json({
        error: "Free tier limit reached",
        message: "Upgrade to Core or Premium to continue coaching conversations.",
      });
    }
  }

  // Save user message
  await db.insert(messagesTable).values({
    conversationId: conv.id,
    role: "user",
    content,
  });

  // Get history
  const history = await db.select().from(messagesTable).where(eq(messagesTable.conversationId, conv.id));
  const chatMessages = history.slice(-20).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const systemPrompt = toneMode && TONE_ADDITIONS[toneMode]
    ? COACH_SYSTEM_PROMPT + "\n\n" + TONE_ADDITIONS[toneMode]
    : COACH_SYSTEM_PROMPT;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  let fullResponse = "";

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: systemPrompt },
        ...chatMessages,
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Save assistant response
    await db.insert(messagesTable).values({
      conversationId: conv.id,
      role: "assistant",
      content: fullResponse,
    });

    // Update conversation updatedAt
    await db.update(conversationsTable).set({ updatedAt: new Date() }).where(eq(conversationsTable.id, conv.id));

    // Update coach usage stats
    const [stats] = await db.select().from(userStatsTable).where(eq(userStatsTable.userId, req.user.id));
    if (stats) {
      await db.update(userStatsTable).set({
        totalCoachSessions: (stats.totalCoachSessions || 0) + 1,
        updatedAt: new Date(),
      }).where(eq(userStatsTable.userId, req.user.id));
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ error: "Coach unavailable. Please try again." })}\n\n`);
  }

  res.end();
});

export default router;
