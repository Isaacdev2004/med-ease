import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

/** Database package root — Prisma CLI and seed run with cwd = database/. */
const databaseRoot = process.cwd();

function envValue(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function ensureDirectUrlFallback(): void {
  const databaseUrl = envValue('DATABASE_URL');
  if (!envValue('DIRECT_URL') && databaseUrl) {
    process.env.DIRECT_URL = databaseUrl;
  }
}

/** Load database/.env so Prisma CLI and seed scripts use Supabase (not stale shell env). */
export function loadDatabaseEnv(): void {
  const envPath = path.join(databaseRoot, '.env');
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const separator = trimmed.indexOf('=');
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim();
      if (key) {
        if (process.env.CI === 'true' && process.env[key] !== undefined) {
          continue;
        }
        process.env[key] = value;
      }
    }
  }

  ensureDirectUrlFallback();
}

ensureDirectUrlFallback();
