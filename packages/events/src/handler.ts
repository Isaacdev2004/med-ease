import type { DomainEvent } from './domain-event';

export interface DomainEventHandler<T extends DomainEvent = DomainEvent> {
  supports(type: string): boolean;
  handle(event: T): Promise<void>;
}
