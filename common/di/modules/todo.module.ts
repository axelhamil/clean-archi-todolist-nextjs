import { ContainerModule, interfaces } from "inversify";

import { DI_SYMBOLS } from "@/common/di/types";
import { TodoRepoImpl } from "@/src/adapters/repositories/todoRepo.impl";
import { TodoRepoMock } from "@/src/adapters/repositories/todoRepo.mock";
import { ITodoRepo } from "@/src/application/interfaces/todoRepo.interface";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<ITodoRepo>(DI_SYMBOLS.ITodoRepo).to(TodoRepoMock);
  } else {
    bind<ITodoRepo>(DI_SYMBOLS.ITodoRepo).to(TodoRepoImpl);
  }
};

export const TodoModule = new ContainerModule(initializeModule);
