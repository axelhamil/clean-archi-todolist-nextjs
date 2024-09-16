import {Todo} from "@/src/domains/entities/todo";
import {getInjection} from "@/di";

export const getAllTodosUseCase = async (userId: string): Promise<Todo[]> => {
  const todoRepo = getInjection("ITodoRepo");

  const todos = await todoRepo.findAll(userId);

  return todos;
}
