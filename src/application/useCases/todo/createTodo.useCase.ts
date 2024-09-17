import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/shared/di";
import { Todo } from "@/src/domains/entities/todo";

export const createTodoUseCase = async (
  input: { todo: string },
  userId: string,
): Promise<Todo> => {
  return startSpan(
    {
      name: "createTodoUseCase",
      op: "use-case",
    },
    async () => {
      const todoRepo = getInjection("ITodoRepo");

      const todo = await todoRepo.create({
        completed: false,
        todo: input.todo,
        userId,
      });

      return todo;
    },
  );
};
