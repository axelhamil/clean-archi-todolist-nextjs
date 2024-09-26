"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactElement, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/_components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { toggleTodoAction } from "@/app/(todo)/_actions/toggleTodo.action";
import { TodoCompleted } from "@/src/domains/todo/todo.entity";

interface IToggleTodoFormProps {
  id: string;
  completed?: TodoCompleted;
}

const formSchema = z.object({
  completed: z.nativeEnum(TodoCompleted),
});

export default function ToggleTodoForm({
  id,
  completed,
}: IToggleTodoFormProps): ReactElement {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      completed: completed ?? TodoCompleted.TODO,
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const result = await toggleTodoAction({
        completed: values.completed,
        id,
      });

      if (result.error) toast.error(result.error);
      if (result.success) toast.success("Todo toggled successfully");
    },
    [id],
  );

  return (
    <Form {...form}>
      <form className="flex h-28 items-center justify-center gap-2">
        <FormField
          control={form.control}
          name="completed"
          render={({ field }) => (
            <FormItem className={"w-36"}>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.handleSubmit(handleSubmit)();
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className={"flex justify-between"}>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(TodoCompleted).map((value) => (
                    <SelectItem key={value} value={value}>
                      {value.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
