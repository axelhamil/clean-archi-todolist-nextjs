"use client";
import { Trash } from "lucide-react";
import { type ReactElement, useCallback } from "react";
import { toast } from "sonner";

import { Checkbox } from "@/app/_components/ui/checkbox";
import { Label } from "@/app/_components/ui/label";
import { cn } from "@/app/_components/utils";
import { deleteTodoAction, toggleTodoAction } from "@/app/(todo)/todo.action";
import { Todo } from "@/src/domains/todo/todo.entity";

interface IListTodosProps {
  todos: Todo[];
}

export default function ListTodos({ todos }: IListTodosProps): ReactElement {
  const handleCheckedChange = useCallback(async (id: string) => {
    const result = await toggleTodoAction({ id });

    if (result.error) toast.error(result.error);
    if (result.success) toast.success("Todo toggled successfully");
  }, []);

  const handleDeleteTodo = useCallback(async (id: string) => {
    const result = await deleteTodoAction({ id });

    if (result.error) toast.error(result.error);
    if (result.success) toast.success("Todo deleted successfully");
  }, []);

  return (
    <ul>
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="m-2 flex items-center justify-center gap-5"
        >
          <div className="flex w-1/4 items-center gap-5">
            <Checkbox
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onCheckedChange={() => handleCheckedChange(todo.id)}
              className="transition-all ease-in-out"
            />
            <Label
              htmlFor={`todo-${todo.id}`}
              className={cn(
                "text-md w-fit cursor-pointer transition-all ease-in-out",
                "hover:scale-105",
                todo.completed && "text-sm text-gray-400 line-through",
              )}
            >
              {todo.todo}
            </Label>
          </div>
          <Trash
            className="cursor-pointer transition-all ease-in-out hover:scale-110 hover:text-red-900"
            onClick={() => handleDeleteTodo(todo.id)}
            color="red"
          />
        </li>
      ))}
    </ul>
  );
}
