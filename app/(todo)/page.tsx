import { LogOut } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { logoutAction } from "@/app/(auth)/_actions/logout.action";
import ListTodos from "@/app/(todo)/_components/listTodos";
import CreateTodoForm from "@/app/(todo)/_forms/createTodo.form";

function HomePage() {
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
          <ListTodos />
        </CardContent>
      </Card>
    </main>
  );
}

export default HomePage;
