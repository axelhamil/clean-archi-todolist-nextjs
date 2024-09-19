import { Session } from "@/src/domains/auth/session";

export interface ISessionRepo {
  create(userId: string): Promise<Session>;
  update(session: Session): Promise<Session>;
  delete(sessionId: string): Promise<Session>;
  find(sessionId: string): Promise<Session | null>;
  findByUserId(userId: string): Promise<Session | null>;
}
