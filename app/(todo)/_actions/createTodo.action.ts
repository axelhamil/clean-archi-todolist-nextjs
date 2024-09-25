"use server";
import {
  captureException,
  withServerActionInstrumentation,
} from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { SESSION_COOKIE } from "@/common/di";
import {
  createTodoController,
  CreateTodoInput,
} from "@/src/adapters/controllers/createTodo.controller";
import {
  ConflictError,
  InputParseError,
  UnauthorizedError,
} from "@/src/shared/errors";

export async function createTodoAction(input: CreateTodoInput) {
  return await withServerActionInstrumentation(
    "createTodoAction",
    { recordResponse: true },
    async () => {
      try {
        const sessionId = cookies().get(SESSION_COOKIE)?.value;
        await createTodoController(input, sessionId);
      } catch (error) {
        if (error instanceof InputParseError) return { error: error.message };
        if (error instanceof ConflictError) return { error: error.message };
        if (error instanceof UnauthorizedError)
          return { error: "Must be logged in to create a todo" };

        captureException(error);
        console.error(error);
        return { error: "Something went wrong" };
      }

      revalidatePath("/", "page");
      return { success: true };
    },
  );
}
