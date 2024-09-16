import {IUserRepo} from "@/src/application/spi/userRepo.spi";
import {User, UserWithoutPassword} from "@/src/domains/entities/user";
import {randomUUID} from "node:crypto";
import {injectable} from "inversify";
import bcrypt from "bcrypt";

export const MOCK_USER_UUID = "bd0b35ad-d389-46ca-9cf4-0dcb3456c265";

@injectable()
export class UserRepoMock implements IUserRepo {
  private users: User[] = [];
  
  public constructor() {
    this.users = [{
      id: MOCK_USER_UUID,
      email: "john@doe.com",
      password: bcrypt.hashSync("password", 10),
    }];
  }
  
  async create(input: {
    email: string;
    password: string;
  }): Promise<UserWithoutPassword> {
    const userExists = this.users.find(u => u.email === input.email);
    if (userExists)
      throw new Error("User already exists");
  
    const newUser = {
      id: randomUUID(),
      email: input.email,
      password: input.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.push(newUser);
    return newUser;
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }
  
  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }
}