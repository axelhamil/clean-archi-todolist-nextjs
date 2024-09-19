import { randomUUID } from "node:crypto";

import { startSpan } from "@sentry/nextjs";
import bcrypt from "bcrypt";

import { getInjection } from "@/common/di";
import { createSession } from "@/src/application/services/auth.service";
import { Cookie } from "@/src/domains/auth/cookie";
import { Session } from "@/src/domains/auth/session";
import { User, UserWithoutPassword } from "@/src/domains/user/user.entity";
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

      const passwordHash = await startSpan(
        {
          name: "hashPassword",
          op: "function",
        },
        () => bcrypt.hash(input.password, 10),
      );

      const user: User = {
        email: input.email,
        id: randomUUID(),
        password: passwordHash,
      };
      await userRepo.create(user);

      const { cookie, session } = await createSession(user);

      return { cookie, session, user };
    },
  );
};