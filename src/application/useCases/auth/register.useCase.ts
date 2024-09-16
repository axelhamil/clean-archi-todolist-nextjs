import {getInjection} from "@/di";
import { startSpan } from "@sentry/nextjs";
import {User, UserWithoutPassword} from "@/src/domains/entities/user";
import {Session} from "@/src/domains/entities/session";
import {Cookie} from "@/src/domains/entities/cookie";
import {ConflictError} from "@/src/domains/errors/common";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";

export const registerUseCase = async (input: { email: string, password: string }): Promise<{
  session: Session;
  cookie: Cookie;
  user: UserWithoutPassword
  
}> => {
  return await startSpan({
    name: "registerUseCase",
    op: "use-case",
  }, async () => {
    const userRepo = getInjection("IUserRepo");
    
    const userExits = await userRepo.findByEmail(input.email);
    if(!userExits) throw new ConflictError("User already exists");
    
    const passwordHash = await startSpan({
      name: "hashPassword",
      op: "function",
    }, () => bcrypt.hash(input.password, 10))
    
    const user: User = {
      id: randomUUID(),
      email: input.email,
      password: passwordHash,
    }
    
    const authService = getInjection("AuthService");
    
    const {cookie, session} = await authService.createSession(user);
    
    return { session, cookie, user };
  })
}