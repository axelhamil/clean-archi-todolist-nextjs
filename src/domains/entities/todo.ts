import { z } from "zod";

export const todoSchema = z.object({
  completed: z.boolean().default(false),
  createdAt: z.date().optional(),
  id: z.string(),
  todo: z.string(),
  updatedAt: z.date().optional(),
  userId: z.string(),
});
export type Todo = z.infer<typeof todoSchema>;

export const insertTodoSchema = todoSchema.pick({
  completed: true,
  todo: true,
  userId: true,
});
export type TodoInsert = z.infer<typeof insertTodoSchema>;
