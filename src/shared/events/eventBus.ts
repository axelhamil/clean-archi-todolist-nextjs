import { DomainEvent } from "@/src/shared/events/domainEvent";

export class EventBus {
  private static instance: EventBus;
  public events: { [id: string]: DomainEvent[] } = {};
  private handlers: { [key: string]: ((event: DomainEvent) => void)[] } = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private constructor(subscribers: [string, (event: any) => void][] = []) {
    subscribers.forEach(([eventType, subscriber]) =>
      this.subscribe(eventType, subscriber),
    );
  }

  public static getInstance(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscribers: [string, (event: any) => void][] = [],
  ): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus(subscribers);
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
    if (eventsForEntity) {
      eventsForEntity.forEach((event) => {
        (this.handlers[event.type] || []).forEach((listener) =>
          listener(event),
        );
      });
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
