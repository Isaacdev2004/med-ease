#!/usr/bin/env node
/**
 * Starts API + worker, runs smoke checks, then shuts down child processes.
 */
import { spawn, spawnSync } from 'node:child_process';
import { join } from 'node:path';

const root = process.cwd();

function startService(name, cwd, entry, env = {}) {
  const child = spawn(process.execPath, [entry], {
    cwd,
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  child.stdout.on('data', (chunk) => process.stdout.write(`[${name}] ${chunk}`));
  child.stderr.on('data', (chunk) => process.stderr.write(`[${name}] ${chunk}`));

  return child;
}

function runStep(label, scriptPath, extraEnv = {}) {
  process.stdout.write(`\n==> ${label}\n`);
  const result = spawnSync(process.execPath, [scriptPath], {
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  });
  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status ?? 1}`);
  }
}

const worker = startService('worker', join(root, 'apps/worker'), 'dist/main.js', {
  PORT: process.env.WORKER_PORT ?? '3001',
});
const api = startService('api', join(root, 'apps/api'), 'dist/main.js', {
  PORT: process.env.API_PORT ?? '3000',
});

function shutdown() {
  for (const [name, child] of [
    ['worker', worker],
    ['api', api],
  ]) {
    if (!child.killed) {
      console.log(`Stopping ${name} (pid ${child.pid})`);
      child.kill('SIGTERM');
    }
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

try {
  runStep('Platform smoke', join(root, 'scripts/ci/smoke-platform.mjs'));
  runStep('Platform E2E (IAM)', join(root, 'scripts/ci/e2e-platform.mjs'));
  runStep('Patients E2E certification', join(root, 'scripts/ci/e2e-patients.mjs'));
  runStep('HTTP repository contract tests', join(root, 'scripts/ci/run-http-contract.mjs'));
  runStep('OpenAPI regeneration gate', join(root, 'scripts/ci/verify-openapi-regen.mjs'));
} catch (error) {
  shutdown();
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

shutdown();
process.exit(0);
