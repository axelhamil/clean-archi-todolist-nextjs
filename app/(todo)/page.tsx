import {Todo} from "@/src/domains/entities/todo";
import CreateTodoForm from "@/app/_components/todos/createTodo.form";
import {Card, CardContent, CardHeader} from "@/app/_components/ui/card";
import { getTodosController } from "@/src/adapters/controllers/getTodos.controller";
import {captureException, startSpan } from "@sentry/nextjs";
import ListTodos from "@/app/_components/todos/listTodos";
import Score from "@/app/_components/score";

const getTodos = async () => {
  return await startSpan({
    name: "getTodos",
    op: "function.nextjs",
  }, async () => {
    try {
      return await getTodosController()
    } catch (err) {
      captureException(err);
      throw err;
    }
  })
}

const Home = async () => {
  let todos: Todo[]
  
  try {
    todos = await getTodos() || []
  } catch (error) {
    throw error
  }
  return (
    <main className={"size-full flex justify-center items-center"}>
      <Score />
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
}

export default Home;