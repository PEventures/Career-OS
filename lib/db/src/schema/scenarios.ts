import { pgTable, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const scenariosTable = pgTable("scenarios", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  situation: text("situation").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull().default("intermediate"),
  estimatedMinutes: integer("estimated_minutes").notNull().default(10),
  options: jsonb("options").$type<Array<{
    id: string;
    text: string;
    quality: "strong" | "acceptable" | "weak" | "risky";
    explanation: string;
    brandImpact: string;
    score: number;
  }>>().notNull().default([]),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  isPremium: boolean("is_premium").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userScenarioCompletionsTable = pgTable("user_scenario_completions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  scenarioId: text("scenario_id").notNull().references(() => scenariosTable.id, { onDelete: "cascade" }),
  selectedOptionId: text("selected_option_id").notNull(),
  score: integer("score").notNull(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export type Scenario = typeof scenariosTable.$inferSelect;
export type UserScenarioCompletion = typeof userScenarioCompletionsTable.$inferSelect;
