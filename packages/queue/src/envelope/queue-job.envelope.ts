import { newId } from '@medease/uuid';

/** Platform-scoped jobs (bootstrap, system maintenance) use this tenant. */
export const PLATFORM_TENANT_ID = '00000000-0000-7000-8000-000000000001';

export interface QueueJobEnvelope<T = unknown> {
  id: string;
  tenantId: string;
  organizationId?: string;
  facilityId?: string;
  departmentId?: string;
  correlationId: string;
  requestId?: string;
  actorId?: string;
  sessionId?: string;
  roles?: string[];
  permissions?: string[];
  source: string;
  eventType: string;
  createdAt: string;
  payload: T;
}

export interface CreateEnvelopeInput<T> {
  tenantId: string;
  source: string;
  eventType: string;
  payload: T;
  organizationId?: string;
  facilityId?: string;
  departmentId?: string;
  correlationId?: string;
  requestId?: string;
  actorId?: string;
  sessionId?: string;
  roles?: string[];
  permissions?: string[];
  id?: string;
  createdAt?: string;
}

export class QueueEnvelopeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QueueEnvelopeValidationError';
  }
}

export function createEnvelope<T>(input: CreateEnvelopeInput<T>): QueueJobEnvelope<T> {
  return {
    id: input.id ?? newId(),
    tenantId: input.tenantId,
    organizationId: input.organizationId,
    facilityId: input.facilityId,
    departmentId: input.departmentId,
    correlationId: input.correlationId ?? newId(),
    requestId: input.requestId,
    actorId: input.actorId,
    sessionId: input.sessionId,
    roles: input.roles,
    permissions: input.permissions,
    source: input.source,
    eventType: input.eventType,
    createdAt: input.createdAt ?? new Date().toISOString(),
    payload: input.payload,
  };
}

export function createBootstrapEnvelope<T = Record<string, unknown>>(
  queueName: string,
  payload: T = {} as T,
): QueueJobEnvelope<T> {
  return createEnvelope({
    tenantId: PLATFORM_TENANT_ID,
    source: 'worker-bootstrap',
    eventType: 'bootstrap.ping',
    payload,
    correlationId: `bootstrap:${queueName}`,
  });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateEnvelope<T = unknown>(value: unknown): QueueJobEnvelope<T> {
  if (!value || typeof value !== 'object') {
    throw new QueueEnvelopeValidationError('Job data must be a QueueJobEnvelope object');
  }

  const record = value as Record<string, unknown>;

  if (!isNonEmptyString(record.id)) {
    throw new QueueEnvelopeValidationError('Envelope.id is required');
  }
  if (!isNonEmptyString(record.tenantId)) {
    throw new QueueEnvelopeValidationError('Envelope.tenantId is required');
  }
  if (!isNonEmptyString(record.correlationId)) {
    throw new QueueEnvelopeValidationError('Envelope.correlationId is required');
  }
  if (!isNonEmptyString(record.source)) {
    throw new QueueEnvelopeValidationError('Envelope.source is required');
  }
  if (!isNonEmptyString(record.eventType)) {
    throw new QueueEnvelopeValidationError('Envelope.eventType is required');
  }
  if (!isNonEmptyString(record.createdAt)) {
    throw new QueueEnvelopeValidationError('Envelope.createdAt is required');
  }
  if (!('payload' in record)) {
    throw new QueueEnvelopeValidationError('Envelope.payload is required');
  }

  if (record.facilityId !== undefined && !isNonEmptyString(record.facilityId)) {
    throw new QueueEnvelopeValidationError('Envelope.facilityId must be a non-empty string when set');
  }
  if (record.requestId !== undefined && !isNonEmptyString(record.requestId)) {
    throw new QueueEnvelopeValidationError('Envelope.requestId must be a non-empty string when set');
  }
  if (record.actorId !== undefined && !isNonEmptyString(record.actorId)) {
    throw new QueueEnvelopeValidationError('Envelope.actorId must be a non-empty string when set');
  }

  return record as unknown as QueueJobEnvelope<T>;
}

export function isQueueJobEnvelope(value: unknown): value is QueueJobEnvelope {
  try {
    validateEnvelope(value);
    return true;
  } catch {
    return false;
  }
}
