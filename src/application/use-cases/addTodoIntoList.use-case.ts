import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/common/di";
import { Todo } from "@/src/domains/todo/todo.entity";
import { addTodoIntoList } from "@/src/domains/todo/todo.service";

export type AddTodoIntoListUseCase = (input: {
  todoId: string;
  listId: string;
}) => Promise<Todo>;
export const addTodoIntoListUseCase: AddTodoIntoListUseCase = async (input) => {
  return await startSpan(
    {
      name: "addTodoIntoListUseCase",
      op: "use-case",
    },
    async () => {
      const todoRepo = getInjection("ITodoRepo");

      const todo = await todoRepo.findById(input.todoId);
      if (!todo) throw new Error("Todo not found");

      const updatedTodo = addTodoIntoList(todo, input.listId);

      await todoRepo.update(updatedTodo);

      return updatedTodo;
    },
  );
};
