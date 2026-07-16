import { getRequestContext } from '@medease/observability';
import { newId } from '@medease/uuid';

export interface DomainEvent {
  id: string;
  type: string;
  occurredAt: Date;
  tenantId?: string;
  facilityId?: string;
  userId?: string;
  correlationId?: string;
  requestId?: string;
  payload: unknown;
}

export type DomainEventContext = Pick<
  DomainEvent,
  'tenantId' | 'facilityId' | 'userId' | 'correlationId' | 'requestId'
>;

export function createDomainEvent(
  type: string,
  payload: unknown,
  context?: DomainEventContext,
): DomainEvent {
  const request = getRequestContext();

  return {
    id: newId(),
    type,
    occurredAt: new Date(),
    tenantId: context?.tenantId ?? request?.tenantId,
    facilityId: context?.facilityId ?? request?.facilityId,
    userId: context?.userId ?? request?.userId,
    correlationId: context?.correlationId ?? request?.correlationId ?? newId(),
    requestId: context?.requestId ?? request?.requestId,
    payload,
  };
}
