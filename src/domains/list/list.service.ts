import { randomUUID } from "node:crypto";

import { List, ListInsert, listSchema } from "@/src/domains/list/list.entity";
import { DomainError } from "@/src/shared/errors";

export type CreateList = (schema: ListInsert, id?: string) => List;
export const createList: CreateList = (input, id = randomUUID()) => {
  const listData = {
    ...input,
    id,
    updatedAt: new Date(),
  };

  const { data, error: inputParseError } = listSchema.safeParse(listData);

  if (inputParseError)
    throw new DomainError("Invalid data", {
      cause: inputParseError.errors,
    });

  return data;
};
