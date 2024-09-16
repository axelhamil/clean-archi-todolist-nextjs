import {z} from "zod"
import {InputParseError} from "@/src/domains/errors/common";
import {createTodoUseCase} from "@/src/application/useCases/createTodo.useCase";
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

const createTodoInputSchema = z.object({todo: z.string().min(1)})
export type CreateTodoInput = z.infer<typeof createTodoInputSchema>
export const createTodoController = async (input: CreateTodoInput) => {
  return await startSpan({
    name: "createTodo controller",
    op: "controller",
  }, async () => {
    // check user is authenticated
    const userId = "one" // get user id from accessToken
    
    const {data, error: inputParseError} = createTodoInputSchema.safeParse(input)
    
    if(inputParseError)
      throw new InputParseError("Invalid data", {cause: inputParseError.errors})
    
    const result = await createTodoUseCase(data, userId)
    
    return presenter(result)
  })
}