import { pgTable, timestamp, uuid, varchar, boolean} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().unique().primaryKey(),
  email: varchar("email", {
    length: 255,
  }).notNull(),
  password: varchar("password", {
    length: 255,
  }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  }).$onUpdate(() => new Date()).notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().unique().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  expiresAt: timestamp("expires_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  }).$onUpdate(() => new Date()).notNull(),
});

export const todos = pgTable("todos", {
  id: uuid("id").defaultRandom().unique().primaryKey(),
  todo: varchar("todo", {
    length: 255,
  }).notNull(),
  completed: boolean("completed").default(false).notNull(),
  userId: uuid("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    precision: 3,
    withTimezone: true,
  }).$onUpdate(() => new Date()).notNull(),
});