import type { DomainEvent } from './domain-event';
import type { DomainEventHandler } from './handler';
import { HandlerRegistry } from './registry';

export class DomainEventBus {
  private readonly registry = new HandlerRegistry();

  register(handler: DomainEventHandler): void {
    this.registry.register(handler);
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.registry.handlersFor(event.type);
    await Promise.all(handlers.map((handler) => handler.handle(event)));
  }

  async publishMany(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
