import { startSpan } from "@sentry/nextjs";

import { invalidateSession } from "@/src/application/services/authService";
import { Cookie } from "@/src/domains/entities/cookie";

export const logoutUseCase = async (input: {
  sessionId: string;
}): Promise<{
  blankCookie: Cookie;
}> => {
  return startSpan(
    {
      name: "logoutUseCase",
      op: "use-case",
    },
    async () => {
      return await invalidateSession(input.sessionId);
    },
  );
};
