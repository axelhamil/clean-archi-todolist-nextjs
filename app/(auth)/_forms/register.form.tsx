"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { Separator } from "@/app/_components/ui/separator";
import { TypographyP } from "@/app/_components/ui/typographyP";
import { registerAction } from "@/app/(auth)/_actions/register.action";

const formSchema = z
  .object({
    confirm_password: z.string().min(6),
    email: z.string().email(),
    password: z.string().min(6),
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["password"],
      });
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export default function RegisterForm(): ReactElement {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      confirm_password: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await registerAction(values);

    if (result?.error) {
      form.setError("root", { message: result.error });
      return;
    } else {
      form.reset();
      form.clearErrors();
    }
  };

  const rootError = form.formState.errors.root?.message;
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mx-auto w-80 space-y-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="john@doe.com"
                  className="p-3"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  placeholder="********"
                  className="p-3"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  placeholder="********"
                  className="p-3"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {rootError && (
          <TypographyP className={"text-red-500"}>{rootError}</TypographyP>
        )}
        <Button
          type="submit"
          className="flex w-full items-center justify-center gap-2 py-3"
          disabled={isSubmitting}
        >
          <LogIn />
          Register
        </Button>
        <Separator orientation={"horizontal"} />
        <Button variant={"link"} asChild>
          <Link href={"/login"}>Already have an account? Login here</Link>
        </Button>
      </form>
    </Form>
  );
}
