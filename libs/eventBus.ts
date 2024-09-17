import { DomainEvent } from "@/libs/domain.event";
import { winPointsUseCase } from "@/src/application/useCases/score/winPoints.useCase";

type Events = { [id: string]: DomainEvent[] };

class EventBus {
  private static instance: EventBus;
  public events: Events = {};
  private handlers: { [key: string]: ((event: DomainEvent) => void)[] } = {};

  constructor() {
    this.subscribe("TODO_COMPLETED", async (event) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
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
    if (!this.events[entityId]) {
      this.events[entityId] = [];
    }
    this.events[entityId].push(event);
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

  public subscribe(
    eventType: string,
    listener: (event: DomainEvent) => void,
  ): void {
    if (!this.handlers[eventType]) {
      this.handlers[eventType] = [];
    }
    this.handlers[eventType].push(listener);
  }
}

export const eventBus = EventBus.getInstance();
