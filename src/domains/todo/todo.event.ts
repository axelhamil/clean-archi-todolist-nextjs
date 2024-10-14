import { z } from "zod";

import { todoSchema } from "@/src/domains/todo/todo.entity";
import { domainEventSchema } from "@/src/shared/events/domainEvent";

export const todoCreatedEventSchema = domainEventSchema.extend({
  payload: todoSchema,
  type: z.literal("TODO_CREATED").default("TODO_CREATED"),
});
export const todoCompletedEventSchema = domainEventSchema.extend({
  payload: todoSchema,
  type: z.literal("TODO_COMPLETED").default("TODO_COMPLETED"),
});

export type TodoCreatedEvent = z.infer<typeof todoCreatedEventSchema>;
export type TodoCompletedEvent = z.infer<typeof todoCompletedEventSchema>;
