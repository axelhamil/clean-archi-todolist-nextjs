import { ContainerModule, interfaces } from "inversify";

import { DI_SYMBOLS } from "@/libs/di/types";
import { SessionRepoImpl } from "@/src/adapters/repositories/sessionRepo.impl";
import { SessionRepoMock } from "@/src/adapters/repositories/sessionRepo.mock";
import { ISessionRepo } from "@/src/application/spi/sessionRepo.spi";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<ISessionRepo>(DI_SYMBOLS.ISessionRepo).to(SessionRepoMock);
  } else {
    bind<ISessionRepo>(DI_SYMBOLS.ISessionRepo).to(SessionRepoImpl);
  }
};

export const AuthModule = new ContainerModule(initializeModule);
