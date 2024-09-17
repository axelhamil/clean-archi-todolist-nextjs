import { startNewTrace, startSpan } from "@sentry/nextjs";

import { DomainEvent } from "@/shared/core/domain.event";
import { winPointsUseCase } from "@/src/application/useCases/score/winPoints.useCase";
import { TodoCompletedEvent } from "@/src/domains/entities/todo";

type Events = { [id: string]: DomainEvent[] };

class EventBus {
  private static instance: EventBus;
  public events: Events = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handlers: { [key: string]: ((event: any) => void)[] } = {};

  constructor() {
    this.subscribe("TODO_COMPLETED", async (event: TodoCompletedEvent) => {
      await winPointsUseCase({ userId: event.payload.userId });
    });
  }

  public static getInstance() {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public addEvent(entityId: string, event: DomainEvent): void {
    startNewTrace(() => {
      if (!this.events[entityId]) {
        this.events[entityId] = [];
      }
      this.events[entityId].push(event);
    });
  }

  public dispatch(entityId: string): void {
    const eventsForEntity = this.events[entityId];
    if (eventsForEntity && eventsForEntity.length > 0) {
      for (const event of eventsForEntity) {
        const listeners = this.handlers[event.type] || [];
        for (const listener of listeners) {
          listener(event);
        }
      }
      delete this.events[entityId];
    }
  }

  public subscribe<T>(
    eventType: string,
    listener: (event: T & DomainEvent) => void,
  ): void {
    startSpan(
      {
        name: "subscribe",
        op: "eventbus",
      },
      () => {
        if (!this.handlers[eventType]) {
          this.handlers[eventType] = [];
        }
        this.handlers[eventType].push(listener);
      },
    );
  }
}

export const eventBus = EventBus.getInstance();
