import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const dockerDir = join(scriptDir, '..');

function loadEnv(path) {
  const env = { ...process.env };
  if (!existsSync(path)) {
    return env;
  }
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const separator = trimmed.indexOf('=');
    if (separator === -1) {
      continue;
    }
    env[trimmed.slice(0, separator)] = trimmed.slice(separator + 1);
  }
  return env;
}

const env = loadEnv(join(dockerDir, '.env'));

console.log('==> Docker Compose service status\n');
execSync('docker compose -f compose.yml -f compose.override.yml --env-file .env ps', {
  cwd: dockerDir,
  stdio: 'inherit',
  shell: true,
});

async function probe(label, url) {
  process.stdout.write(`\n==> ${label}\n`);
  const response = await fetch(url);
  const body = await response.text();
  process.stdout.write(`${body.slice(0, 2000)}\n`);
  if (!response.ok) {
    throw new Error(`${label} failed with HTTP ${response.status}`);
  }
}

const apiPort = env.API_PORT ?? '3000';
const workerPort = env.WORKER_PORT ?? '3001';
const opensearchPort = env.OPENSEARCH_PORT ?? '9200';
const mailpitPort = env.MAILPIT_UI_PORT ?? '8025';

try {
  await probe('API liveness', `http://localhost:${apiPort}/api/healthz`);
  await probe('API readiness', `http://localhost:${apiPort}/api/healthz/ready`);
  await probe('Worker health', `http://localhost:${workerPort}/healthz`);
  await probe('OpenSearch cluster health', `http://localhost:${opensearchPort}/_cluster/health`);
  await probe('Mailpit livez', `http://localhost:${mailpitPort}/livez`);
  console.log('\nAll probes completed successfully.');
} catch (error) {
  console.error(`\nHealth verification failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
