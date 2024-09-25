import {
  TodoCompletedEvent,
  TodoCreatedEvent,
} from "@/src/domains/todo/todo.event";
import { UserCreatedEvent } from "@/src/domains/user/user.event";
import { EventBus } from "@/src/shared/events/eventBus";

export const eventBus = EventBus.getInstance([
  ["TODO_CREATED", (event: TodoCreatedEvent) => console.log(event)],
  ["TODO_COMPLETED", (event: TodoCompletedEvent) => console.log(event)],
  ["USER_CREATED", (event: UserCreatedEvent) => console.log(event)],
]);
