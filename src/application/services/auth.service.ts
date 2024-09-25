import { startSpan } from "@sentry/nextjs";
import { inject, injectable } from "inversify";

import { SESSION_COOKIE } from "@/common/di";
import { DI_SYMBOLS } from "@/common/di/types";
import { env } from "@/common/env";
import { type ISessionRepo } from "@/src/application/interfaces/sessionRepo.interface";
import { type IUserRepo } from "@/src/application/interfaces/userRepo.interface";
import { Cookie } from "@/src/domains/auth/cookie";
import { Session } from "@/src/domains/auth/session";
import { User, UserWithoutPassword } from "@/src/domains/user/user.entity";
import { AuthenticateError, UnauthorizedError } from "@/src/shared/errors";

@injectable()
export class AuthService {
  public constructor(
    @inject(DI_SYMBOLS.ISessionRepo)
    private readonly sessionRepo: ISessionRepo,
    @inject(DI_SYMBOLS.IUserRepo)
    private readonly userRepo: IUserRepo,
  ) {}

  public async validateSession(
    sessionId: Session["id"],
  ): Promise<{ user: UserWithoutPassword; session: Session }> {
    return startSpan(
      {
        name: "validateSession",
        op: "service",
      },
      async () => {
        const session = await this.sessionRepo.find(sessionId.split("_")[0]);
        if (!session) throw new AuthenticateError("Session not found");

        if (session.expiresAt < new Date()) {
          await this.invalidateSession(session.id);
          throw new UnauthorizedError("Session expired");
        }

        const user = await this.userRepo.findById(session.userId);
        if (!user) throw new AuthenticateError("User not found");

        return { session, user };
      },
    );
  }

  public async createSession(
    user: User,
  ): Promise<{ session: Session; cookie: Cookie }> {
    return startSpan(
      {
        name: "createSession",
        op: "service",
      },
      async () => {
        const oldSession = await this.sessionRepo.findByUserId(user.id);

        if (oldSession) await this.sessionRepo.delete(oldSession.id);

        const session = await this.sessionRepo.create(user.id);
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

  public async invalidateSession(
    sessionId: Session["id"],
  ): Promise<{ blankCookie: Cookie }> {
    return startSpan(
      {
        name: "invalidateSession",
        op: "service",
      },
      async () => {
        const session = await this.sessionRepo.find(sessionId);
        if (!session) throw new AuthenticateError("Session not found");

        await this.sessionRepo.delete(sessionId);

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
}
