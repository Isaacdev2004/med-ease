#!/usr/bin/env node
/**
 * E2E platform certification: auth → permission guard → IAM mutation → audit persistence.
 */
import { authedFetch, login, waitForIamAudit } from './e2e-helpers.mjs';

const ADMIN_EMAIL = 'admin@medease.health';
const PATIENT_EMAIL = 'patient@medease.health';

async function main() {
  process.stdout.write('\n==> E2E login (admin)\n');
  const adminLogin = await login(ADMIN_EMAIL);
  const adminToken = adminLogin.token;

  process.stdout.write('\n==> E2E /auth/me via IAM users list\n');
  const usersResponse = await authedFetch(
    adminToken,
    '/iam/users?page=1&pageSize=5',
  );
  if (usersResponse.status !== 200) {
    throw new Error(
      `Expected 200 from /iam/users, got ${usersResponse.status}`,
    );
  }

  process.stdout.write('\n==> E2E create IAM user mutation\n');
  const email = `e2e-${Date.now()}@medease.health`;
  const createResponse = await authedFetch(adminToken, '/iam/users', {
    method: 'POST',
    body: JSON.stringify({
      email,
      displayName: 'E2E Contract User',
      tenantId: '01930000-0000-7000-8000-000000000001',
      organizationId: '01930000-0000-7000-8000-000000000002',
      roleIds: ['01930000-0000-7000-8000-000000000201'],
    }),
  });
  if (createResponse.status !== 201 && createResponse.status !== 200) {
    throw new Error(
      `Create user failed: ${createResponse.status} ${await createResponse.text()}`,
    );
  }

  process.stdout.write('\n==> E2E audit persistence via worker\n');
  await waitForIamAudit(adminToken, 'create_user');

  process.stdout.write(
    '\n==> E2E permission guard (patient denied admin write)\n',
  );
  const patientLogin = await login(PATIENT_EMAIL);
  const deniedResponse = await authedFetch(patientLogin.token, '/iam/users', {
    method: 'POST',
    body: JSON.stringify({
      email: `denied-${Date.now()}@medease.health`,
      displayName: 'Should Fail',
      tenantId: '01930000-0000-7000-8000-000000000001',
      organizationId: '01930000-0000-7000-8000-000000000002',
      roleIds: ['01930000-0000-7000-8000-000000000201'],
    }),
  });
  if (deniedResponse.status !== 403) {
    throw new Error(
      `Expected 403 for patient write, got ${deniedResponse.status}`,
    );
  }

  process.stdout.write('\nPlatform E2E certification passed.\n');
}

main().catch((error) => {
  console.error(
    `\nPlatform E2E certification failed: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});
