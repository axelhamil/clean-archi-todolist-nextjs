"use client";
import { type ReactElement, useCallback } from "react";
import { toast } from "sonner";

import { Checkbox } from "@/app/_components/ui/checkbox";
import { toggleTodoAction } from "@/app/(todo)/_actions/toggleTodo.action";

interface IToggleTodoFormProps {
  id: string;
  completed: boolean;
}

export default function ToggleTodoForm({
  id,
  completed,
}: IToggleTodoFormProps): ReactElement {
  const handleCheckedChange = useCallback(async (id: string) => {
    const result = await toggleTodoAction({ id });

    if (result.error) toast.error(result.error);
    if (result.success) toast.success("Todo toggled successfully");
  }, []);
  return (
    <Checkbox
      id={`todo-${id}`}
      checked={completed}
      onCheckedChange={() => handleCheckedChange(id)}
      className="transition-all ease-in-out"
    />
  );
}
