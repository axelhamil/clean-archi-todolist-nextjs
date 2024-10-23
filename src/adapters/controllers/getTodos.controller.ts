import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/common/di";
import { getAllTodosUseCase } from "@/src/application/use-cases/getAllTodos.use-case";
import { Todo } from "@/src/domains/todo/todo.entity";
import { UnauthorizedError } from "@/src/shared/errors";

const presenter = (data: Todo[]) => {
  return startSpan(
    {
      name: "createTodo presenter",
      op: "serialize",
    },
    () =>
      data.map((d) => ({
        completed: d.completed,
        createdAt: d?.createdAt ?? undefined,
        description: d.description,
        id: d.id,
        priority: d.priority,
        title: d.title,
        updatedAt: d?.updatedAt ?? undefined,
        userId: d.userId,
      })),
  );
};

export type GetTodosController = (
  sessionId: string | undefined,
) => Promise<ReturnType<typeof presenter>>;
export const getTodosController: GetTodosController = async (sessionId) => {
  return await startSpan(
    {
      name: "getTodos controller",
      op: "controller",
    },
    async () => {
      if (!sessionId) throw new UnauthorizedError("Must be logged in");
      const authService = getInjection("AuthService");
      const { user } = await authService.validateSession(sessionId);

      const result = await getAllTodosUseCase(user.id);

      return presenter(result);
    },
  );
};

// query page -> getTodoListcontroller (verifie que le token exist, decode le token, il verifie si le token est valide, est return le user)

// controller -> service user du token ->
