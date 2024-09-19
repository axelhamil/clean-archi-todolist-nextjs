import { startSpan } from "@sentry/nextjs";

import { validateSession } from "@/src/application/services/auth.service";
import { logoutUseCase } from "@/src/application/use-cases/logout.use-case";
import { Cookie } from "@/src/domains/auth/cookie";
import { InputParseError } from "@/src/shared/errors";

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
