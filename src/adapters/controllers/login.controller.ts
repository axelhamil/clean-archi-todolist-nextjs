import { startSpan } from "@sentry/nextjs";
import { z } from "zod";

import { loginUseCase } from "@/src/application/useCases/auth/login.useCase";
import { Cookie } from "@/src/domains/entities/cookie";
import { InputParseError } from "@/src/domains/errors/common";

const inputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginInput = z.infer<typeof inputSchema>;
export const loginController = async (input: LoginInput): Promise<Cookie> => {
  return startSpan(
    {
      name: "loginController",
      op: "controller",
    },
    async () => {
      const { data, error: inputParseError } = inputSchema.safeParse(input);
      if (inputParseError)
        throw new InputParseError("Invalid data", {
          cause: inputParseError.errors,
        });

      const { cookie } = await loginUseCase(data);
      return cookie;
    },
  );
};
