import { randomUUID } from "node:crypto";

import { Todo, TodoInsert, todoSchema } from "@/src/domains/todo/todo.entity";
import {
  todoCompletedEventSchema,
  todoCreatedEventSchema,
} from "@/src/domains/todo/todo.event";
import { DomainError } from "@/src/shared/errors";
import { createDomainEvent } from "@/src/shared/events/domainEvent";

export type CreateTodo = (schema: TodoInsert, id?: string) => Todo;
export const createTodo: CreateTodo = (input, id = randomUUID()) => {
  const todoData = {
    completed: input.completed,
    id,
    points: 5,
    title: input.title,
    updatedAt: new Date(),
    userId: input.userId,
  };

  const { data, error: inputParseError } = todoSchema.safeParse(todoData);

  if (inputParseError)
    throw new DomainError("Invalid data", {
      cause: inputParseError.errors,
    });

  createDomainEvent(data, todoCreatedEventSchema);

  return data;
};

export type ToggleTodo = (todo: Todo) => Todo;
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
