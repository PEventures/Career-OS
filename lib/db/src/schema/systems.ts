import { pgTable, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";

export const systemsTable = pgTable("systems", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull().default(10),
  steps: jsonb("steps").$type<Array<{
    order: number;
    title: string;
    description: string;
  }>>().notNull().default([]),
  keyPrinciples: jsonb("key_principles").$type<string[]>().notNull().default([]),
  scripts: jsonb("scripts").$type<Array<{
    tone: string;
    text: string;
  }>>().notNull().default([]),
  isPremium: boolean("is_premium").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type System = typeof systemsTable.$inferSelect;
