import { startSpan } from "@sentry/nextjs";
import bcrypt from "bcrypt";

import { getInjection } from "@/common/di";
import { createSession } from "@/src/application/services/auth.service";
import { Cookie } from "@/src/domains/auth/cookie";
import { Session } from "@/src/domains/auth/session";
import { UserWithoutPassword } from "@/src/domains/user/user.entity";
import { UnauthorizedError } from "@/src/shared/errors";

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
