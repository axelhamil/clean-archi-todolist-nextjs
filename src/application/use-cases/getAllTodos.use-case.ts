import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/common/di";
import { Todo } from "@/src/domains/todo/todo.entity";

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
