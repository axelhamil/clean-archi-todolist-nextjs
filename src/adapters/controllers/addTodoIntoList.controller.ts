import { startSpan } from "@sentry/nextjs";
import { z } from "zod";

import { getInjection } from "@/common/di";
import { addTodoIntoListUseCase } from "@/src/application/use-cases/addTodoIntoList.use-case";
import { Todo } from "@/src/domains/todo/todo.entity";
import { InputParseError, UnauthorizedError } from "@/src/shared/errors";

const presenter = (data: Todo) => {
  return startSpan(
    {
      name: "addTodoIntoList presenter",
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

const addTodoIntoListSchema = z.object({
  listId: z.string(),
  todoId: z.string(),
});
export type AddTodoIntoListInput = z.infer<typeof addTodoIntoListSchema>;
export type AddTodoIntoListController = (
  input: AddTodoIntoListInput,
  sessionId: string | undefined,
) => Promise<ReturnType<typeof presenter>>;
export const addTodoIntoListController: AddTodoIntoListController = async (
  input,
  sessionId,
) => {
  return startSpan(
    {
      name: "addTodoIntoList controller",
      op: "controller",
    },
    async () => {
      if (!sessionId) throw new UnauthorizedError("Must be logged in");
      const authService = getInjection("AuthService");
      await authService.validateSession(sessionId);

      const { data, error: inputParseError } =
        addTodoIntoListSchema.safeParse(input);

      if (inputParseError)
        throw new InputParseError("Invalid data", {
          cause: inputParseError.errors,
        });

      const result = await addTodoIntoListUseCase(data);

      return presenter(result);
    },
  );
};
