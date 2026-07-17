import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  createBootstrapEnvelope,
  createEnvelope,
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

  it('creates bootstrap envelopes for platform jobs', () => {
    const envelope = createBootstrapEnvelope('medease:emails');
    assert.equal(envelope.eventType, 'bootstrap.ping');
    assert.equal(envelope.source, 'worker-bootstrap');
    assert.ok(envelope.correlationId.includes('medease:emails'));
  });
});
