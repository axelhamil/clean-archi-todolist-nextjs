import {ITodoRepo} from "@/src/application/spi/todoRepo.spi";
import {IUserRepo} from "@/src/application/spi/userRepo.spi";
import {ISessionRepo} from "@/src/application/spi/sessionRepo.spi";
import {AuthService} from "@/src/application/services/authService";

export const DI_SYMBOLS = {
  // Services
  AuthService: Symbol.for("AuthService"),
  
  // Repositories
  ITodoRepo: Symbol.for("ITodoRepo"),
  IUserRepo: Symbol.for("IUserRepo"),
  ISessionRepo: Symbol.for("ISessionRepo"),
};

export interface DI_RETURN_TYPES {
  // Services
  AuthService: AuthService;
  
  // Repositories
  ITodoRepo: ITodoRepo;
  IUserRepo: IUserRepo;
  ISessionRepo: ISessionRepo;
}