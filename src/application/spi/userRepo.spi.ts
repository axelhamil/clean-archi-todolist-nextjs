import {User, UserWithoutPassword} from "@/src/domains/entities/user";

export interface IUserRepo {
  create: (input: { email: string, password: string }) => Promise<UserWithoutPassword>;
  findByEmail: (email: string) => Promise<User | null>;
  findById: (id: string) => Promise<User| null>;
}