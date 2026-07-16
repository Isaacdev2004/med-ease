#!/usr/bin/env node
/**
 * Direct database assertions for E2E certification (audit persistence, queue drain proof).
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function getPool() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for E2E database assertions');
  }
  const { Pool } = require('pg');
  return new Pool({ connectionString: databaseUrl });
}

export async function queryRows(sql, params = []) {
  const pool = getPool();
  try {
    const result = await pool.query(sql, params);
    return result.rows;
  } finally {
    await pool.end();
  }
}

export function assertPatientAuditRow(
  row,
  { patientId, auditAction, actorId, tenantId, resourceType = 'patient' },
) {
  if (row.resource_type !== resourceType) {
    throw new Error(`Expected resource_type=${resourceType}, got ${row.resource_type}`);
  }
  if (row.action !== auditAction) {
    throw new Error(`Expected action=${auditAction}, got ${row.action}`);
  }
  const entityId = row.patient_id ?? row.resource_id;
  if (entityId !== patientId) {
    throw new Error(`Expected patient entity_id=${patientId}, got ${entityId}`);
  }
  if (actorId && row.actor_id !== actorId) {
    throw new Error(`Expected actor_id=${actorId}, got ${row.actor_id}`);
  }
  if (tenantId && row.tenant_id !== tenantId) {
    throw new Error(`Expected tenant_id=${tenantId}, got ${row.tenant_id}`);
  }
  if (!row.created_at) {
    throw new Error('Audit row missing created_at timestamp');
  }
}

export async function waitForPatientAuditLog(
  { patientId, auditAction, resourceType = 'patient' },
  attempts = 25,
  delayMs = 1500,
) {
  for (let i = 0; i < attempts; i += 1) {
    const rows = await queryRows(
      `SELECT id, action, resource_type, resource_id, patient_id, actor_id, tenant_id, metadata, created_at
       FROM audit.audit_logs
       WHERE resource_type = $1
         AND (patient_id = $2::uuid OR resource_id = $2::uuid)
         AND action = $3::audit."AuditAction"
       ORDER BY created_at DESC
       LIMIT 1`,
      [resourceType, patientId, auditAction],
    );
    if (rows.length > 0) {
      return rows[0];
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error(
    `Timed out waiting for patient audit log (patientId=${patientId}, action=${auditAction})`,
  );
}

export async function countPatientAuditLogs(patientId, auditAction) {
  const rows = await queryRows(
    `SELECT COUNT(*)::int AS count
     FROM audit.audit_logs
     WHERE resource_type = 'patient'
       AND (patient_id = $1::uuid OR resource_id = $1::uuid)
       AND action = $2::audit."AuditAction"`,
    [patientId, auditAction],
  );
  return rows[0]?.count ?? 0;
}

export async function waitForSecurityEvent(eventType, attempts = 20, delayMs = 1500) {
  for (let i = 0; i < attempts; i += 1) {
    const rows = await queryRows(
      `SELECT id, event_type, user_id, tenant_id, created_at
       FROM audit.security_events
       WHERE event_type = $1::audit."SecurityEventType"
       ORDER BY created_at DESC
       LIMIT 1`,
      [eventType],
    );
    if (rows.length > 0) {
      return rows[0];
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error(`Timed out waiting for security event "${eventType}"`);
}

export async function getAuditQueueDepth() {
  const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
  const Redis = require('ioredis');
  const redis = new Redis(redisUrl, { maxRetriesPerRequest: 1, enableReadyCheck: false });
  try {
    const [wait, active, delayed] = await Promise.all([
      redis.llen('bull:medease:audit:wait'),
      redis.llen('bull:medease:audit:active'),
      redis.zcard('bull:medease:audit:delayed'),
    ]);
    return { wait, active, delayed, total: wait + active + delayed };
  } finally {
    redis.disconnect();
  }
}
