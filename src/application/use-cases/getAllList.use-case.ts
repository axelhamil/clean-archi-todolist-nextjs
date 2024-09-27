import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/common/di";
import { List } from "@/src/domains/list/list.entity";

export type GetAllListUseCase = (userId: string) => Promise<List[]>;
export const getAllListUseCase: GetAllListUseCase = async (userId) => {
  return await startSpan(
    {
      name: "getAllListUseCase",
      op: "use-case",
    },
    async () => {
      const listRepo = getInjection("IListRepo");

      const lists = await listRepo.findAll(userId);

      return lists;
    },
  );
};
