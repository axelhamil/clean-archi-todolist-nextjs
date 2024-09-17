import { startSpan } from "@sentry/nextjs";

import { validateSession } from "@/src/application/services/authService";
import { logoutUseCase } from "@/src/application/useCases/auth/logout.useCase";
import { Cookie } from "@/src/domains/entities/cookie";
import { InputParseError } from "@/src/domains/errors/common";

export async function logoutController(
  sessionId: string | undefined,
): Promise<Cookie> {
  return await startSpan({ name: "logout Controller" }, async () => {
    if (!sessionId) {
      throw new InputParseError("Must provide a session ID");
    }
    const { session } = await validateSession(sessionId);

    const { blankCookie } = await logoutUseCase({
      sessionId: session.id,
    });
    return blankCookie;
  });
}
