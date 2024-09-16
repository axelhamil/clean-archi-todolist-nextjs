import { DI_SYMBOLS } from "@/di/types";
import { Cookie } from "@/src/domains/entities/cookie";
import {Session} from "@/src/domains/entities/session";
import { UserWithoutPassword, User } from "@/src/domains/entities/user";
import { startSpan } from "@sentry/nextjs";
import {inject, injectable} from "inversify";
import {type IUserRepo} from "@/src/application/spi/userRepo.spi";
import {type ISessionRepo} from "@/src/application/spi/sessionRepo.spi";
import {NotFoundError} from "@/src/domains/errors/common";

@injectable()
export class AuthService {
  
  public constructor(
    @inject(DI_SYMBOLS.IUserRepo)
    private readonly userRepo: IUserRepo,
    @inject(DI_SYMBOLS.ISessionRepo)
    private readonly sessionRepo: ISessionRepo,
  ) {}
  
  
  async validateSession(sessionId: Session["id"]): Promise<{ user: UserWithoutPassword; session: Session; }> {
      return startSpan({
        name: "validateSession",
        op: "service",
      }, async () => {
        const session = await this.sessionRepo.find(sessionId);
        if (!session)
          throw new NotFoundError("Session not found");
        
        const user = await this.userRepo.findById(session.userId);
        if (!user) throw new NotFoundError("User not found");
        
        return { user, session };
      })
    }
    
  createSession(user: User): Promise<{ session: Session; cookie: Cookie; }> {
    return startSpan({
      name: "createSession",
      op: "service",
    }, async () => {
      const session = await this.sessionRepo.create(user.id);
      const cookie: Cookie = {
        name: "auth_cookie",
        value: `${session.id}_${user.id}`,
        attributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 1000 * 60 * 60 * 24 * 7,
          expires: session.expiresAt,
        },
      }
      
      return { session, cookie };
    })
  }
  
  invalidateSession(sessionId: Session["id"]): Promise<{ blankCookie: Cookie; }> {
    return startSpan({
      name: "invalidateSession",
      op: "service",
    }, async () => {
      const session = await this.sessionRepo.find(sessionId);
      if (!session)
        throw new NotFoundError("Session not found");
      
      await this.sessionRepo.delete(sessionId);
      
      const blankCookie: Cookie = {
        name: "auth_cookie",
        value: "",
        attributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 0,
          expires: new Date(0),
        },
      }
      
      return { blankCookie };
    })
  }
  
}