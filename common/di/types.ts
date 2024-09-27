import { IListRepo } from "@/src/application/interfaces/listRepo.interface";
import { ISessionRepo } from "@/src/application/interfaces/sessionRepo.interface";
import { ITodoRepo } from "@/src/application/interfaces/todoRepo.interface";
import { IUserRepo } from "@/src/application/interfaces/userRepo.interface";
import { AuthService } from "@/src/application/services/auth.service";

export const DI_SYMBOLS = {
  // Services
  AuthService: Symbol.for("AuthService"),

  // Repositories
  IListRepo: Symbol.for("IListRepo"),
  ISessionRepo: Symbol.for("ISessionRepo"),
  ITodoRepo: Symbol.for("ITodoRepo"),
  IUserRepo: Symbol.for("IUserRepo"),
};

export interface DI_RETURN_TYPES {
  // Services
  AuthService: AuthService;

  // Repositories
  IListRepo: IListRepo;
  ITodoRepo: ITodoRepo;
  IUserRepo: IUserRepo;
  ISessionRepo: ISessionRepo;
}
