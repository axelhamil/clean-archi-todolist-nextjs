import { ContainerModule, interfaces } from "inversify";
import {ITodoRepo} from "@/src/application/spi/todoRepo.spi";
import {DI_SYMBOLS} from "@/di/types";
import {TodoRepoMock} from "@/src/adapters/repositories/todoRepo.mock";
import {TodoRepoImpl} from "@/src/adapters/repositories/todoRepo.impl";

const initializeModule = (bind: interfaces.Bind) => {
  if (process.env.NODE_ENV === "test") {
    bind<ITodoRepo>(DI_SYMBOLS.ITodoRepo).to(TodoRepoMock);
  } else {
    bind<ITodoRepo>(DI_SYMBOLS.ITodoRepo).to(TodoRepoImpl);
  }
};

export const TodoModule = new ContainerModule(initializeModule);