import { startSpan } from "@sentry/nextjs";
import { z } from "zod";

import { validateSession } from "@/src/application/services/authService";
import { createTodoUseCase } from "@/src/application/useCases/todo/createTodo.useCase";
import { Todo } from "@/src/domains/entities/todo";
import {
  InputParseError,
  UnauthorizedError,
} from "@/src/domains/errors/common";

const presenter = (data: Todo) => {
  return startSpan(
    {
      name: "createTodo presenter",
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

const createTodoInputSchema = z.object({ todo: z.string().min(1) });
export type CreateTodoInput = z.infer<typeof createTodoInputSchema>;
export async function createTodoController(
  input: CreateTodoInput,
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "createTodo controller",
      op: "controller",
    },
    async () => {
      if (!sessionId) throw new UnauthorizedError("Must be logged in");

      const { user } = await validateSession(sessionId);

      const { data, error: inputParseError } =
        createTodoInputSchema.safeParse(input);

      if (inputParseError)
        throw new InputParseError("Invalid data", {
          cause: inputParseError.errors,
        });

      const result = await createTodoUseCase(data, user.id);

      return presenter(result);
    },
  );
}
