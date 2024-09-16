import {Todo, TodoInsert} from "@/src/domains/entities/todo";

export interface ITodoRepo {
  create(todo: TodoInsert): Promise<Todo>;
  update(todo: Todo): Promise<Todo>;
  delete(id: string): Promise<string>;
  findById(id: string): Promise<Todo | null>;
  findAll(userId: string): Promise<Todo[]>;
}