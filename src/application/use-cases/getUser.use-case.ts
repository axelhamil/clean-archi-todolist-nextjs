import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/common/di";
import { User } from "@/src/domains/user/user.entity";
import { NotFoundError } from "@/src/shared/errors";

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
