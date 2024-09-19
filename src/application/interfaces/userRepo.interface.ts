import { User } from "@/src/domains/user/user.entity";

export interface IUserRepo {
  create: (input: { email: string; password: string }) => Promise<User>;
  update: (user: User) => Promise<User>;
  findByEmail: (email: string) => Promise<User | null>;
  findById: (id: string) => Promise<User | null>;
}
