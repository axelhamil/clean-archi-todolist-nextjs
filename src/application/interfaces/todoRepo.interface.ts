import { Todo } from "@/src/domains/todo/todo.entity";

export interface ITodoRepo {
  create(todo: Todo): Promise<Todo>;
  update(todo: Todo): Promise<Todo>;
  delete(id: string): Promise<string>;
  findById(id: string): Promise<Todo | null>;
  findAll(userId: string): Promise<Todo[]>;
}
