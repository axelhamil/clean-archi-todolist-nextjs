import { cookies } from "next/headers";

import { getTodosController } from "@/src/adapters/controllers/getTodos.controller";

const getTodosList = async () => {
  const token = cookies.get("token").value;
  try {
    const todos = getTodosController(token);
  } catch (error) {
    console.error(error);
  }
};

function HomePage() {
  return (
    <section className="flex size-full items-center justify-center">
      PAGE CONTENT
      {/*<Card className="h-3/4 w-full max-w-3xl p-4 sm:h-2/3">
        <CardHeader>
          <h1 className="text-xl font-bold">Todo List</h1>
        </CardHeader>
        <CardContent>
          <CreateTodoForm />
        </CardContent>
        <CardContent className="h-3/4 overflow-y-auto">
          <ListTodos />
        </CardContent>
      </Card>*/}
    </section>
  );
}

export default HomePage;
