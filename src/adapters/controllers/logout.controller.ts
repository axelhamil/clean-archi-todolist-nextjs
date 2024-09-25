import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/common/di";
import { logoutUseCase } from "@/src/application/use-cases/logout.use-case";
import { Cookie } from "@/src/domains/auth/cookie";
import { InputParseError } from "@/src/shared/errors";

export async function logoutController(
  sessionId: string | undefined,
): Promise<Cookie> {
  return await startSpan({ name: "logout Controller" }, async () => {
    if (!sessionId) throw new InputParseError("Must provide a session ID");
    const authService = getInjection("AuthService");
    const { session } = await authService.validateSession(sessionId);

    const { blankCookie } = await logoutUseCase({
      sessionId: session.id,
    });
    return blankCookie;
  });
}
