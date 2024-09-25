import { ContainerModule, interfaces } from "inversify";

import { DI_SYMBOLS } from "@/common/di/types";
import { SessionRepoImpl } from "@/src/adapters/repositories/sessionRepo.impl";
import { SessionRepoMock } from "@/src/adapters/repositories/sessionRepo.mock";
import { ISessionRepo } from "@/src/application/interfaces/sessionRepo.interface";
import { AuthService } from "@/src/application/services/auth.service";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<ISessionRepo>(DI_SYMBOLS.ISessionRepo).to(SessionRepoMock);
    bind<AuthService>(DI_SYMBOLS.AuthService).to(AuthService);
  } else {
    bind<ISessionRepo>(DI_SYMBOLS.ISessionRepo).to(SessionRepoImpl);
    bind<AuthService>(DI_SYMBOLS.AuthService).to(AuthService);
  }
};

export const AuthModule = new ContainerModule(initializeModule);
