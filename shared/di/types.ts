import { ISessionRepo } from "@/src/application/spi/sessionRepo.spi";
import { ITodoRepo } from "@/src/application/spi/todoRepo.spi";
import { IUserRepo } from "@/src/application/spi/userRepo.spi";

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
