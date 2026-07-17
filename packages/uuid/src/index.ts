import { createHash } from 'node:crypto';

import { v5 as uuidv5, v7 as uuidv7 } from 'uuid';

/** Med-Ease namespace for deterministic UUID v5 seeds (ADR-0005). */
export const MEDEASE_UUID_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

/** Generate a time-ordered UUID v7 primary key. */
export function newId(): string {
  return uuidv7();
}

/** Deterministic UUID v5 for seed data aligned with frontend mock IDs. */
export function deterministicId(
  name: string,
  namespace: string = MEDEASE_UUID_NAMESPACE,
): string {
  return uuidv5(name, namespace);
}

/** Optional checksum helper for seed batch verification. */
export function checksum(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export { uuidv7, uuidv5 };
