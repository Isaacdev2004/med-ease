import { createEnvelope, type CreateEnvelopeInput, type QueueJobEnvelope } from '@medease/queue';

import { envelopeInputFromAuditEvent } from './audit-context';
import type { AuditDomainEvent, AuditRecordPayload } from './audit-types';

export type AuditEnqueueFn = (
  jobName: string,
  envelope: QueueJobEnvelope<AuditRecordPayload>,
) => Promise<unknown>;

export interface AuditPublisherOptions {
  source?: string;
  onError?: (error: unknown, event: AuditDomainEvent) => void;
}

/**
 * Publishes immutable domain audit events to the BullMQ audit queue.
 * No service or repository should write audit rows directly.
 */
export class AuditPublisher {
  private readonly source: string;
  private readonly onError?: (error: unknown, event: AuditDomainEvent) => void;

  constructor(
    private readonly enqueue: AuditEnqueueFn,
    options: AuditPublisherOptions = {},
  ) {
    this.source = options.source ?? 'medease-api';
    this.onError = options.onError;
  }

  async publish(event: AuditDomainEvent): Promise<void> {
    try {
      const input = envelopeInputFromAuditEvent(this.source, event);
      const envelope = createEnvelope<AuditRecordPayload>(input);
      await this.enqueue(event.eventType, envelope);
    } catch (error) {
      this.onError?.(error, event);
      throw error;
    }
  }

  /** Fire-and-forget publish — business operations must not fail when audit enqueue fails. */
  publishAsync(event: AuditDomainEvent): void {
    void this.publish(event).catch((error) => {
      this.onError?.(error, event);
    });
  }
}
