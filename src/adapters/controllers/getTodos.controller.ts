import {getAllTodosUseCase} from "@/src/application/useCases/todo/getAllTodos.useCase";
import {Todo} from "@/src/domains/entities/todo";
import { startSpan } from "@sentry/nextjs";

const presenter = (data: Todo) => {
  return startSpan({
    name: "createTodo presenter",
    op: "serialize",
  }, () => ({
    id: data.id,
    todo: data.todo,
    completed: data.completed,
    userId: data.userId,
    createdAt: data?.createdAt ?? undefined,
    updatedAt: data?.updatedAt ?? undefined,
  }))
}

export const getTodosController = async () => {
  // check user is authenticated
  const userId = "one" // get user id from accessToken
  
  const result = await getAllTodosUseCase(userId)
  
  return result.map(presenter)
}