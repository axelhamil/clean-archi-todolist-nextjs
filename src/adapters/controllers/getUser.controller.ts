import { startSpan } from "@sentry/nextjs";

import { validateSession } from "@/src/application/services/authService";
import { getUserUseCase } from "@/src/application/useCases/user/getUser.useCase";
import { User } from "@/src/domains/entities/user";
import { UnauthorizedError } from "@/src/domains/errors/common";

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
      points: data.points,
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
