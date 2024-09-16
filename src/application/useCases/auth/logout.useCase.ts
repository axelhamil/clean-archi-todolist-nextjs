import {getInjection} from "@/di";
import {Cookie} from "@/src/domains/entities/cookie";
import { startSpan } from "@sentry/nextjs";

export const logoutUseCase = async (input: { sessionId: string }): Promise<{
  blankCookie: Cookie;
}> => {
  return startSpan({
    name: "logoutUseCase",
    op: "use-case",
  }, async () => {
    const authService = getInjection("AuthService");
    
    return await authService.invalidateSession(input.sessionId);
  })
}