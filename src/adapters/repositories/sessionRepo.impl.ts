import {ISessionRepo} from "@/src/application/spi/sessionRepo.spi";
import { injectable } from "inversify";
import {Session} from "@/src/domains/entities/session";
import {captureException, startSpan } from "@sentry/nextjs";
import {DatabaseOperationError} from "@/src/domains/errors/common";
import {sessions} from "@/drizzle/schemas";
import {db} from "@/drizzle";
import { eq } from "drizzle-orm";

@injectable()
export class SessionRepoImpl implements ISessionRepo {
  async create(userId: string): Promise<Session> {
    return await startSpan({
      name: "SessionRepo -> create",
      op: "repository",
    }, async () => {
      try {
        const insertQuery = db.insert(sessions).values({
          userId,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        }).returning();
        
        const [session] = await startSpan({
          name: insertQuery.toSQL().sql,
          op: 'db.query',
          attributes: {
            "db.system": "postgres",
          }
        }, async () => insertQuery.execute());
        
        return session;
      } catch (error) {
        captureException(error, {
          level: 'error',
          tags: {
            "error.type": "DatabaseOperationError",
          }
        });
        
        throw new DatabaseOperationError("Error creating session", {
          cause: error
        });
      }
    })
  }
  
  async update(session: Session): Promise<Session> {
    return await startSpan({
      name: "SessionRepo -> update",
      op: "repository",
    }, async () => {
      try {
        const updateQuery = db.update(sessions).set({
          ...session,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        }).where(eq(sessions.id, session.id)).returning();
        
        const [updatedSession] = await startSpan({
          name: updateQuery.toSQL().sql,
          op: 'db.query',
          attributes: {
            "db.system": "postgres",
          }
        }, async () => updateQuery.execute());
        
        return updatedSession;
      } catch (error) {
        captureException(error, {
          level: 'error',
          tags: {
            "error.type": "DatabaseOperationError",
          }
        });
        
        throw new DatabaseOperationError("Error updating session", {
          cause: error
        });
      }
    })
  }

  async delete(sessionId: string): Promise<Session> {
    return await startSpan({
      name: "SessionRepo -> delete",
      op: "repository",
    }, async () => {
      try {
        const deleteQuery = db.delete(sessions).where(eq(
          sessions.id,
          sessionId
        )).returning();
        
        const [session] = await startSpan({
          name: deleteQuery.toSQL().sql,
          op: 'db.query',
          attributes: {
            "db.system": "postgres",
          }
        }, async () => deleteQuery.execute());
        
        return session;
      } catch (error) {
        captureException(error, {
          level: 'error',
          tags: {
            "error.type": "DatabaseOperationError",
          }
        });
        
        throw new DatabaseOperationError("Error deleting session", {
          cause: error
        });
      }
    })
  }

  async find(sessionId: string): Promise<Session | null> {
    return await startSpan({
      name: "SessionRepo -> find",
      op: "repository",
    }, async () => {
      const query = db.query.sessions.findFirst({
        where: (sessions, {eq}) => eq(sessions.id, sessionId)
      })
      
      const session = await startSpan({
        name: query.toSQL().sql,
        op: 'db.query',
        attributes: {
          "db.system": "postgres",
        }
      }, async () => query.execute());
   
       return session || null;
    })
  }
}