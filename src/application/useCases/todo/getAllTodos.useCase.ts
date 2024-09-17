import { getInjection } from "@/libs/di";
import { Todo } from "@/src/domains/entities/todo";

export const getAllTodosUseCase = async (userId: string): Promise<Todo[]> => {
  const todoRepo = getInjection("ITodoRepo");

  const todos = await todoRepo.findAll(userId);

  return todos;
};
