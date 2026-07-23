#!/usr/bin/env node
/**
 * Load repo-root and database/.env for CI scripts (Node does not load .env automatically).
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function loadEnvFile(envPath) {
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

const root = process.cwd();
loadEnvFile(join(root, '.env'));
loadEnvFile(join(root, 'database', '.env'));

if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}
