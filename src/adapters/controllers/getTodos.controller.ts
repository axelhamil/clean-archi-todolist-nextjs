import { startSpan } from "@sentry/nextjs";

import { validateSession } from "@/src/application/services/authService";
import { getAllTodosUseCase } from "@/src/application/useCases/todo/getAllTodos.useCase";
import { Todo } from "@/src/domains/entities/todo";
import { UnauthorizedError } from "@/src/domains/errors/common";

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

  const { user } = await validateSession(sessionId);

  const result = await getAllTodosUseCase(user.id);

  return presenter(result);
}
