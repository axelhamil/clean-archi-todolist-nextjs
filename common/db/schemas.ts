import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { TodoCompleted, TodoPriority } from "@/src/domains/todo/todo.entity";

export const users = pgTable("users", {
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  email: varchar("email", {
    length: 255,
  }).notNull(),
  id: uuid("id").defaultRandom().unique().primaryKey(),
  password: varchar("password", {
    length: 255,
  }).notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const sessions = pgTable("sessions", {
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  expiresAt: timestamp("expires_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  }).notNull(),
  id: uuid("id").defaultRandom().unique().primaryKey(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  })
    .$onUpdate(() => new Date())
    .notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
});

export const completedEnum = pgEnum("completed", [
  TodoCompleted.TODO,
  TodoCompleted.IN_PROGRESS,
  TodoCompleted.DONE,
]);
export const priorityEnum = pgEnum("priority", [
  TodoPriority.LOW,
  TodoPriority.MEDIUM,
  TodoPriority.HIGH,
]);

export const todos = pgTable("todos", {
  completed: completedEnum("completed"),
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  description: text("description").default("").notNull(),
  id: uuid("id").defaultRandom().unique().primaryKey(),
  priority: priorityEnum("priority"),
  title: varchar("title", {
    length: 255,
  }).notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  })
    .$onUpdate(() => new Date())
    .notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
});
