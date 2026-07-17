import assert from 'node:assert/strict';
import { before, describe, it } from 'node:test';

import { setAuthTokenGetter, setBaseUrl } from '@workspace/api-client-react';

import { patientsRepositoryContract } from './repository.contract';
import { patientsContractFixtures } from './fixtures/patients.fixtures';
import { patientsRepository } from '../repository';

const API_BASE =
  process.env.CONTRACT_TEST_API_URL ?? process.env.VITE_API_BASE_URL ?? '';

async function loginAccessToken(): Promise<string> {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      email: patientsContractFixtures.demoAdminEmail,
      password: patientsContractFixtures.demoPassword,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Login failed (${response.status}): ${body}`);
  }

  const json = (await response.json()) as {
    session?: { accessToken?: string };
    accessToken?: string;
  };
  const accessToken = json.session?.accessToken ?? json.accessToken;
  if (!accessToken) {
    throw new Error('Login response missing accessToken');
  }
  return accessToken;
}

if (!API_BASE) {
  describe('http Patients repository contract', () => {
    it('skipped — set CONTRACT_TEST_API_URL to run HTTP contract tests', () => {
      assert.ok(true);
    });
  });
} else {
  before(async () => {
    setBaseUrl(API_BASE);
    const token = await loginAccessToken();
    setAuthTokenGetter(async () => token);
  });

  patientsRepositoryContract({
    name: 'http',
    repository: patientsRepository,
    fixtures: {
      ...patientsContractFixtures,
      tenantId: patientsContractFixtures.demoTenantId,
    },
  });
}
