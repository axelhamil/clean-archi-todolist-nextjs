import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/common/di";
import { Todo } from "@/src/domains/todo/todo.entity";
import { createTodo } from "@/src/domains/todo/todo.service";

export const createTodoUseCase = async (
  input: { title: string },
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
        completed: false,
        title: input.title,
        userId,
      });

      const todo = await todoRepo.create(newTodo);

      return todo;
    },
  );
};
