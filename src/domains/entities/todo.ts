import { randomUUID } from "node:crypto";

import { z } from "zod";

import { domainEventSchema } from "@/libs/domain.event";
import { eventBus } from "@/libs/eventBus";

export const todoSchema = z.object({
  completed: z.boolean().default(false),
  createdAt: z.date().optional(),
  id: z.string(),
  todo: z.string(),
  updatedAt: z.date().optional(),
  userId: z.string(),
});

export const todoCompletedEventSchema = domainEventSchema.extend({
  payload: todoSchema,
  type: z.literal("TODO_COMPLETED"),
});
export type TodoCompletedEvent = z.infer<typeof todoCompletedEventSchema>;

export type Todo = z.infer<typeof todoSchema>;

export const insertTodoSchema = todoSchema.pick({
  completed: true,
  todo: true,
  userId: true,
});
export type TodoInsert = z.infer<typeof insertTodoSchema>;

export const createTodo = (schema: Todo, id?: string): Todo => {
  const todo = todoSchema.parse({
    completed: schema.completed,
    createdAt: schema.createdAt ?? new Date(),
    id: id ?? randomUUID(),
    todo: schema.todo,
    updatedAt: new Date(),
    userId: schema.userId,
  });

  if (todo.completed && todo.id === id) {
    const event = todoCompletedEventSchema.parse({
      id: todo.id,
      payload: todo,
      type: "TODO_COMPLETED",
    });

    eventBus.addEvent(todo.id, event);
  }

  return todo;
};
