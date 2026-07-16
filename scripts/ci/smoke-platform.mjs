#!/usr/bin/env node
/**
 * Smoke-test platform health endpoints after API and worker are running.
 */
const API_PORT = process.env.API_PORT ?? '3000';
const WORKER_PORT = process.env.WORKER_PORT ?? '3001';
const API_BASE = `http://127.0.0.1:${API_PORT}/api`;
const WORKER_BASE = `http://127.0.0.1:${WORKER_PORT}`;

const STARTUP_TIMEOUT_MS = Number(process.env.SMOKE_STARTUP_TIMEOUT_MS ?? 90_000);
const POLL_INTERVAL_MS = 1_500;

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForFetch(label, url, predicate) {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(5_000) });
      const body = await response.text();
      if (predicate(response, body)) {
        return { response, body };
      }
    } catch {
      // Service still starting
    }
    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error(`${label} did not become ready within ${STARTUP_TIMEOUT_MS}ms (${url})`);
}

async function probe(label, url, assertFn) {
  process.stdout.write(`\n==> ${label}\n`);
  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  const body = await response.text();
  assertFn(response, body);
  process.stdout.write(`${body.slice(0, 500)}\n`);
}

async function main() {
  await waitForFetch('API liveness', `${API_BASE}/healthz`, (response, body) => {
    if (response.status !== 200) {
      return false;
    }
    try {
      return JSON.parse(body).status === 'ok';
    } catch {
      return false;
    }
  });

  await probe('API liveness', `${API_BASE}/healthz`, (response, body) => {
    if (response.status !== 200) {
      throw new Error(`Expected HTTP 200, got ${response.status}`);
    }
    const json = JSON.parse(body);
    if (json.status !== 'ok') {
      throw new Error(`Expected status ok, got ${json.status}`);
    }
  });

  await waitForFetch('API readiness', `${API_BASE}/healthz/ready`, (response, body) => {
    if (![200, 503].includes(response.status)) {
      return false;
    }
    try {
      const json = JSON.parse(body);
      return Array.isArray(json.checks);
    } catch {
      return false;
    }
  });

  await probe('API readiness', `${API_BASE}/healthz/ready`, (response, body) => {
    if (![200, 503].includes(response.status)) {
      throw new Error(`Expected HTTP 200 or 503, got ${response.status}`);
    }
    const json = JSON.parse(body);
    if (!Array.isArray(json.checks)) {
      throw new Error('Readiness response missing checks array');
    }
  });

  await probe('Swagger OpenAPI JSON', `${API_BASE}/docs-json`, (response, body) => {
    if (response.status !== 200) {
      throw new Error(`Expected HTTP 200, got ${response.status}`);
    }
    const json = JSON.parse(body);
    if (!json.openapi || !json.paths) {
      throw new Error('Swagger document missing openapi version or paths');
    }
  });

  await probe('API metrics', `${API_BASE}/metrics`, (response, body) => {
    if (response.status !== 200) {
      throw new Error(`Expected HTTP 200, got ${response.status}`);
    }
    if (!body.includes('medease_http_requests_total') && !body.includes('medease_process_cpu')) {
      throw new Error('Prometheus metrics missing medease series');
    }
  });

  await probe('Platform info', `${API_BASE}/platform/info`, (response, body) => {
    if (response.status !== 200) {
      throw new Error(`Expected HTTP 200, got ${response.status}`);
    }
    const json = JSON.parse(body);
    if (!json.applicationVersion || !json.migrationVersion) {
      throw new Error('Platform info missing version metadata');
    }
  });

  await waitForFetch('Worker health', `${WORKER_BASE}/healthz`, (response, body) => {
    if (response.status !== 200) {
      return false;
    }
    try {
      return JSON.parse(body).status === 'ok';
    } catch {
      return false;
    }
  });

  await probe('Worker health', `${WORKER_BASE}/healthz`, (response, body) => {
    if (response.status !== 200) {
      throw new Error(`Expected HTTP 200, got ${response.status}`);
    }
    const json = JSON.parse(body);
    if (json.status !== 'ok') {
      throw new Error(`Expected status ok, got ${json.status}`);
    }
  });

  await probe('Worker metrics', `${WORKER_BASE}/metrics`, (response, body) => {
    if (response.status !== 200) {
      throw new Error(`Expected HTTP 200, got ${response.status}`);
    }
    if (!body.includes('medease_queue')) {
      throw new Error('Prometheus metrics missing medease_queue series');
    }
  });

  console.log('\nPlatform smoke checks passed.');
}

main().catch((error) => {
  console.error(`\nPlatform smoke checks failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
