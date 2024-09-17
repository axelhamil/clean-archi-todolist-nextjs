import { User } from "@/src/domains/entities/user";

export interface IUserRepo {
  create: (input: { email: string; password: string }) => Promise<User>;
  update: (user: User) => Promise<User>;
  findByEmail: (email: string) => Promise<User | null>;
  findById: (id: string) => Promise<User | null>;
}
