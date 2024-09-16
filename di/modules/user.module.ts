import { ContainerModule, interfaces } from "inversify";
import {DI_SYMBOLS} from "@/di/types";
import {IUserRepo} from "@/src/application/spi/userRepo.spi";
import {UserRepoMock} from "@/src/adapters/repositories/userRepo.mock";
import { UserRepoImpl } from "@/src/adapters/repositories/userRepo.impl";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IUserRepo>(DI_SYMBOLS.IUserRepo).to(UserRepoMock);
  } else {
    bind<IUserRepo>(DI_SYMBOLS.IUserRepo).to(UserRepoImpl);
  }
};

export const UserModule = new ContainerModule(initializeModule);