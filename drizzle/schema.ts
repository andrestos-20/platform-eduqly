import { mysqlEnum, mysqlTable, text, timestamp, varchar, json, int } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Modules table for storing course module information
 */
export const modules = mysqlTable("modules", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  instructor: varchar("instructor", { length: 255 }).notNull(),
  duration: varchar("duration", { length: 50 }).notNull(),
  format: varchar("format", { length: 255 }).notNull(),
  description: text("description").notNull(),
  files: json("files").$type<Array<{
    id: string;
    type: "video" | "audio" | "pdf" | "powerpoint" | "iframe";
    name: string;
    url?: string;
    iframeCode?: string;
    uploadedAt: string;
  }>>().notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type Module = typeof modules.$inferSelect;
export type InsertModule = typeof modules.$inferInsert;

/**
 * Admin users table for course management
 */
export const admins = mysqlTable("admins", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  ra: varchar("ra", { length: 20 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Admin = typeof admins.$inferSelect;
export type InsertAdmin = typeof admins.$inferInsert;
