import { randomUUID } from "node:crypto";

import bcrypt from "bcrypt";
import { injectable } from "inversify";

import { IUserRepo } from "@/src/application/spi/userRepo.spi";
import { User } from "@/src/domains/entities/user";

export const MOCK_USER_UUID = "bd0b35ad-d389-46ca-9cf4-0dcb3456c265";

@injectable()
export class UserRepoMock implements IUserRepo {
  private users: User[] = [];

  public constructor() {
    this.users = [
      {
        email: "john@doe.com",
        id: MOCK_USER_UUID,
        password: bcrypt.hashSync("password", 10),
        points: 0,
      },
    ];
  }

  async create(input: { email: string; password: string }): Promise<User> {
    const userExists = this.users.find((u) => u.email === input.email);
    if (userExists) throw new Error("User already exists");

    const newUser = {
      createdAt: new Date(),
      email: input.email,
      id: randomUUID(),
      password: input.password,
      points: 0,
      updatedAt: new Date(),
    };
    this.users.push(newUser);

    return newUser;
  }

  async update(user: User): Promise<User> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index === -1) throw new Error("User not found");

    this.users[index] = user;
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }
}
