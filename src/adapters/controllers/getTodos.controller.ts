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
        id: d.id,
        todo: d.todo,
        updatedAt: d?.updatedAt ?? undefined,
        userId: d.userId,
      })),
  );
};

export async function getTodosController(
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  if (!sessionId) throw new UnauthorizedError("Must be logged in");
  const authService = getInjection("AuthService");
  const { user } = await authService.validateSession(sessionId);

  const result = await getAllTodosUseCase(user.id);

  return presenter(result);
}
