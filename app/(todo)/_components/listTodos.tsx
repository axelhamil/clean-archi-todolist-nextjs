import { captureException, startSpan } from "@sentry/nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type ReactElement } from "react";

import { Label } from "@/app/_components/ui/label";
import { cn } from "@/app/_components/utils";
import DeleteTodoForm from "@/app/(todo)/_forms/deleteTodo.form";
import ToggleTodoForm from "@/app/(todo)/_forms/toggleTodo.form";
import { SESSION_COOKIE } from "@/common/di";
import { getTodosController } from "@/src/adapters/controllers/getTodos.controller";
import { AuthenticateError, UnauthorizedError } from "@/src/shared/errors";

const getTodos = async () => {
  return await startSpan(
    {
      name: "getTodos",
      op: "function.nextjs",
    },
    async () => {
      const sessionId = cookies().get(SESSION_COOKIE)?.value;
      try {
        return await getTodosController(sessionId);
      } catch (err) {
        if (
          err instanceof UnauthorizedError ||
          err instanceof AuthenticateError
        ) {
          redirect("/login");
        }
        captureException(err);
        console.error(err);
        throw err;
      }
    },
  );
};

export default async function ListTodos(): Promise<ReactElement> {
  const todos = await getTodos();

  return (
    <ul className="space-y-4">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex flex-col items-start gap-6 rounded-lg bg-white p-4 shadow-md transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Label
              htmlFor={`todo-${todo.id}`}
              className={cn(
                "cursor-pointer text-lg font-semibold",
                "hover:underline",
              )}
            >
              {todo.title}
            </Label>
            <div className="text-sm text-gray-500">{todo.description}</div>
            <div className="text-xs text-gray-400">{todo.priority}</div>
          </div>
          <div className="flex items-center gap-4">
            <ToggleTodoForm completed={todo.completed} id={todo.id} />
            <DeleteTodoForm id={todo.id} />
          </div>
        </li>
      ))}
    </ul>
  );
}
