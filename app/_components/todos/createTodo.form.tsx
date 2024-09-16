"use client";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/app/_components/ui/form";
import {createTodoAction} from "@/app/(todo)/todo.actions";
import { toast } from "sonner";
import {Input} from "@/app/_components/ui/input";
import { ReactElement } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

const formSchema = z.object({
  todo: z.string().min(1),
})

export default function CreateTodoForm(): ReactElement {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      todo: "",
    }
  });
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await createTodoAction(values);
    
    if(result.error)
      toast.error(result.error)
    else if (result.success)
      toast.success("Todo created successfully")
    
    form.reset()
    form.clearErrors()
  };
  
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex items-end gap-2"
      >
        <FormField
          control={form.control}
          name="todo"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Todo
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit"><Plus /></Button>
      </form>
    </Form>
  );
}