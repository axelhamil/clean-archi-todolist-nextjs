import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/common/di";
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
      const authService = getInjection("AuthService");
      return await authService.invalidateSession(input.sessionId);
    },
  );
};
