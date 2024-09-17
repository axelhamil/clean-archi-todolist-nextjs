import { startSpan } from "@sentry/nextjs";
import bcrypt from "bcrypt";

import { getInjection } from "@/shared/di";
import { createSession } from "@/src/application/services/authService";
import { Cookie } from "@/src/domains/entities/cookie";
import { Session } from "@/src/domains/entities/session";
import { UserWithoutPassword } from "@/src/domains/entities/user";
import { UnauthorizedError } from "@/src/domains/errors/common";

export const loginUseCase = async (input: {
  email: string;
  password: string;
}): Promise<{
  session: Session;
  cookie: Cookie;
  user: UserWithoutPassword;
}> => {
  return startSpan(
    {
      name: "loginUseCase",
      op: "use-case",
    },
    async () => {
      const userRepo = getInjection("IUserRepo");

      const user = await userRepo.findByEmail(input.email);
      if (!user) throw new UnauthorizedError("User not found");

      const passwordMatch = await startSpan(
        {
          name: "comparePassword",
          op: "function",
        },
        () => bcrypt.compare(input.password, user.password),
      );
      if (!passwordMatch) throw new UnauthorizedError("User not found");

      return {
        ...(await createSession(user)),
        user,
      };
    },
  );
};
