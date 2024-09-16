import {ITodoRepo} from "@/src/application/spi/todoRepo.spi";

export const DI_SYMBOLS = {
  // Services
  
  // Repositories
  ITodoRepo: Symbol.for("ITodoRepo"),
};

export interface DI_RETURN_TYPES {
  // Services
  
  // Repositories
  ITodoRepo: ITodoRepo;
}