import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Load repo-root .env before worker boot (matches apps/api). */
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

const repoRoot = join(__dirname, '../../..');

loadEnvFile(join(repoRoot, '.env'));
loadEnvFile(join(repoRoot, 'database', '.env'), true);
