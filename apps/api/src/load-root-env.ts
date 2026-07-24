import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Load repo-root .env before Nest boot; database/.env wins for Prisma CLI parity. */
function loadEnvFile(envPath: string, overwrite = false): void {
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!key) continue;
    if (overwrite || process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function envValue(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function withConnectTimeout(url: string): string {
  if (!url.includes('supabase') || url.includes('connect_timeout=')) {
    return url;
  }
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}connect_timeout=10`;
}

function normalizeDatabaseUrls(): void {
  const databaseUrl = envValue('DATABASE_URL');
  if (databaseUrl) {
    process.env.DATABASE_URL = withConnectTimeout(databaseUrl);
  }
  if (!envValue('DIRECT_URL') && databaseUrl) {
    process.env.DIRECT_URL = process.env.DATABASE_URL!;
  } else {
    const directUrl = envValue('DIRECT_URL');
    if (directUrl) {
      process.env.DIRECT_URL = withConnectTimeout(directUrl);
    }
  }
}

const repoRoot = join(__dirname, '../../..');

loadEnvFile(join(repoRoot, '.env'));
loadEnvFile(join(repoRoot, 'database', '.env'), true);
normalizeDatabaseUrls();
