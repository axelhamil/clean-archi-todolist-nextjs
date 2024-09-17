import { startSpan } from "@sentry/nextjs";
import { z } from "zod";

import { registerUseCase } from "@/src/application/useCases/auth/register.useCase";
import { InputParseError } from "@/src/domains/errors/common";

const inputSchema = z
  .object({
    confirm_password: z.string().min(6).max(31),
    email: z.string().email(),
    password: z.string().min(6).max(31),
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
export type RegisterInput = z.infer<typeof inputSchema>;

export async function registerController(
  input: Partial<z.infer<typeof inputSchema>>,
): Promise<ReturnType<typeof registerUseCase>> {
  return await startSpan({ name: "signUp Controller" }, async () => {
    const { data, error: inputParseError } = inputSchema.safeParse(input);

    if (inputParseError) {
      throw new InputParseError("Invalid data", { cause: inputParseError });
    }

    return await registerUseCase(data);
  });
}
