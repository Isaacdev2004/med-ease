#!/usr/bin/env node
/**
 * P8 Patients E2E certification: auth → CRUD → permissions → RLS → audit → queue.
 */
import {
  authedFetch,
  DEMO_ADMIN_ID,
  DEMO_TENANT_ID,
  login,
  sleep,
} from './e2e-helpers.mjs';
import {
  assertPatientAuditRow,
  countPatientAuditLogs,
  getAuditQueueDepth,
  waitForPatientAuditLog,
  waitForSecurityEvent,
} from './e2e-db.mjs';

const ADMIN_EMAIL = 'admin@medease.health';
const PATIENT_EMAIL = 'patient@medease.health';
const SEEDED_PATIENT_ID = '01930000-0000-7000-8000-000000000301';
const SEEDED_MRN = 'MRN-10293';
const FOREIGN_PATIENT_ID = '00000000-0000-0000-0000-000000000099';

function assertStatus(response, expected, label) {
  if (response.status !== expected) {
    throw new Error(
      `${label}: expected ${expected}, got ${response.status} — ${response.statusText}`,
    );
  }
}

function expectPatientAudit(row, { patientId, auditAction }) {
  assertPatientAuditRow(row, {
    patientId,
    auditAction,
    actorId: DEMO_ADMIN_ID,
    tenantId: DEMO_TENANT_ID,
  });
}

