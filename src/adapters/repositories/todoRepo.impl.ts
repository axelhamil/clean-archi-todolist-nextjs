import {ITodoRepo} from "@/src/application/spi/todoRepo.spi";
import {Todo, TodoInsert} from "@/src/domains/entities/todo";
import {db} from "@/drizzle";
import {todos} from "@/drizzle/schemas";
import {injectable} from "inversify";
import { eq } from "drizzle-orm";
import {captureException, startSpan } from "@sentry/nextjs";
import {DatabaseOperationError} from "@/src/domains/errors/common";

@injectable()
export class TodoRepoImpl implements ITodoRepo {
  async create(todo: TodoInsert): Promise<Todo> {
    return await startSpan({
      name: 'TodoRepo -> create',
      op: "repository",
    }, async () => {
      try {
      const query = db.insert(todos).values(todo).returning();
      
      const [created] = await startSpan({
        name: query.toSQL().sql,
        op: 'db.query',
        attributes: {
          "db.system": "postgres",
        }
      }, async () => query.execute());
      
      return created
      } catch (error) {
        captureException(error, {
          level: 'error',
          tags: {
            "error.type": "DatabaseOperationError",
          }
        });
        
        throw new DatabaseOperationError("Error creating todo", {
          cause: error
        });
      }
    })
  }
  
  async update(todo: Todo): Promise<Todo> {
    return await startSpan({
      name: 'TodoRepo -> update',
      op: "repository",
    }, async () => {
      try {
      const query = db.update(todos).set(todo).where(eq(todos.id, todo.id)).returning();
      
      const [updated] = await startSpan({
        name: query.toSQL().sql,
        op: 'db.query',
        attributes: {
          "db.system": "postgres",
        }
      }, async () => query.execute());
      
      return updated;
      } catch (error) {
        captureException(error, {
          level: 'error',
          tags: {
            "error.type": "DatabaseOperationError",
          }
        });
        
        throw new DatabaseOperationError("Error updating todo", {
          cause: error
        });
      }
    })
  }
  
  async delete(id: string): Promise<string> {
    return await startSpan({
      name: 'TodoRepo -> delete',
      op: "repository",
    }, async () => {
      try {
      const query = db.delete(todos).where(eq(todos.id, id)).returning({
        id: todos.id
      });
      
      const [deleted] = await startSpan({
        name: query.toSQL().sql,
        op: 'db.query',
        attributes: {
          "db.system": "postgres",
        }
      }, async () => query.execute());
      
      return deleted.id;
      } catch (error) {
        captureException(error, {
          level: 'error',
          tags: {
            "error.type": "DatabaseOperationError",
          }
        });
        
        throw new DatabaseOperationError("Error deleting todo", {
          cause: error
        });
      }
    })
  }
  
  async findById(id: string): Promise<Todo | null> {
    return await startSpan({
      name: 'TodoRepo -> findById',
      op: "repository",
    }, async () => {
      const query = db.query.todos.findFirst({
        where: (todos, {eq}) => eq(todos.id, id)
      })
      
      const todo = await startSpan({
        name: query.toSQL().sql,
        op: 'db.query',
        attributes: {
          "db.system": "postgres",
        }
      }, async () => query.execute());
   
       return todo || null;
    })
  }

  async findAll(userId: string): Promise<Todo[]> {
    return await startSpan({
      name: 'TodoRepo -> findAll',
      op: "repository",
    }, async () => {
      try {
      const query = db.query.todos.findMany({
        where: (todos, {eq}) => eq(todos.userId, userId)
      })
      
      const todos = await startSpan({
        name: query.toSQL().sql,
        op: 'db.query',
        attributes: {
          "db.system": "postgres",
        }
      }, async () => query.execute());
   
       return todos || [];
      } catch (error) {
        captureException(error, {
          level: 'error',
          tags: {
            "error.type": "DatabaseOperationError",
          }
        });
        
        throw new DatabaseOperationError("Error fetching todos", {
          cause: error
        });
      }
    })
  }
}