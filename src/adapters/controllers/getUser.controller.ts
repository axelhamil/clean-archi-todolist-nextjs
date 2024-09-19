import { startSpan } from "@sentry/nextjs";

import { validateSession } from "@/src/application/services/auth.service";
import { getUserUseCase } from "@/src/application/use-cases/getUser.use-case";
import { User } from "@/src/domains/user/user.entity";
import { UnauthorizedError } from "@/src/shared/errors";

const presenter = (data: User) => {
  return startSpan(
    {
      name: "getUser presenter",
      op: "serialize",
    },
    () => ({
      createdAt: data?.createdAt ?? undefined,
      email: data.email,
      id: data.id,
      updatedAt: data?.updatedAt ?? undefined,
    }),
  );
};

export async function getUserController(
  sessionId: string | undefined,
): Promise<ReturnType<typeof presenter>> {
  if (!sessionId) throw new UnauthorizedError("Must be logged in");

  const { user } = await validateSession(sessionId);

  const result = await getUserUseCase({
    id: user.id,
  });

  return presenter(result);
}
