import { ISessionRepo } from "@/src/application/interfaces/sessionRepo.interface";
import { ITodoRepo } from "@/src/application/interfaces/todoRepo.interface";
import { IUserRepo } from "@/src/application/interfaces/userRepo.interface";

export const DI_SYMBOLS = {
  ISessionRepo: Symbol.for("ISessionRepo"),
  // Services
  // Repositories
  ITodoRepo: Symbol.for("ITodoRepo"),
  IUserRepo: Symbol.for("IUserRepo"),
};

export interface DI_RETURN_TYPES {
  // Services

  // Repositories
  ITodoRepo: ITodoRepo;
  IUserRepo: IUserRepo;
  ISessionRepo: ISessionRepo;
}
