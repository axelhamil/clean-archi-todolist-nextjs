import { startSpan } from "@sentry/nextjs";
import { z } from "zod";

import { validateSession } from "@/src/application/services/authService";
import { toggleTodoUseCase } from "@/src/application/useCases/todo/toggleTodo.useCase";
import { Todo } from "@/src/domains/entities/todo";
import {
  InputParseError,
  UnauthorizedError,
} from "@/src/domains/errors/common";

const presenter = (data: Todo) => {
  return startSpan(
    {
      name: "toggleTodo presenter",
      op: "serialize",
    },
    () => ({
      completed: data.completed,
      createdAt: data?.createdAt ?? undefined,
      id: data.id,
      todo: data.todo,
      updatedAt: data?.updatedAt ?? undefined,
      userId: data.userId,
    }),
  );
};

const toggleTodoInputSchema = z.object({ id: z.string().min(1) });
export type ToggleTodoInput = z.infer<typeof toggleTodoInputSchema>;
export async function toggleTodoController(
  input: ToggleTodoInput,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "toggleTodo controller",
      op: "controller",
    },
    async () => {
      if (!sessionId) throw new UnauthorizedError("Must be logged in");

      const { user } = await validateSession(sessionId);

      const { data, error: inputParseError } =
        toggleTodoInputSchema.safeParse(input);

      if (inputParseError)
        throw new InputParseError("Invalid data", {
          cause: inputParseError.errors,
        });

      const result = await toggleTodoUseCase(data, user.id);

      return presenter(result);
    },
  );
}
