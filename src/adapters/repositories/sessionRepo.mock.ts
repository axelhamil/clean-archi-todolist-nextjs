import { randomUUID } from "node:crypto";

import { injectable } from "inversify";

import { ISessionRepo } from "@/src/application/spi/sessionRepo.spi";
import { Session } from "@/src/domains/entities/session";

@injectable()
export class SessionRepoMock implements ISessionRepo {
  private sessions: Session[] = [];

  public constructor() {
    this.sessions = [];
  }

  async create(userId: string): Promise<Session> {
    const session = {
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      id: randomUUID(),
      userId,
    };

    this.sessions.push(session);
    return session;
  }

  async update(session: Session): Promise<Session> {
    const index = this.sessions.findIndex((s) => s.id === session.id);
    if (index === -1) {
      throw new Error("Session not found");
    }

    this.sessions[index] = session;
    return session;
  }

  async delete(sessionId: string): Promise<Session> {
    const session = this.sessions.find((session) => session.id === sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    this.sessions = this.sessions.filter((session) => session.id !== sessionId);
    return session;
  }

  async find(sessionId: string): Promise<Session | null> {
    return this.sessions.find((session) => session.id === sessionId) ?? null;
  }

  async findByUserId(userId: string): Promise<Session | null> {
    return this.sessions.find((session) => session.userId === userId) ?? null;
  }
}
