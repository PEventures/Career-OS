import { pgTable, text, timestamp, boolean, integer, jsonb, real } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const assessmentsTable = pgTable("assessments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull().default(15),
  questions: jsonb("questions").$type<Array<{
    id: string;
    text: string;
    type: "single" | "scale" | "multi";
    options: Array<{
      id: string;
      text: string;
      value: number;
    }>;
  }>>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const assessmentResultsTable = pgTable("assessment_results", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  assessmentId: text("assessment_id").notNull().references(() => assessmentsTable.id, { onDelete: "cascade" }),
  answers: jsonb("answers").$type<Array<{
    questionId: string;
    selectedOptionId?: string;
    value?: number;
  }>>().notNull().default([]),
  score: real("score").notNull(),
  strengths: jsonb("strengths").$type<string[]>().notNull().default([]),
  blindSpots: jsonb("blind_spots").$type<string[]>().notNull().default([]),
  recommendations: jsonb("recommendations").$type<string[]>().notNull().default([]),
  breakdown: jsonb("breakdown").$type<Array<{ category: string; score: number; label: string }>>().notNull().default([]),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export type Assessment = typeof assessmentsTable.$inferSelect;
export type AssessmentResult = typeof assessmentResultsTable.$inferSelect;
