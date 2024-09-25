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
    <ul>
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="m-2 flex items-center justify-center gap-5"
        >
          <div className="flex w-1/4 items-center gap-5">
            <ToggleTodoForm completed={todo.completed} id={todo.id} />
            <Label
              htmlFor={`todo-${todo.id}`}
              className={cn(
                "text-md w-fit cursor-pointer hover:scale-105",
                todo.completed && "text-sm text-gray-400 line-through",
              )}
            >
              {todo.title}
            </Label>
          </div>
          <DeleteTodoForm id={todo.id} />
        </li>
      ))}
    </ul>
  );
}
