import { injectable } from "inversify";

import { ITodoRepo } from "@/src/application/spi/todoRepo.spi";
import { Todo, TodoInsert } from "@/src/domains/entities/todo";

@injectable()
export class TodoRepoMock implements ITodoRepo {
  private _todos: Todo[] = [];

  async create(todo: TodoInsert): Promise<Todo> {
    const newTodo = {
      ...todo,
      createdAt: new Date(),
      id: this._todos.length.toString(),
      updatedAt: new Date(),
    };
    this._todos.push(newTodo);
    return newTodo;
  }

  async update(todo: Todo): Promise<Todo> {
    const index = this._todos.findIndex((t) => t.id === todo.id);
    if (index === -1) {
      throw new Error(`Todo with id ${todo.id} not found`);
    }
    this._todos[index] = todo;
    return todo;
  }

  async delete(id: string): Promise<string> {
    const index = this._todos.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Todo with id ${id} not found`);
    }
    const deletedTodo = this._todos[index];
    this._todos.splice(index, 1);
    return deletedTodo.id;
  }

  async findById(id: string): Promise<Todo | null> {
    return this._todos.find((t) => t.userId === id) || null;
  }

  async findAll(userId: string): Promise<Todo[]> {
    return this._todos.filter((t) => t.userId === userId);
  }
}
