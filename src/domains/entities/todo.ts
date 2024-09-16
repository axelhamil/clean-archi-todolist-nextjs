import { z } from "zod";

export const selectTodoSchema = z.object({
  id: z.string(),
  todo: z.string(),
  completed: z.boolean().default(false),
  userId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})
export type Todo = z.infer<typeof selectTodoSchema>;

export const insertTodoSchema = selectTodoSchema.pick({
  todo: true,
  completed: true,
  userId: true,
})
export type TodoInsert = z.infer<typeof insertTodoSchema>;