async function main() {
  process.stdout.write('\n==> P8 authentication\n');
  const adminLogin = await login(ADMIN_EMAIL);
  if (!adminLogin.refreshCookie?.includes('refresh')) {
    throw new Error('Login did not issue refresh cookie');
  }
  if (!adminLogin.session?.accessToken) {
    throw new Error('Login session missing accessToken');
  }
  await waitForSecurityEvent('login_success');

  const adminToken = adminLogin.token;

  process.stdout.write('\n==> P8 patient list\n');
  const listResponse = await authedFetch(
    adminToken,
    '/patients?page=1&pageSize=10',
  );
  assertStatus(listResponse, 200, 'GET /patients');
  const listBody = await listResponse.json();
  if (!Array.isArray(listBody.items) || listBody.items.length === 0) {
    throw new Error('Expected seeded patients in list response');
  }
  if (!listBody.items.every((patient) => patient.tenantId === DEMO_TENANT_ID)) {
    throw new Error('Patient list returned cross-tenant records');
  }

  const activeList = await authedFetch(
    adminToken,
    '/patients?status=active&page=1&pageSize=25',
  );
  assertStatus(activeList, 200, 'GET /patients?status=active');
  const activeBody = await activeList.json();
  if (!activeBody.items.every((patient) => patient.status === 'active')) {
    throw new Error('Status filter returned non-active patients');
  }

  process.stdout.write('\n==> P8 patient search\n');
  const searchResponse = await authedFetch(
    adminToken,
    '/patients/search?q=sarah&page=1&pageSize=10',
  );
  assertStatus(searchResponse, 200, 'GET /patients/search');
  const searchBody = await searchResponse.json();
  const sarah = searchBody.items.find((patient) =>
    patient.fullName?.includes('Sarah'),
  );
  if (!sarah) {
    throw new Error('Search did not return Sarah Jenkins');
  }

  const emptySearch = await authedFetch(
    adminToken,
    '/patients/search?q=%20&page=1&pageSize=10',
  );
  if (emptySearch.status !== 422 && emptySearch.status !== 400) {
    throw new Error(
      `Expected 422/400 for empty search, got ${emptySearch.status}`,
    );
  }

  process.stdout.write('\n==> P8 create patient\n');
  const mrn = `MRN-E2E-${Date.now()}`;
  const createResponse = await authedFetch(adminToken, '/patients', {
    method: 'POST',
    body: JSON.stringify({
      mrn,
      fullName: 'E2E Certification Patient',
      dateOfBirth: '1991-04-18',
      gender: 'other',
      status: 'active',
      identifiers: [{ type: 'mrn', value: mrn, isPrimary: true }],
      preferences: { language: 'en', maritalStatus: 'single' },
    }),
  });
  assertStatus(createResponse, 201, 'POST /patients');
  const created = await createResponse.json();
  const createdPatientId = created.patientId;
  if (!createdPatientId) {
    throw new Error('Create patient response missing patientId');
  }

  const identifiersResponse = await authedFetch(
    adminToken,
    `/patients/${createdPatientId}/identifiers`,
  );
  assertStatus(identifiersResponse, 200, 'GET identifiers');
  const identifiers = await identifiersResponse.json();
  if (!Array.isArray(identifiers) || identifiers.length === 0) {
    throw new Error('Expected identifiers after patient registration');
  }

  const preferencesResponse = await authedFetch(
    adminToken,
    `/patients/${createdPatientId}/preferences`,
  );
  assertStatus(preferencesResponse, 200, 'GET preferences');
  const preferences = await preferencesResponse.json();
  if (!preferences?.language) {
    throw new Error('Expected preferences after patient registration');
  }

  const queueBeforeAudit = await getAuditQueueDepth();
  expectPatientAudit(
    await waitForPatientAuditLog({
      patientId: createdPatientId,
      auditAction: 'CREATE',
    }),
    { patientId: createdPatientId, auditAction: 'CREATE' },
  );
  const queueAfterAudit = await getAuditQueueDepth();
  process.stdout.write(
    `    audit queue depth wait=${queueBeforeAudit.wait}→${queueAfterAudit.wait}, active=${queueAfterAudit.active}\n`,
  );

  process.stdout.write('\n==> P8 duplicate MRN\n');
  const auditCountBefore = await countPatientAuditLogs(
    createdPatientId,
    'CREATE',
  );
  const duplicateResponse = await authedFetch(adminToken, '/patients', {
    method: 'POST',
    body: JSON.stringify({
      mrn,
      fullName: 'Duplicate MRN Patient',
      dateOfBirth: '1990-01-01',
    }),
  });
  if (duplicateResponse.status !== 409) {
    throw new Error(
      `Expected 409 for duplicate MRN, got ${duplicateResponse.status}`,
    );
  }
  const auditCountAfter = await countPatientAuditLogs(
    createdPatientId,
    'CREATE',
  );
  if (auditCountAfter !== auditCountBefore) {
    throw new Error(
      'Duplicate MRN registration should not create additional CREATE audit rows',
    );
  }

  process.stdout.write('\n==> P8 archive + restore\n');
  const archiveResponse = await authedFetch(
    adminToken,
    `/patients/${createdPatientId}`,
    {
      method: 'DELETE',
    },
  );
  assertStatus(archiveResponse, 200, 'DELETE /patients/:id');
  expectPatientAudit(
    await waitForPatientAuditLog({
      patientId: createdPatientId,
      auditAction: 'UPDATE',
    }),
    { patientId: createdPatientId, auditAction: 'UPDATE' },
  );

  const hiddenList = await authedFetch(
    adminToken,
    '/patients?page=1&pageSize=100',
  );
  const hiddenBody = await hiddenList.json();
  if (
    hiddenBody.items.some((patient) => patient.patientId === createdPatientId)
  ) {
    throw new Error('Archived patient still visible in default list');
  }

  const restoreResponse = await authedFetch(
    adminToken,
    `/patients/${createdPatientId}/restore`,
    {
      method: 'POST',
    },
  );
  assertStatus(restoreResponse, 200, 'POST /patients/:id/restore');
  expectPatientAudit(
    await waitForPatientAuditLog({
      patientId: createdPatientId,
      auditAction: 'UPDATE',
    }),
    { patientId: createdPatientId, auditAction: 'UPDATE' },
  );

  process.stdout.write('\n==> P8 patient viewed audit\n');
  const viewResponse = await authedFetch(
    adminToken,
    `/patients/${SEEDED_PATIENT_ID}`,
  );
  assertStatus(viewResponse, 200, 'GET /patients/:id');
  expectPatientAudit(
    await waitForPatientAuditLog({
      patientId: SEEDED_PATIENT_ID,
      auditAction: 'READ',
    }),
    { patientId: SEEDED_PATIENT_ID, auditAction: 'READ' },
  );

  process.stdout.write('\n==> P8 RLS / tenant isolation\n');
  const foreignResponse = await authedFetch(
    adminToken,
    `/patients/${FOREIGN_PATIENT_ID}`,
  );
  if (foreignResponse.status !== 404) {
    throw new Error(
      `Expected 404 for foreign patient id, got ${foreignResponse.status}`,
    );
  }

  process.stdout.write('\n==> P8 permission enforcement\n');
  const patientLogin = await login(PATIENT_EMAIL);
  const deniedResponse = await authedFetch(patientLogin.token, '/patients', {
    method: 'POST',
    body: JSON.stringify({
      mrn: `MRN-DENIED-${Date.now()}`,
      fullName: 'Should Fail',
      dateOfBirth: '1990-01-01',
    }),
  });
  if (deniedResponse.status !== 403) {
    throw new Error(
      `Expected 403 for patient role write, got ${deniedResponse.status}`,
    );
  }

  process.stdout.write('\n==> P8 seeded patient integrity\n');
  const seededResponse = await authedFetch(
    adminToken,
    `/patients/${SEEDED_PATIENT_ID}`,
  );
  assertStatus(seededResponse, 200, 'GET seeded patient');
  const seeded = await seededResponse.json();
  if (seeded.mrn !== SEEDED_MRN) {
    throw new Error(`Expected seeded MRN ${SEEDED_MRN}, got ${seeded.mrn}`);
  }

  await sleep(500);
  const finalQueue = await getAuditQueueDepth();
  if (finalQueue.total > 5) {
    throw new Error(
      `Audit queue backlog too high after worker drain: ${JSON.stringify(finalQueue)}`,
    );
  }

  process.stdout.write('\nPatients E2E certification passed.\n');
}

main().catch((error) => {
  console.error(
    `\nPatients E2E certification failed: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});
