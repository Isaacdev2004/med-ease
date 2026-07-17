#!/usr/bin/env node
/**
 * Regenerates OpenAPI client artifacts and fails if manual edits would be required.
 */
import { spawnSync } from 'node:child_process';
import { execSync } from 'node:child_process';

const root = process.cwd();

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('pnpm', ['--filter', '@medease/api', 'run', 'openapi:export']);
run('pnpm', ['--filter', '@workspace/api-spec', 'run', 'codegen']);

let diff = '';
try {
  diff = execSync(
    'git diff --name-only lib/api-client-react/src/generated lib/api-spec/openapi.yaml lib/api-zod/src/generated',
    {
      encoding: 'utf8',
    },
  ).trim();
} catch {
  diff = '';
}

if (diff) {
  console.error('\nOpenAPI regeneration produced unexpected diffs:');
  console.error(diff);
  process.exit(1);
}

console.log('\nOpenAPI regeneration check passed (no drift).');
