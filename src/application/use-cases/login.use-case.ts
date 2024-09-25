import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/common/di";
import { Cookie } from "@/src/domains/auth/cookie";
import { Session } from "@/src/domains/auth/session";
import { UserWithoutPassword } from "@/src/domains/user/user.entity";
import { comparePassword } from "@/src/domains/user/user.service";
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

      const passwordMatch = await comparePassword(
        input.password,
        user.password,
      );
      if (!passwordMatch) throw new UnauthorizedError("User not found");

      const authService = getInjection("AuthService");
      const { session, cookie } = await authService.createSession(user);

      return {
        cookie,
        session,
        user,
      };
    },
  );
};
