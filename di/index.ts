import { Container } from "inversify";
import { DI_RETURN_TYPES, DI_SYMBOLS } from "@/di/types";
import {TodoModule} from "@/di/modules/todo.module";
import { UserModule } from "./modules/user.module";
import { AuthModule } from "./modules/auth.module";

const ApplicationContainer = new Container({
  defaultScope: "Singleton",
});

export const initializeContainer = () => {
  ApplicationContainer.load(TodoModule)
  ApplicationContainer.load(UserModule)
  ApplicationContainer.load(AuthModule)
};

export const destroyContainer = () => {
  ApplicationContainer.unload(TodoModule)
  ApplicationContainer.unload(UserModule)
  ApplicationContainer.unload(AuthModule)
};

if (process.env.NODE_ENV !== "test") {
  initializeContainer();
}

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
  symbol: K,
): DI_RETURN_TYPES[K] {
  return ApplicationContainer.get(DI_SYMBOLS[symbol],
  );
}