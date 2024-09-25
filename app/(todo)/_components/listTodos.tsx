"use client";
import { type ReactElement } from "react";

import { Label } from "@/app/_components/ui/label";
import { cn } from "@/app/_components/utils";
import DeleteTodoForm from "@/app/(todo)/_forms/deleteTodo.form";
import ToggleTodoForm from "@/app/(todo)/_forms/toggleTodo.form";
import { Todo } from "@/src/domains/todo/todo.entity";

interface IListTodosProps {
  todos: Todo[];
}

export default function ListTodos({ todos }: IListTodosProps): ReactElement {
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
              {todo.todo}
            </Label>
          </div>
          <DeleteTodoForm id={todo.id} />
        </li>
      ))}
    </ul>
  );
}
