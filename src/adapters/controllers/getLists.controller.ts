import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/common/di";
import { getAllListUseCase } from "@/src/application/use-cases/getAllList.use-case";
import { List } from "@/src/domains/list/list.entity";
import { UnauthorizedError } from "@/src/shared/errors";

const presenter = (data: List[]) => {
  return startSpan(
    {
      name: "createTodo presenter",
      op: "serialize",
    },
    () =>
      data.map((d) => ({
        createdAt: d?.createdAt ?? undefined,
        id: d.id,
        name: d.name,
        updatedAt: d?.updatedAt ?? undefined,
        userId: d.userId,
      })),
  );
};

export type GetListsController = (
  sessionId: string | undefined,
) => Promise<ReturnType<typeof presenter>>;
export const getListsController: GetListsController = async (sessionId) => {
  return await startSpan(
    {
      name: "getLists controller",
      op: "controller",
    },
    async () => {
      if (!sessionId) throw new UnauthorizedError("Must be logged in");
      const authService = getInjection("AuthService");
      const { user } = await authService.validateSession(sessionId);

      const result = await getAllListUseCase(user.id);

      return presenter(result);
    },
  );
};
