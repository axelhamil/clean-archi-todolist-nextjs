"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { createTodoAction } from "@/app/(todo)/_actions/createTodo.action";
import { TodoCompleted, TodoPriority } from "@/src/domains/todo/todo.entity";

import { Button } from "../../_components/ui/button";

const formSchema = z.object({
  completed: z.nativeEnum(TodoCompleted),
  description: z.string().optional(),
  priority: z.nativeEnum(TodoPriority),
  title: z.string().min(1),
});

export default function CreateTodoForm(): ReactElement {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      completed: TodoCompleted.TODO,
      description: "",
      priority: TodoPriority.LOW,
      title: "",
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await createTodoAction(values);

    if (result.error) toast.error(result.error);
    else if (result.success) {
      toast.success("Todo created successfully");
      form.reset();
      form.clearErrors();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex h-28 items-center justify-center gap-2"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Todo</FormLabel>
              <div className={"flex gap-2"}>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <Button type="submit">
                  <Plus />
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
