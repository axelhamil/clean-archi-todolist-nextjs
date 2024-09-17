import { captureException, startSpan } from "@sentry/nextjs";
import { LogOut } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { logoutAction } from "@/app/(auth)/login/login.action";
import CreateTodoForm from "@/app/(todo)/createTodo.form";
import ListTodos from "@/app/(todo)/listTodos";
import Score from "@/app/(todo)/score";
import { SESSION_COOKIE } from "@/libs/di";
import { getTodosController } from "@/src/adapters/controllers/getTodos.controller";
import { Todo } from "@/src/domains/entities/todo";
import {
  AuthenticateError,
  UnauthorizedError,
} from "@/src/domains/errors/common";

const getTodos = async () => {
  return await startSpan(
    {
      name: "getTodos",
      op: "function.nextjs",
    },
    async () => {
      try {
        const sessionId = cookies().get(SESSION_COOKIE)?.value;
        return await getTodosController(sessionId);
      } catch (err) {
        if (
          err instanceof UnauthorizedError ||
          err instanceof AuthenticateError
        ) {
          redirect("/login");
        }
        captureException(err);
        throw err;
      }
    },
  );
};

const Home = async () => {
  let todos: Todo[];
  try {
    todos = await getTodos();
  } catch (error) {
    throw error;
  }
  return (
    <main className={"flex size-full items-center justify-center"}>
      <Score />
      <form className={"absolute left-5 top-2"} action={logoutAction}>
        <Button variant={"destructive"} type={"submit"}>
          <LogOut />
        </Button>
      </form>
      <Card>
        <CardHeader>
          <h1>Todo List</h1>
        </CardHeader>
        <CardContent>
          <CreateTodoForm />
        </CardContent>
        <CardContent>
          <ListTodos todos={todos} />
        </CardContent>
      </Card>
    </main>
  );
};

export default Home;
