import { randomUUID } from "node:crypto";

import { Todo, TodoInsert, todoSchema } from "@/src/domains/todo/todo.entity";
import {
  todoCompletedEventSchema,
  todoCreatedEventSchema,
} from "@/src/domains/todo/todo.event";
import { DomainError } from "@/src/shared/errors";
import { createDomainEvent } from "@/src/shared/events/domainEvent";

export type CreateTodo = (schema: TodoInsert, id?: string) => Todo;
export const createTodo: CreateTodo = (schema, id = randomUUID()) => {
  const todoData = {
    completed: schema.completed,
    id,
    points: 5,
    todo: schema.todo,
    updatedAt: new Date(),
    userId: schema.userId,
  };

  const { data, error: inputParseError } = todoSchema.safeParse(todoData);

  if (inputParseError)
    throw new DomainError("Invalid data", {
      cause: inputParseError.errors,
    });

  createDomainEvent(data, todoCreatedEventSchema);

  return data;
};

export const toggleTodo = (todo: Todo): Todo => {
  const { data, error: inputParseError } = todoSchema.safeParse({
    ...todo,
    completed: !todo.completed,
  });

  if (inputParseError)
    throw new DomainError("Invalid data", {
      cause: inputParseError.errors,
    });

  if (data.completed) createDomainEvent(data, todoCompletedEventSchema);

  return data;
};
