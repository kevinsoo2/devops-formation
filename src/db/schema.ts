import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

// Users table (for GitHub auth)
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Accounts table (OAuth)
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
});

// Sessions table
export const sessions = sqliteTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

// Progress tracking
export const progress = sqliteTable("progress", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseSlug: text("course_slug").notNull(),
  lessonSlug: text("lesson_slug").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  completedAt: integer("completed_at", { mode: "timestamp" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.courseSlug, table.lessonSlug] }),
}));

// Quiz scores
export const quizScores = sqliteTable("quiz_scores", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseSlug: text("course_slug").notNull(),
  lessonSlug: text("lesson_slug").notNull(),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Favorites
export const favorites = sqliteTable("favorites", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseSlug: text("course_slug").notNull(),
  lessonSlug: text("lesson_slug").notNull(),
  lessonTitle: text("lesson_title").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.courseSlug, table.lessonSlug] }),
}));
