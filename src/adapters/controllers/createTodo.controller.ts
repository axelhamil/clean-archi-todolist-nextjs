import { startSpan } from "@sentry/nextjs";
import { z } from "zod";

import { getInjection } from "@/common/di";
import { createTodoUseCase } from "@/src/application/use-cases/createTodo.use-case";
import {
  Todo,
  TodoCompleted,
  TodoPriority,
} from "@/src/domains/todo/todo.entity";
import { InputParseError, UnauthorizedError } from "@/src/shared/errors";

const presenter = (data: Todo) => {
  return startSpan(
    {
      name: "createTodo presenter",
      op: "serialize",
    },
    () => ({
      completed: data.completed,
      createdAt: data?.createdAt ?? undefined,
      description: data.description,
      id: data.id,
      priority: data.priority,
      title: data.title,
      updatedAt: data?.updatedAt ?? undefined,
      userId: data.userId,
    }),
  );
};

const createTodoInputSchema = z.object({
  completed: z.nativeEnum(TodoCompleted).optional(),
  description: z.string().optional(),
  priority: z.nativeEnum(TodoPriority).optional(),
  title: z.string().min(1),
});
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
      const authService = getInjection("AuthService");
      const { user } = await authService.validateSession(sessionId);

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
