'use server';
import {createTodoController, CreateTodoInput} from "@/src/adapters/controllers/createTodo.controller";
import {ConflictError, InputParseError} from "@/src/domains/errors/common";
import {captureException, withServerActionInstrumentation } from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import {toggleTodoController, ToggleTodoInput} from "@/src/adapters/controllers/toggleTodo.controller";
import {deleteTodoController} from "@/src/adapters/controllers/deleteTodo.controller";

export async function createTodoAction(input: CreateTodoInput) {
  return await withServerActionInstrumentation(
    "createTodoAction",
    async () => {
      try {
        await createTodoController(input);
      } catch (error) {
        if (error instanceof InputParseError)
          return {error: error.message};
        if(error instanceof ConflictError)
          return {error: error.message};
        
        captureException(error);
        return {error: "Something went wrong"};
      }
  
      revalidatePath("/", "page")
      return {success: true};
    }
  );
}

export async function toggleTodoAction(input: ToggleTodoInput) {
  return await withServerActionInstrumentation(
    "toggleTodoAction",
    async () => {
      try {
        await toggleTodoController(input);
      } catch (error) {
        if (error instanceof InputParseError)
          return {error: error.message};
        if(error instanceof ConflictError)
          return {error: error.message};
        
        captureException(error);
        return {error: "Something went wrong"};
      }
  
      revalidatePath("/", "page")
      return {success: true};
    }
  );
}

export async function deleteTodoAction(input: {id: string}) {
  return await withServerActionInstrumentation(
    "deleteTodoAction",
    async () => {
      try {
        await deleteTodoController(input);
      } catch (error) {
        if (error instanceof InputParseError)
          return {error: error.message};
        if(error instanceof ConflictError)
          return {error: error.message};
        
        captureException(error);
        return {error: "Something went wrong"};
      }
  
      revalidatePath("/", "page")
      return {success: true};
    }
  );
}