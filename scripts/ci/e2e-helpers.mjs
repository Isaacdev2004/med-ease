#!/usr/bin/env node
/**
 * Shared helpers for platform and patients E2E certification scripts.
 */

export const DEMO_TENANT_ID = '01930000-0000-7000-8000-000000000001';
export const DEMO_ADMIN_ID = '01930000-0000-7000-8000-000000000101';
export const DEMO_PASSWORD = 'demo';

export function apiBase() {
  const port = process.env.API_PORT ?? '3000';
  return `http://127.0.0.1:${port}/api`;
}

export function extractAccessToken(json) {
  const token = json?.session?.accessToken ?? json?.accessToken;
  if (!token || typeof token !== 'string') {
    throw new Error('Login response missing session.accessToken');
  }
  return token;
}

export async function login(email, password = DEMO_PASSWORD) {
  const response = await fetch(`${apiBase()}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(`Login failed for ${email}: ${response.status} ${await response.text()}`);
  }

  const json = await response.json();
  const refreshCookie = response.headers.get('set-cookie');
  return {
    token: extractAccessToken(json),
    user: json.user,
    session: json.session,
    refreshCookie,
  };
}

export async function authedFetch(token, path, init = {}) {
  return fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${token}`,
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...(init.headers ?? {}),
    },
  });
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function waitForIamAudit(token, action, attempts = 20) {
  for (let i = 0; i < attempts; i += 1) {
    const response = await authedFetch(token, '/iam/audit-events?page=1&pageSize=25');
    if (!response.ok) {
      throw new Error(`IAM audit query failed: ${response.status}`);
    }
    const body = await response.json();
    const match = Array.isArray(body.items)
      ? body.items.find((event) => event.action === action)
      : undefined;
    if (match) {
      return match;
    }
    await sleep(1500);
  }
  throw new Error(`Timed out waiting for IAM audit action "${action}"`);
}
