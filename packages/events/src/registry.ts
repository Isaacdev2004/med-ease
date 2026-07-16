import type { DomainEventHandler } from './handler';

export class HandlerRegistry {
  private readonly handlers: DomainEventHandler[] = [];

  register(handler: DomainEventHandler): void {
    this.handlers.push(handler);
  }

  handlersFor(type: string): DomainEventHandler[] {
    return this.handlers.filter((handler) => handler.supports(type));
  }

  list(): readonly DomainEventHandler[] {
    return this.handlers;
  }
}
