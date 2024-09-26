import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/common/di";
import {
  Todo,
  TodoCompleted,
  TodoPriority,
} from "@/src/domains/todo/todo.entity";
import { createTodo } from "@/src/domains/todo/todo.service";

export const createTodoUseCase = async (
  input: {
    title: string;
    description?: string;
    completed?: TodoCompleted;
    priority?: TodoPriority;
  },
  userId: string,
): Promise<Todo> => {
  return startSpan(
    {
      name: "createTodoUseCase",
      op: "use-case",
    },
    async () => {
      const todoRepo = getInjection("ITodoRepo");

      const newTodo = createTodo({
        ...input,
        userId,
      });

      const todo = await todoRepo.create(newTodo);

      return todo;
    },
  );
};
