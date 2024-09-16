import { startSpan } from "@sentry/nextjs";
import {getInjection} from "@/di";
import {NotFoundError, UnauthorizedError} from "@/src/domains/errors/common";
import {Todo} from "@/src/domains/entities/todo";

export const toggleTodoUseCase = async (input: { id: string }, userId: string): Promise<Todo> => {
  return await startSpan({
    name: "toggleTodoUseCase",
    op: "use-case",
  }, async () => {
    const todoRepo = getInjection("ITodoRepo");
    
    const todo = await todoRepo.findById(input.id);
    
    if(!todo) throw new NotFoundError("Todo not found");
    
    if(todo.userId !== userId) throw new UnauthorizedError("Cannot toggle todo, because: unauthorized");
    
    const updatedTodo = await todoRepo.update({
      ...todo,
      completed: !todo.completed
    });
    
    return updatedTodo;
  })
  
}