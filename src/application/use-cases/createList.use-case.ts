import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/common/di";
import { List } from "@/src/domains/list/list.entity";
import { createList } from "@/src/domains/list/list.service";

export type CreateListUseCase = (
  input: {
    name: string;
  },
  userId: string,
) => Promise<List>;
export const createListUseCase: CreateListUseCase = async (input, userId) => {
  return startSpan(
    {
      name: "createListUseCase",
      op: "use-case",
    },
    async () => {
      const listRepo = getInjection("IListRepo");

      const newList = createList({
        ...input,
        userId,
      });

      await listRepo.create(newList);

      return newList;
    },
  );
};
