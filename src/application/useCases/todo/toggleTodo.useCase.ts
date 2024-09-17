import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/libs/di";
import { createTodo, Todo } from "@/src/domains/entities/todo";
import { NotFoundError, UnauthorizedError } from "@/src/domains/errors/common";

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

      const newTodo = createTodo(
        {
          ...todo,
          completed: !todo.completed,
        },
        todo.id,
      );

      const updatedTodo = await todoRepo.update(newTodo);

      return updatedTodo;
    },
  );
};
