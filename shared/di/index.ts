import { Container } from "inversify";

import { TodoModule } from "@/shared/di/modules/todo.module";
import { DI_RETURN_TYPES, DI_SYMBOLS } from "@/shared/di/types";

import { AuthModule } from "./modules/auth.module";
import { UserModule } from "./modules/user.module";

export const SESSION_COOKIE = "session";

const ApplicationContainer = new Container({
  defaultScope: "Singleton",
});

export const initializeContainer = () => {
  ApplicationContainer.load(TodoModule);
  ApplicationContainer.load(UserModule);
  ApplicationContainer.load(AuthModule);
};

export const destroyContainer = () => {
  ApplicationContainer.unload(TodoModule);
  ApplicationContainer.unload(UserModule);
  ApplicationContainer.unload(AuthModule);
};

if (process.env.NODE_ENV !== "test") {
  initializeContainer();
}

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
  symbol: K,
): DI_RETURN_TYPES[K] {
  return ApplicationContainer.get(DI_SYMBOLS[symbol]);
}