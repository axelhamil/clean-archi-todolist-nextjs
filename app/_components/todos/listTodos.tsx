"use client";
import { useCallback, type ReactElement } from "react";
import { Todo } from "@/src/domains/entities/todo";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { deleteTodoAction, toggleTodoAction } from "@/app/(todo)/todo.actions";
import { Label } from "@/app/_components/ui/label";
import { cn } from "@/app/_components/utils";
import { toast } from "sonner";
import { Trash } from "lucide-react";

interface IListTodosProps {
  todos: Todo[];
}

export default function ListTodos({
  todos
}: IListTodosProps): ReactElement {
  
  const handleCheckedChange = useCallback(async (id: string) => {
    const result = await toggleTodoAction({ id });
    
    if (result.error)
      toast.error(result.error);
    if (result.success)
      toast.success("Todo toggled successfully");
  }, []);
  
  const handleDeleteTodo = useCallback(async (id: string) => {
    const result = await deleteTodoAction({ id });
    
    if (result.error)
      toast.error(result.error);
    if (result.success)
      toast.success("Todo deleted successfully");
  }, []);
  
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id} className="flex justify-between items-center gap-2 m-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onCheckedChange={() => handleCheckedChange(todo.id)}
            />
            <Label
              htmlFor={`todo-${todo.id}`}
              className={cn("w-fit", todo.completed && "line-through")}
            >
              {todo.todo}
            </Label>
          </div>
          <Trash
            className="cursor-pointer"
            onClick={() => handleDeleteTodo(todo.id)}
            color="red"
          />
        </li>
      ))}
    </ul>
  );
}
