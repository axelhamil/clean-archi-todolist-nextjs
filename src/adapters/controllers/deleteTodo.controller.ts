import { startSpan } from "@sentry/nextjs";
import { z } from "zod";

import { validateSession } from "@/src/application/services/auth.service";
import { deleteTodoUseCase } from "@/src/application/use-cases/deleteTodo.use-case";
import { InputParseError, UnauthorizedError } from "@/src/shared/errors";

const presenter = (data: string) => {
  return startSpan(
    {
      name: "deleteTodo presenter",
      op: "serialize",
    },
    () => ({
      id: data,
    }),
  );
};

const deleteTodoInputSchema = z.object({ id: z.string().min(1) });
export type DeleteTodoInput = z.infer<typeof deleteTodoInputSchema>;
export async function deleteTodoController(
  input: DeleteTodoInput,
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
        deleteTodoInputSchema.safeParse(input);

      if (inputParseError)
        throw new InputParseError("Invalid data", {
          cause: inputParseError.errors,
        });

      const result = await deleteTodoUseCase(data, user.id);

      return presenter(result);
    },
  );
}
