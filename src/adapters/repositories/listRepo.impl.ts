import { captureException, startSpan } from "@sentry/nextjs";
import { injectable } from "inversify";

import { db } from "@/common/db";
import { lists } from "@/common/db/schemas";
import { IListRepo } from "@/src/application/interfaces/listRepo.interface";
import { List } from "@/src/domains/list/list.entity";
import { DatabaseOperationError } from "@/src/shared/errors";
import { eventBus } from "@/src/shared/events";

@injectable()
export class ListRepoImpl implements IListRepo {
  async create(list: List): Promise<List> {
    return await startSpan(
      {
        name: "ListRepo -> create",
        op: "repository",
      },
      async () => {
        try {
          const query = db.insert(lists).values(list).returning();

          const [created] = await startSpan(
            {
              attributes: {
                "db.system": "postgres",
              },
              name: query.toSQL().sql,
              op: "db.query",
            },
            async () => await query.execute(),
          );

          if (created) eventBus.dispatch(created.id);

          return created;
        } catch (error) {
          captureException(error, {
            level: "error",
            tags: {
              "error.type": "DatabaseOperationError",
            },
          });

          throw new DatabaseOperationError("Error creating list", {
            cause: error,
          });
        }
      },
    );
  }

  async findAll(userId: string): Promise<List[]> {
    return await startSpan(
      {
        name: "ListRepo -> findAll",
        op: "repository",
      },
      async () => {
        try {
          const query = db.query.lists.findMany({
            where: (lists, { eq }) => eq(lists.userId, userId),
          });

          const lists = await startSpan(
            {
              attributes: {
                "db.system": "postgres",
              },
              name: query.toSQL().sql,
              op: "db.query",
            },
            async () => await query.execute(),
          );

          return lists || [];
        } catch (error) {
          captureException(error, {
            level: "error",
            tags: {
              "error.type": "DatabaseOperationError",
            },
          });

          throw new DatabaseOperationError("Error fetching lists", {
            cause: error,
          });
        }
      },
    );
  }
}
