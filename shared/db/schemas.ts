import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

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
  points: integer("points").default(0).notNull(),
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

export const todos = pgTable("todos", {
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  id: uuid("id").defaultRandom().unique().primaryKey(),
  todo: varchar("todo", {
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
