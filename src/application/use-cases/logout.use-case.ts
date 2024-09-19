import { startSpan } from "@sentry/nextjs";

import { invalidateSession } from "@/src/application/services/auth.service";
import { Cookie } from "@/src/domains/auth/cookie";

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
