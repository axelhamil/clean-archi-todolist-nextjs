import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/libs/di";
import { winPointsSchema } from "@/src/domains/entities/user";
import { NotFoundError } from "@/src/domains/errors/common";

export const winPointsUseCase = async (input: {
  userId: string;
}): Promise<void> => {
  return startSpan(
    {
      name: "winPointsUseCase",
      op: "use-case",
    },
    async () => {
      const userRepo = getInjection("IUserRepo");

      const user = await userRepo.findById(input.userId);
      if (!user) throw new NotFoundError("User not found");

      const newUser = winPointsSchema(user, 10);

      await userRepo.update(newUser);
    },
  );
};
