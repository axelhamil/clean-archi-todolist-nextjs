import { startSpan } from "@sentry/nextjs";
import { z } from "zod";

import { getInjection } from "@/common/di";
import { createListUseCase } from "@/src/application/use-cases/createList.use-case";
import { List } from "@/src/domains/list/list.entity";
import { InputParseError, UnauthorizedError } from "@/src/shared/errors";

const presenter = (data: List) => {
  return startSpan(
    {
      name: "createList presenter",
      op: "serialize",
    },
    () => {
      return {
        createdAt: data?.createdAt ?? undefined,
        id: data.id,
        name: data.name,
        updatedAt: data?.updatedAt ?? undefined,
        userId: data.userId,
      };
    },
  );
};

const createListInputSchema = z.object({
  name: z.string().min(1),
});
export type CreateListInput = z.infer<typeof createListInputSchema>;
export type CreateListController = (
  input: CreateListInput,
  sessionId: string | undefined,
) => Promise<ReturnType<typeof presenter>>;
export const createListController: CreateListController = async (
  input,
  sessionId,
) => {
  return await startSpan(
    {
      name: "createList controller",
      op: "controller",
    },
    async () => {
      if (!sessionId) throw new UnauthorizedError("Must be logged in");
      const authService = getInjection("AuthService");
      const { user } = await authService.validateSession(sessionId);

      const { data, error: inputParseError } =
        createListInputSchema.safeParse(input);

      if (inputParseError)
        throw new InputParseError("Invalid data", {
          cause: inputParseError.errors,
        });

      const result = await createListUseCase(
        {
          name: data.name,
        },
        user.id,
      );

      return presenter(result);
    },
  );
};
