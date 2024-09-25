import { randomUUID } from "node:crypto";

import { startSpan } from "@sentry/nextjs";
import bcrypt from "bcrypt";

import { User, UserInsert, userSchema } from "@/src/domains/user/user.entity";
import { userCreatedEventSchema } from "@/src/domains/user/user.event";
import { DomainError } from "@/src/shared/errors";
import { createDomainEvent } from "@/src/shared/events/domainEvent";

export type CreateUser = (input: UserInsert, id?: string) => Promise<User>;
export const createUser: CreateUser = async (input, id = randomUUID()) => {
  const userData = {
    email: input.email,
    id,
    password: await hashPassword(input.password),
  };

  const { data, error: inputParseError } = userSchema.safeParse(userData);

  if (inputParseError)
    throw new DomainError("Invalid data", {
      cause: inputParseError.errors,
    });

  createDomainEvent(data, userCreatedEventSchema);

  return data;
};

export type HashPassword = (password: string) => Promise<string>;
export const hashPassword: HashPassword = async (password) =>
  await startSpan(
    {
      name: "hashPassword",
      op: "function",
    },
    () => bcrypt.hash(password, 10),
  );

export type ComparePassword = (
  password: string,
  hash: string,
) => Promise<boolean>;
export const comparePassword: ComparePassword = async (password, hash) =>
  await startSpan(
    {
      name: "comparePassword",
      op: "function",
    },
    () => bcrypt.compare(password, hash),
  );
