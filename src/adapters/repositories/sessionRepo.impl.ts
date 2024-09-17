import { captureException, startSpan } from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import { injectable } from "inversify";

import { sessions } from "@/shared/db/schemas";
import { ISessionRepo } from "@/src/application/spi/sessionRepo.spi";
import { Session } from "@/src/domains/entities/session";
import { DatabaseOperationError } from "@/src/domains/errors/common";

import { db } from "../../../shared/db";

@injectable()
export class SessionRepoImpl implements ISessionRepo {
  async create(userId: string): Promise<Session> {
    return await startSpan(
      {
        name: "SessionRepo -> create",
        op: "repository",
      },
      async () => {
        try {
          const insertQuery = db
            .insert(sessions)
            .values({
              expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
              userId,
            })
            .returning();

          const [session] = await startSpan(
            {
              attributes: {
                "db.system": "postgres",
              },
              name: insertQuery.toSQL().sql,
              op: "db.query",
            },
            async () => insertQuery.execute(),
          );

          return session;
        } catch (error) {
          captureException(error, {
            level: "error",
            tags: {
              "error.type": "DatabaseOperationError",
            },
          });

          throw new DatabaseOperationError("Error creating session", {
            cause: error,
          });
        }
      },
    );
  }

  async update(session: Session): Promise<Session> {
    return await startSpan(
      {
        name: "SessionRepo -> update",
        op: "repository",
      },
      async () => {
        try {
          const updateQuery = db
            .update(sessions)
            .set({
              ...session,
              expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            })
            .where(eq(sessions.id, session.id))
            .returning();

          const [updatedSession] = await startSpan(
            {
              attributes: {
                "db.system": "postgres",
              },
              name: updateQuery.toSQL().sql,
              op: "db.query",
            },
            async () => updateQuery.execute(),
          );

          return updatedSession;
        } catch (error) {
          captureException(error, {
            level: "error",
            tags: {
              "error.type": "DatabaseOperationError",
            },
          });

          throw new DatabaseOperationError("Error updating session", {
            cause: error,
          });
        }
      },
    );
  }

  async delete(sessionId: string): Promise<Session> {
    return await startSpan(
      {
        name: "SessionRepo -> delete",
        op: "repository",
      },
      async () => {
        try {
          const deleteQuery = db
            .delete(sessions)
            .where(eq(sessions.id, sessionId))
            .returning();

          const [session] = await startSpan(
            {
              attributes: {
                "db.system": "postgres",
              },
              name: deleteQuery.toSQL().sql,
              op: "db.query",
            },
            async () => deleteQuery.execute(),
          );

          return session;
        } catch (error) {
          captureException(error, {
            level: "error",
            tags: {
              "error.type": "DatabaseOperationError",
            },
          });

          throw new DatabaseOperationError("Error deleting session", {
            cause: error,
          });
        }
      },
    );
  }

  async find(sessionId: string): Promise<Session | null> {
    return await startSpan(
      {
        name: "SessionRepo -> find",
        op: "repository",
      },
      async () => {
        try {
          const query = db.query.sessions.findFirst({
            where: (sessions, { eq }) => eq(sessions.id, sessionId),
          });

          const session = await startSpan(
            {
              attributes: {
                "db.system": "postgres",
              },
              name: query.toSQL().sql,
              op: "db.query",
            },
            async () => query.execute(),
          );

          return session || null;
        } catch (error) {
          captureException(error, {
            level: "error",
            tags: {
              "error.type": "DatabaseOperationError",
            },
          });

          throw new DatabaseOperationError("Error finding session", {
            cause: error,
          });
        }
      },
    );
  }

  async findByUserId(userId: string): Promise<Session | null> {
    return await startSpan(
      {
        name: "SessionRepo -> findByUserId",
        op: "repository",
      },
      async () => {
        try {
          const query = db.query.sessions.findFirst({
            where: (sessions, { eq }) => eq(sessions.userId, userId),
          });

          const session = await startSpan(
            {
              attributes: {
                "db.system": "postgres",
              },
              name: query.toSQL().sql,
              op: "db.query",
            },
            async () => query.execute(),
          );

          return session || null;
        } catch (error) {
          captureException(error, {
            level: "error",
            tags: {
              "error.type": "DatabaseOperationError",
            },
          });

          throw new DatabaseOperationError("Error finding session by user id", {
            cause: error,
          });
        }
      },
    );
  }
}
