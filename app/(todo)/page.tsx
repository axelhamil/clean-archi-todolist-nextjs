import { captureException, startSpan } from "@sentry/nextjs";
import { LogOut } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { logoutAction } from "@/app/(auth)/_actions/logout.action";
import ListTodos from "@/app/(todo)/_components/listTodos";
import CreateTodoForm from "@/app/(todo)/_forms/createTodo.form";
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
const Home = async () => {
  const todos = await getTodos();

  return (
    <main className={"flex size-full items-center justify-center"}>
      <form className={"absolute left-5 top-2"} action={logoutAction}>
        <Button variant={"destructive"} type={"submit"}>
          <LogOut />
        </Button>
      </form>
      <Card className={"h-1/2 w-2/4"}>
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
