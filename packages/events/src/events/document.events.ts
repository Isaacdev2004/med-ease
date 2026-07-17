import {
  createDomainEvent,
  type DomainEvent,
  type DomainEventContext,
} from '../domain-event';

export const DocumentEventType = {
  DocumentDownloaded: 'DocumentDownloaded',
} as const;

/** Document domain events (reserved for future modules). */
export const DocumentEvents = {
  documentDownloaded: (
    payload: { documentId: string; tenantId?: string; facilityId?: string },
    context?: DomainEventContext,
  ): DomainEvent =>
    createDomainEvent(DocumentEventType.DocumentDownloaded, payload, {
      ...context,
      tenantId: context?.tenantId ?? payload.tenantId,
      facilityId: context?.facilityId ?? payload.facilityId,
    }),
};
