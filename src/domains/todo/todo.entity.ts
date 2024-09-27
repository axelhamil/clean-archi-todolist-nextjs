import { z } from "zod";

import { entitySchema } from "@/src/shared/entity";

export enum TodoCompleted {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}
export enum TodoPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}
export const todoSchema = entitySchema.extend({
  completed: z
    .nativeEnum(TodoCompleted)
    .default(TodoCompleted.TODO)
    .optional()
    .nullable(),
  description: z.string().default("").optional().nullable(),
  listId: z.string().optional().nullable(),
  priority: z
    .nativeEnum(TodoPriority)
    .default(TodoPriority.MEDIUM)
    .optional()
    .nullable(),
  title: z.string(),
  userId: z.string(),
});
export const insertTodoSchema = todoSchema.pick({
  completed: true,
  description: true,
  listId: true,
  priority: true,
  title: true,
  userId: true,
});

export type Todo = z.infer<typeof todoSchema>;
export type TodoInsert = z.infer<typeof insertTodoSchema>;
