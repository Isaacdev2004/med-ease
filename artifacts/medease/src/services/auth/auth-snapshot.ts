import type { LoginResult } from '@/types/auth';

import type { StoredSessionRef } from '@/services/auth/types';

const SNAPSHOT_KEY = 'medease.auth.snapshot';

type AuthSnapshot = Pick<LoginResult, 'user' | 'organization'>;

export function persistAuthSnapshot(result: LoginResult): void {
  try {
    const snapshot: AuthSnapshot = {
      user: result.user,
      organization: result.organization,
    };
    window.localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch {
    // Storage may be unavailable in private mode.
  }
}

export function readAuthSnapshot(): AuthSnapshot | null {
  try {
    const raw = window.localStorage.getItem(SNAPSHOT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSnapshot;
  } catch {
    return null;
  }
}

export function clearAuthSnapshot(): void {
  window.localStorage.removeItem(SNAPSHOT_KEY);
}

export function buildLoginResultFromSnapshot(
  ref: StoredSessionRef,
  snapshot: AuthSnapshot,
  session: LoginResult['session'],
): LoginResult {
  return {
    user: snapshot.user,
    organization: snapshot.organization,
    session,
  };
}
