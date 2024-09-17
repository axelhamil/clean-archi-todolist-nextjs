import { captureException, startSpan } from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import { injectable } from "inversify";

import { users } from "@/shared/db/schemas";
import { IUserRepo } from "@/src/application/spi/userRepo.spi";
import { User } from "@/src/domains/entities/user";
import { DatabaseOperationError } from "@/src/domains/errors/common";

import { db } from "../../../shared/db";

@injectable()
export class UserRepoImpl implements IUserRepo {
  async create(input: { email: string; password: string }): Promise<User> {
    return await startSpan(
      {
        name: "AuthRepo -> create",
        op: "repository",
      },
      async () => {
        try {
          const userExistsquery = db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, input.email),
          });
          const insertUserquery = db.insert(users).values(input).returning();

          const userExists = await startSpan(
            {
              attributes: {
                "db.system": "postgres",
              },
              name: userExistsquery.toSQL().sql,
              op: "db.query",
            },
            async () => userExistsquery.execute(),
          );

          if (userExists)
            throw new DatabaseOperationError("User already exists");

          const [created] = await startSpan(
            {
              attributes: {
                "db.system": "postgres",
              },
              name: insertUserquery.toSQL().sql,
              op: "db.query",
            },
            async () => insertUserquery.execute(),
          );

          return created;
        } catch (error) {
          captureException(error, {
            level: "error",
            tags: {
              "error.type": "DatabaseOperationError",
            },
          });

          throw new DatabaseOperationError("Error creating user", {
            cause: error,
          });
        }
      },
    );
  }

  async update(user: User): Promise<User> {
    return await startSpan(
      {
        name: "AuthRepo -> update",
        op: "repository",
      },
      async () => {
        try {
          const query = db
            .update(users)
            .set(user)
            .where(eq(users.id, user.id))
            .returning();

          const [updated] = await startSpan(
            {
              attributes: {
                "db.system": "postgres",
              },
              name: query.toSQL().sql,
              op: "db.query",
            },
            async () => query.execute(),
          );

          return updated;
        } catch (error) {
          captureException(error, {
            level: "error",
            tags: {
              "error.type": "DatabaseOperationError",
            },
          });

          throw new DatabaseOperationError("Error updating user", {
            cause: error,
          });
        }
      },
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    return await startSpan(
      {
        name: "AuthRepo -> findByEmail",
        op: "repository",
      },
      async () => {
        try {
          const query = db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email),
          });

          const user = await startSpan(
            {
              attributes: {
                "db.system": "postgres",
              },
              name: query.toSQL().sql,
              op: "db.query",
            },
            async () => query.execute(),
          );

          return user || null;
        } catch (error) {
          captureException(error, {
            level: "error",
            tags: {
              "error.type": "DatabaseOperationError",
            },
          });

          throw new DatabaseOperationError("Error finding user", {
            cause: error,
          });
        }
      },
    );
  }

  async findById(id: string): Promise<User | null> {
    return await startSpan(
      {
        name: "AuthRepo -> findById",
        op: "repository",
      },
      async () => {
        try {
          const query = db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, id),
          });

          const user = await startSpan(
            {
              attributes: {
                "db.system": "postgres",
              },
              name: query.toSQL().sql,
              op: "db.query",
            },
            async () => query.execute(),
          );

          return user || null;
        } catch (error) {
          captureException(error, {
            level: "error",
            tags: {
              "error.type": "DatabaseOperationError",
            },
          });

          throw new DatabaseOperationError("Error finding user", {
            cause: error,
          });
        }
      },
    );
  }
}
