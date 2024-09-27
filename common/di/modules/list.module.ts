import { ContainerModule, interfaces } from "inversify";

import { DI_SYMBOLS } from "@/common/di/types";
import { ListRepoImpl } from "@/src/adapters/repositories/listRepo.impl";
import { ListRepoMock } from "@/src/adapters/repositories/listRepo.mock";
import { IListRepo } from "@/src/application/interfaces/listRepo.interface";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<IListRepo>(DI_SYMBOLS.IListRepo).to(ListRepoMock);
  } else {
    bind<IListRepo>(DI_SYMBOLS.IListRepo).to(ListRepoImpl);
  }
};

export const ListModule = new ContainerModule(initializeModule);
