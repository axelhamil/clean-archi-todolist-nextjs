import { randomUUID } from "node:crypto";

import {
  Todo,
  TodoCompleted,
  TodoInsert,
  todoSchema,
} from "@/src/domains/todo/todo.entity";
import { todoCreatedEventSchema } from "@/src/domains/todo/todo.event";
import { DomainError } from "@/src/shared/errors";
import { createDomainEvent } from "@/src/shared/events/domainEvent";

export type CreateTodo = (schema: TodoInsert, id?: string) => Todo;
export const createTodo: CreateTodo = (input, id = randomUUID()) => {
  const todoData = {
    ...input,
    id,
    updatedAt: new Date(),
  };

  const { data, error: inputParseError } = todoSchema.safeParse(todoData);

  if (inputParseError)
    throw new DomainError("Invalid data", {
      cause: inputParseError.errors,
    });

  createDomainEvent(data, todoCreatedEventSchema);

  return data;
};

export type ToggleTodo = (oldTodo: Todo, toggleData: TodoCompleted) => Todo;
export const toggleTodo: ToggleTodo = (oldTodo, toggleData) => {
  const { data, error: inputParseError } = todoSchema.safeParse({
    ...oldTodo,
    completed: toggleData,
    updatedAt: new Date(),
  } as Todo);

  if (inputParseError)
    throw new DomainError("Invalid data", {
      cause: inputParseError.errors,
    });

  createDomainEvent(data, todoCreatedEventSchema);

  return data;
};

export type AddTodoIntoList = (todo: Todo, listId: string) => Todo;
export const addTodoIntoList: AddTodoIntoList = (todo, listId) => {
  const { data, error: inputParseError } = todoSchema.safeParse({
    ...todo,
    listId,
    updatedAt: new Date(),
  } as Todo);

  if (inputParseError)
    throw new DomainError("Invalid data", {
      cause: inputParseError.errors,
    });

  createDomainEvent(data, todoCreatedEventSchema);

  return data;
};
