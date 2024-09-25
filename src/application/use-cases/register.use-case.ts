import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/common/di";
import { Cookie } from "@/src/domains/auth/cookie";
import { Session } from "@/src/domains/auth/session";
import { UserWithoutPassword } from "@/src/domains/user/user.entity";
import { createUser } from "@/src/domains/user/user.service";
import { AuthenticateError } from "@/src/shared/errors";

export const registerUseCase = async (input: {
  email: string;
  password: string;
}): Promise<{
  session: Session;
  cookie: Cookie;
  user: UserWithoutPassword;
}> => {
  return await startSpan(
    {
      name: "registerUseCase",
      op: "use-case",
    },
    async () => {
      const userRepo = getInjection("IUserRepo");

      const userExits = await userRepo.findByEmail(input.email);
      if (userExits) throw new AuthenticateError("User already exists");

      const user = await createUser({
        email: input.email,
        password: input.password,
      });

      await userRepo.create(user);

      const authService = getInjection("AuthService");
      const { cookie, session } = await authService.createSession(user);

      return { cookie, session, user };
    },
  );
};
