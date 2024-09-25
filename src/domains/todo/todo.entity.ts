import { z } from "zod";

import { entitySchema } from "@/src/shared/entity";

export const todoSchema = entitySchema.extend({
  completed: z.boolean().default(false),
  title: z.string(),
  userId: z.string(),
});
export const insertTodoSchema = todoSchema.pick({
  completed: true,
  title: true,
  userId: true,
});

export type Todo = z.infer<typeof todoSchema>;
export type TodoInsert = z.infer<typeof insertTodoSchema>;
