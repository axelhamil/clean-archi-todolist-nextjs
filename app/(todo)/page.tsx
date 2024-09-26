import { LogOut } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { logoutAction } from "@/app/(auth)/_actions/logout.action";
import ListTodos from "@/app/(todo)/_components/listTodos";
import CreateTodoForm from "@/app/(todo)/_forms/createTodo.form";

function HomePage() {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <form className="absolute left-5 top-2" action={logoutAction}>
        <Button variant="destructive" type="submit">
          <LogOut />
        </Button>
      </form>
      <Card className="h-3/4 w-full max-w-3xl p-4 sm:h-2/3">
        <CardHeader>
          <h1 className="text-xl font-bold">Todo List</h1>
        </CardHeader>
        <CardContent>
          <CreateTodoForm />
        </CardContent>
        <CardContent className="h-3/4 overflow-y-auto">
          <ListTodos />
        </CardContent>
      </Card>
    </main>
  );
}

export default HomePage;
