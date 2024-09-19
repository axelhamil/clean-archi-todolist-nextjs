import { injectable } from "inversify";

import { ITodoRepo } from "@/src/application/interfaces/todoRepo.interface";
import { Todo } from "@/src/domains/todo/todo.entity";

import { eventBus } from "../../shared/events";

@injectable()
export class TodoRepoMock implements ITodoRepo {
  private _todos: Todo[] = [];

  async create(todo: Todo): Promise<Todo> {
    const newTodo = {
      ...todo,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this._todos.push(newTodo);
    eventBus.dispatch(newTodo.id);
    return newTodo;
  }

  async update(todo: Todo): Promise<Todo> {
    const index = this._todos.findIndex((t) => t.id === todo.id);
    if (index === -1) {
      throw new Error(`Todo with id ${todo.id} not found`);
    }
    this._todos[index] = todo;
    eventBus.dispatch(todo.id);
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
