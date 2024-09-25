"use client";
import { Trash } from "lucide-react";
import { type ReactElement, useCallback } from "react";
import { toast } from "sonner";

import { deleteTodoAction } from "@/app/(todo)/_actions/deleteTodo.action";

interface IDeleteTodoFormProps {
  id: string;
}

export default function DeleteTodoForm({
  id,
}: IDeleteTodoFormProps): ReactElement {
  const handleDeleteTodo = useCallback(async (todoId: string) => {
    const result = await deleteTodoAction({ id: todoId });

    if (result.error) toast.error(result.error);
    if (result.success) toast.success("Todo deleted successfully");
  }, []);

  return (
    <Trash
      className="cursor-pointer hover:scale-110 hover:text-red-900"
      onClick={() => handleDeleteTodo(id)}
      color="red"
    />
  );
}
