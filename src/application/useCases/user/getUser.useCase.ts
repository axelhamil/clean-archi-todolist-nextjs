import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/shared/di";
import { User } from "@/src/domains/entities/user";
import { NotFoundError } from "@/src/domains/errors/common";

export const getUserUseCase = async (input: { id: string }): Promise<User> => {
  return await startSpan(
    {
      name: "getUserUseCase",
      op: "use-case",
    },
    async () => {
      const userRepo = getInjection("IUserRepo");

      const user = await userRepo.findById(input.id);

      if (!user) throw new NotFoundError("User not found");

      return user;
    },
  );
};
