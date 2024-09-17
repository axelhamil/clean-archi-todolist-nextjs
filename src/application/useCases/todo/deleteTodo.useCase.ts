import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/shared/di";
import { NotFoundError, UnauthorizedError } from "@/src/domains/errors/common";

export const deleteTodoUseCase = async (
  input: { id: string },
  userId: string,
): Promise<string> => {
  return await startSpan(
    {
      name: "deleteTodoUseCase",
      op: "use-case",
    },
    async () => {
      const todoRepo = getInjection("ITodoRepo");

      const todo = await todoRepo.findById(input.id);

      if (!todo) throw new NotFoundError("Todo not found");

      if (todo.userId !== userId)
        throw new UnauthorizedError(
          "Cannot delete todo, because: unauthorized",
        );

      const deletedTodo = await todoRepo.delete(todo.id);

      return deletedTodo;
    },
  );
};
