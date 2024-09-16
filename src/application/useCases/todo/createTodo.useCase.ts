import {Todo} from "@/src/domains/entities/todo";
import {getInjection} from "@/di";
import { startSpan } from "@sentry/nextjs";

export const createTodoUseCase = async (input: { todo: string}, userId: string): Promise<Todo> => {
  return startSpan({
    name: "createTodoUseCase",
    op: "use-case",
  }, async () => {
    const todoRepo = getInjection("ITodoRepo");
    
    const todo = await todoRepo.create({
      todo: input.todo,
      completed: false,
      userId,
    });
    
    return todo;
  })
}