import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/common/di";
import { Todo } from "@/src/domains/todo/todo.entity";
import { toggleTodo } from "@/src/domains/todo/todo.service";
import { NotFoundError, UnauthorizedError } from "@/src/shared/errors";

export const toggleTodoUseCase = async (
  input: { id: string },
  userId: string,
): Promise<Todo> => {
  return await startSpan(
    {
      name: "toggleTodoUseCase",
      op: "use-case",
    },
    async () => {
      const todoRepo = getInjection("ITodoRepo");

      const todo = await todoRepo.findById(input.id);

      if (!todo) throw new NotFoundError("Todo not found");

      if (todo.userId !== userId)
        throw new UnauthorizedError(
          "Cannot toggle todo, because: unauthorized",
        );

      const completedTodo = toggleTodo(todo);

      const updatedTodo = await todoRepo.update(completedTodo);

      return updatedTodo;
    },
  );
};
