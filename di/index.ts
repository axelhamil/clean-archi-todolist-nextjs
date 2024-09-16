import { Container } from "inversify";
import { DI_RETURN_TYPES, DI_SYMBOLS } from "@/di/types";
import {TodoModule} from "@/di/modules/todo.module";

const ApplicationContainer = new Container({
  defaultScope: "Singleton",
});

export const initializeContainer = () => {
  ApplicationContainer.load(TodoModule)
};

export const destroyContainer = () => {
  ApplicationContainer.unload(TodoModule)
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