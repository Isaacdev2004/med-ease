import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  createBootstrapEnvelope,
  createEnvelope,
  isQueueJobEnvelope,
  QueueEnvelopeValidationError,
  validateEnvelope,
} from './queue-job.envelope.js';

describe('QueueJobEnvelope', () => {
  it('creates a valid envelope with defaults', () => {
    const envelope = createEnvelope({
      tenantId: 'tenant-1',
      source: 'test',
      eventType: 'test.event',
      payload: { ok: true },
    });

    assert.equal(envelope.tenantId, 'tenant-1');
    assert.equal(envelope.source, 'test');
    assert.equal(envelope.eventType, 'test.event');
    assert.ok(envelope.id.length > 0);
    assert.ok(envelope.correlationId.length > 0);
    assert.ok(envelope.createdAt.length > 0);
  });

  it('validates a well-formed envelope', () => {
    const envelope = createEnvelope({
      tenantId: 'tenant-1',
      source: 'api',
      eventType: 'patient.created',
      payload: {},
    });

    const validated = validateEnvelope(envelope);
    assert.equal(validated.id, envelope.id);
  });

  it('rejects invalid envelope payloads', () => {
    assert.throws(() => validateEnvelope(null), QueueEnvelopeValidationError);
    assert.throws(
      () => validateEnvelope({ id: 'x' }),
      QueueEnvelopeValidationError,
    );
  });

  it('rejects envelopes missing required fields', () => {
    const base = {
      id: 'job-1',
      tenantId: 'tenant-1',
      correlationId: 'corr-1',
      source: 'api',
      eventType: 'patient.created',
      createdAt: new Date().toISOString(),
      payload: {},
    };

    assert.throws(
      () => validateEnvelope({ ...base, tenantId: '' }),
      /tenantId is required/,
    );
    assert.throws(
      () => validateEnvelope({ ...base, correlationId: '   ' }),
      /correlationId is required/,
    );
    assert.throws(
      () => validateEnvelope({ ...base, source: '' }),
      /source is required/,
    );
    assert.throws(
      () => validateEnvelope({ ...base, eventType: '' }),
      /eventType is required/,
    );
    assert.throws(
      () => validateEnvelope({ ...base, createdAt: '' }),
      /createdAt is required/,
    );
    const withoutPayload = { ...base };
    delete (withoutPayload as { payload?: unknown }).payload;
    assert.throws(
      () => validateEnvelope(withoutPayload),
      /payload is required/,
    );
  });

  it('rejects blank optional context fields when provided', () => {
    const base = createEnvelope({
      tenantId: 'tenant-1',
      source: 'api',
      eventType: 'patient.created',
      payload: {},
    });

    assert.throws(
      () => validateEnvelope({ ...base, facilityId: '  ' }),
      /facilityId must be a non-empty string/,
    );
    assert.throws(
      () => validateEnvelope({ ...base, requestId: '' }),
      /requestId must be a non-empty string/,
    );
    assert.throws(
      () => validateEnvelope({ ...base, actorId: ' ' }),
      /actorId must be a non-empty string/,
    );
  });

  it('detects queue job envelopes with isQueueJobEnvelope', () => {
    const envelope = createEnvelope({
      tenantId: 'tenant-1',
      source: 'api',
      eventType: 'patient.created',
      payload: { id: 'p1' },
    });

    assert.equal(isQueueJobEnvelope(envelope), true);
    assert.equal(isQueueJobEnvelope({ id: 'only-id' }), false);
    assert.equal(isQueueJobEnvelope(null), false);
  });

  it('creates bootstrap envelopes for platform jobs', () => {
    const envelope = createBootstrapEnvelope('medease:emails');
    assert.equal(envelope.eventType, 'bootstrap.ping');
    assert.equal(envelope.source, 'worker-bootstrap');
    assert.ok(envelope.correlationId.includes('medease:emails'));
  });
});
