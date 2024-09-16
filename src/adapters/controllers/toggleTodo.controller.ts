import {z} from "zod"
import {InputParseError} from "@/src/domains/errors/common";
import {Todo} from "@/src/domains/entities/todo";
import { startSpan } from "@sentry/nextjs";
import {toggleTodoUseCase} from "@/src/application/useCases/toggleTodo.useCase";

const presenter = (data: Todo) => {
  return startSpan({
    name: "toggleTodo presenter",
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

const toggleTodoInputSchema = z.object({id: z.string().min(1)})
export type ToggleTodoInput = z.infer<typeof toggleTodoInputSchema>
export const toggleTodoController = async (input: ToggleTodoInput) => {
  return await startSpan({
    name: "toggleTodo controller",
    op: "controller",
  }, async () => {
    // check user is authenticated
    const userId = "one" // get user id from accessToken
    
    const {data, error: inputParseError} = toggleTodoInputSchema.safeParse(input)
    
    if(inputParseError)
      throw new InputParseError("Invalid data", {cause: inputParseError.errors})
    
    const result = await toggleTodoUseCase(data, userId)
    
    return presenter(result)
  })
}