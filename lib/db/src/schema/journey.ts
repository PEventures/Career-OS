import { pgTable, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const journeyActionsTable = pgTable("journey_actions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  day: integer("day").notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  reflectionText: text("reflection_text"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const journeyMilestonesTable = pgTable("journey_milestones", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dayTarget: integer("day_target").notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userStatsTable = pgTable("user_stats", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }).unique(),
  streakDays: integer("streak_days").notNull().default(0),
  lastCheckinDate: timestamp("last_checkin_date"),
  totalCoachSessions: integer("total_coach_sessions").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type JourneyAction = typeof journeyActionsTable.$inferSelect;
export type JourneyMilestone = typeof journeyMilestonesTable.$inferSelect;
export type UserStats = typeof userStatsTable.$inferSelect;
