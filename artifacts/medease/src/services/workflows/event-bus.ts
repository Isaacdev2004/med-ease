import type { WorkflowEvent } from '@/services/workflows/types';

type EventHandler = (event: WorkflowEvent) => void;

class WorkflowEventBus {
  private handlers = new Map<string, EventHandler[]>();

  subscribe(eventType: string, handler: EventHandler) {
    const list = this.handlers.get(eventType) ?? [];
    list.push(handler);
    this.handlers.set(eventType, list);
  }

  publish(event: WorkflowEvent) {
    const handlers = this.handlers.get(event.type) ?? [];
    handlers.forEach((h) => h(event));
  }
}

export const workflowEventBus = new WorkflowEventBus();

export function createEvent(
  type: string,
  source: string,
  module: string,
  payload: string,
): WorkflowEvent {
  return {
    eventId: `evt-${Date.now()}`,
    type,
    source,
    module,
    payload,
    timestamp: new Date().toISOString(),
  };
}
