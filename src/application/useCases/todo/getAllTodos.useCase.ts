import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/shared/di";
import { Todo } from "@/src/domains/entities/todo";

export const getAllTodosUseCase = async (userId: string): Promise<Todo[]> => {
  return await startSpan(
    {
      name: "getAllTodosUseCase",
      op: "use-case",
    },
    async () => {
      const todoRepo = getInjection("ITodoRepo");

      const todos = await todoRepo.findAll(userId);

      return todos;
    },
  );
};
