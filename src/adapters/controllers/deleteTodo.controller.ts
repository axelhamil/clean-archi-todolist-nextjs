import {z} from "zod"
import {InputParseError} from "@/src/domains/errors/common";
import { startSpan } from "@sentry/nextjs";
import { deleteTodoUseCase } from "@/src/application/useCases/todo/deleteTodo.useCase";

const presenter = (data: string) => {
  return startSpan({
    name: "deleteTodo presenter",
    op: "serialize",
  }, () => ({
    id: data,
  }))
}

const deleteTodoInputSchema = z.object({id: z.string().min(1)})
export type DeleteTodoInput = z.infer<typeof deleteTodoInputSchema>
export const deleteTodoController = async (input: DeleteTodoInput) => {
  return await startSpan({
    name: "toggleTodo controller",
    op: "controller",
  }, async () => {
    // check user is authenticated
    const userId = "one" // get user id from accessToken
    
    const {data, error: inputParseError} = deleteTodoInputSchema.safeParse(input)
    
    if(inputParseError)
      throw new InputParseError("Invalid data", {cause: inputParseError.errors})
    
    const result = await deleteTodoUseCase(data, userId)
    
    return presenter(result)
  })
}