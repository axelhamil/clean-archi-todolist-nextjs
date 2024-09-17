import { startSpan } from "@sentry/nextjs";

import { getInjection, SESSION_COOKIE } from "@/libs/di";
import { env } from "@/libs/env";
import { Cookie } from "@/src/domains/entities/cookie";
import { Session } from "@/src/domains/entities/session";
import { User, UserWithoutPassword } from "@/src/domains/entities/user";
import { AuthenticateError } from "@/src/domains/errors/common";

export async function validateSession(
  sessionId: Session["id"],
): Promise<{ user: UserWithoutPassword; session: Session }> {
  return startSpan(
    {
      name: "validateSession",
      op: "service",
    },
    async () => {
      const sessionRepo = getInjection("ISessionRepo");
      const session = await sessionRepo.find(sessionId.split("_")[0]);
      if (!session) throw new AuthenticateError("Session not found");

      const userRepo = getInjection("IUserRepo");
      const user = await userRepo.findById(session.userId);
      if (!user) throw new AuthenticateError("User not found");

      return { session, user };
    },
  );
}

export async function createSession(
  user: User,
): Promise<{ session: Session; cookie: Cookie }> {
  return startSpan(
    {
      name: "createSession",
      op: "service",
    },
    async () => {
      const sessionRepo = getInjection("ISessionRepo");
      const oldSession = await sessionRepo.findByUserId(user.id);

      if (oldSession) await sessionRepo.delete(oldSession.id);

      const session = await sessionRepo.create(user.id);
      const cookie: Cookie = {
        attributes: {
          expires: session.expiresAt,
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7,
          sameSite: "strict",
          secure: env.NODE_ENV === "production",
        },
        name: SESSION_COOKIE,
        value: `${session.id}_${user.id}`,
      };

      return { cookie, session };
    },
  );
}

export async function invalidateSession(
  sessionId: Session["id"],
): Promise<{ blankCookie: Cookie }> {
  return startSpan(
    {
      name: "invalidateSession",
      op: "service",
    },
    async () => {
      const sessionRepo = getInjection("ISessionRepo");
      const session = await sessionRepo.find(sessionId);
      if (!session) throw new AuthenticateError("Session not found");

      await sessionRepo.delete(sessionId);

      const blankCookie: Cookie = {
        attributes: {
          expires: new Date(0),
          httpOnly: true,
          maxAge: 0,
          sameSite: "strict",
          secure: env.NODE_ENV === "production",
        },
        name: SESSION_COOKIE,
        value: "",
      };

      return { blankCookie };
    },
  );
}
