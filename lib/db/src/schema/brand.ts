import { pgTable, text, timestamp, boolean, integer, jsonb, real } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const brandProfilesTable = pgTable("brand_profiles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }).unique(),
  desiredIdentity: jsonb("desired_identity").$type<string[]>().notNull().default([]),
  currentPerceptions: jsonb("current_perceptions").$type<string[]>().notNull().default([]),
  gapAreas: jsonb("gap_areas").$type<string[]>().notNull().default([]),
  strengths: jsonb("strengths").$type<string[]>().notNull().default([]),
  activeHabitIds: jsonb("active_habit_ids").$type<string[]>().notNull().default([]),
  brandScore: real("brand_score").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const reflectionResponsesTable = pgTable("reflection_responses", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  promptId: text("prompt_id").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type BrandProfile = typeof brandProfilesTable.$inferSelect;
export type ReflectionResponse = typeof reflectionResponsesTable.$inferSelect;
