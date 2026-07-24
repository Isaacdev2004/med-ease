#!/usr/bin/env node
/**
 * Verify local env files have values for GitHub Actions secrets.
 * Does not print secret values — only names and lengths.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function parseEnvFile(path) {
  const values = new Map();
  if (!existsSync(path)) return values;

  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const i = trimmed.indexOf('=');
    if (i === -1) continue;
    const key = trimmed.slice(0, i).trim();
    const value = trimmed.slice(i + 1).trim();
    if (key && value) values.set(key, value);
  }
  return values;
}

const root = process.cwd();
const databaseEnv = parseEnvFile(join(root, 'database', '.env'));
const rootEnv = parseEnvFile(join(root, '.env'));

function pick(...keys) {
  for (const key of keys) {
    const fromDb = databaseEnv.get(key);
    if (fromDb) return fromDb;
    const fromRoot = rootEnv.get(key);
    if (fromRoot) return fromRoot;
  }
  return '';
}

const mappings = [
  {
    githubName: 'SUPABASE_DATABASE_URL',
    localKeys: ['DATABASE_URL'],
    required: true,
  },
  {
    githubName: 'SUPABASE_DIRECT_URL',
    localKeys: ['DIRECT_URL'],
    required: false,
  },
  {
    githubName: 'SUPABASE_URL',
    localKeys: ['SUPABASE_URL'],
    required: true,
  },
  {
    githubName: 'SUPABASE_ANON_KEY',
    localKeys: ['SUPABASE_ANON_KEY'],
    required: true,
  },
  {
    githubName: 'SUPABASE_SERVICE_ROLE_KEY',
    localKeys: ['SUPABASE_SERVICE_ROLE_KEY'],
    required: true,
  },
  {
    githubName: 'REDIS_URL',
    localKeys: ['REDIS_URL'],
    required: true,
  },
];

console.log('GitHub Actions secrets checklist\n');
console.log(
  'Add at: https://github.com/Isaacdev2004/med-ease/settings/secrets/actions',
);
console.log('Use "New repository secret" (Repository secrets tab)\n');

let missingRequired = 0;

for (const { githubName, localKeys, required } of mappings) {
  const value = pick(...localKeys);
  const localLabel = localKeys.join(' or ');
  if (!value) {
    const tag = required ? 'MISSING (required)' : 'MISSING (optional)';
    console.log(`✗ ${githubName} ← ${localLabel} — ${tag}`);
    if (required) missingRequired += 1;
    continue;
  }

  const preview =
    value.length > 12
      ? `${value.slice(0, 6)}…${value.slice(-4)} (${value.length} chars)`
      : `(set, ${value.length} chars)`;
  console.log(`✓ ${githubName} ← ${localLabel} — ${preview}`);
}

console.log('');

if (missingRequired > 0) {
  console.log(
    `Fix ${missingRequired} missing local value(s) in database/.env or .env first.`,
  );
  process.exit(1);
}

console.log('Local env is ready. Copy each value into GitHub manually:');
console.log('');
console.log('  1. Open the secrets URL above');
console.log('  2. Click "New repository secret"');
console.log('  3. Name = GitHub secret name (e.g. SUPABASE_DATABASE_URL)');
console.log(
  '  4. Secret = matching line from database/.env (full value after =)',
);
console.log('  5. Repeat for all 6 secrets');
console.log('  6. Actions → Re-run all jobs');
console.log('');
console.log(
  'Important: GitHub name is SUPABASE_DATABASE_URL, not DATABASE_URL.',
);
