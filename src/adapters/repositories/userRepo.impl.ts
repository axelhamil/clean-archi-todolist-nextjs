import {IUserRepo} from "@/src/application/spi/userRepo.spi";
import { injectable } from "inversify";
import {users} from "@/drizzle/schemas";
import {captureException, startSpan } from "@sentry/nextjs";
import { db } from "@/drizzle";
import {User, UserWithoutPassword} from "@/src/domains/entities/user";
import {DatabaseOperationError} from "@/src/domains/errors/common";

@injectable()
export class UserRepoImpl implements IUserRepo {
  async create(input: {
    email: string;
    password: string;
  }): Promise<UserWithoutPassword> {
    return await startSpan({
      name: 'AuthRepo -> create',
      op: "repository",
    }, async () => {
      try {
        const userExistsquery = db.query.users.findFirst({
          where: (users, {eq}) => eq(users.email, input.email)
        })
        const insertUserquery = db.insert(users).values(input).returning();
        
        const userExists = await startSpan({
          name: userExistsquery.toSQL().sql,
          op: 'db.query',
          attributes: {
            "db.system": "postgres",
          }
        }, async () => userExistsquery.execute());
        
        if (userExists)
          throw new DatabaseOperationError("User already exists");
        
        const [created] = await startSpan({
          name: insertUserquery.toSQL().sql,
          op: 'db.query',
          attributes: {
            "db.system": "postgres",
          }
        }, async () => insertUserquery.execute());
        
        return created
      } catch (error) {
        captureException(error, {
          level: 'error',
          tags: {
            "error.type": "DatabaseOperationError",
          }
        });
        
        throw new DatabaseOperationError("Error creating user", {
          cause: error
        });
      }
    })
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return await startSpan({
      name: 'AuthRepo -> findByEmail',
      op: "repository",
    }, async () => {
      try {
        const query = db.query.users.findFirst({
          where: (users, {eq}) => eq(users.email, email),
        });
        
        const user = await startSpan({
          name: query.toSQL().sql,
          op: 'db.query',
          attributes: {
            "db.system": "postgres",
          }
        }, async () => query.execute());
        
        return user || null;
      } catch (error) {
        captureException(error, {
          level: 'error',
          tags: {
            "error.type": "DatabaseOperationError",
          }
        });
        
        throw new DatabaseOperationError("Error finding user", {
          cause: error
        });
      }
    })
  }
  
  async findById(id: string): Promise<User | null> {
    return await startSpan({
      name: 'AuthRepo -> findById',
      op: "repository",
    }, async () => {
      try {
        const query = db.query.users.findFirst({
          where: (users, {eq}) => eq(users.id, id),
        })
        
        const user = await startSpan({
          name: query.toSQL().sql,
          op: 'db.query',
          attributes: {
            "db.system": "postgres",
          }
        }, async () => query.execute());
        
        return user || null;
      } catch (error) {
        captureException(error, {
          level: 'error',
          tags: {
            "error.type": "DatabaseOperationError",
          }
        });
        
        throw new DatabaseOperationError("Error finding user", {
          cause: error
        });
      }
    })
  }
}
