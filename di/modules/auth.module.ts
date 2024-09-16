import { ContainerModule, interfaces } from "inversify";
import {DI_SYMBOLS} from "@/di/types";
import {AuthService} from "@/src/application/services/authService";
import {UserRepoImpl} from "@/src/adapters/repositories/userRepo.impl";
import {IUserRepo} from "@/src/application/spi/userRepo.spi";
import {ISessionRepo} from "@/src/application/spi/sessionRepo.spi";
import {SessionRepoImpl} from "@/src/adapters/repositories/sessionRepo.impl";
import {UserRepoMock} from "@/src/adapters/repositories/userRepo.mock";
import {SessionRepoMock} from "@/src/adapters/repositories/sessionRepo.mock";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<AuthService>(DI_SYMBOLS.AuthService).to(AuthService)
    bind<IUserRepo>(DI_SYMBOLS.IUserRepo).to(UserRepoMock);
    bind<ISessionRepo>(DI_SYMBOLS.ISessionRepo).to(SessionRepoMock);
  } else {
    bind<AuthService>(DI_SYMBOLS.AuthService).to(AuthService);
    bind<IUserRepo>(DI_SYMBOLS.IUserRepo).to(UserRepoImpl);
    bind<ISessionRepo>(DI_SYMBOLS.ISessionRepo).to(SessionRepoImpl);
  }
};

export const AuthModule = new ContainerModule(initializeModule);