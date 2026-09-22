import type { AuthSession, LoginResult } from '@/types/auth';

import {
  clearAuthSnapshot,
  persistAuthSnapshot,
} from '@/services/auth/auth-snapshot';
import {
  clearStoredSession,
  persistSessionRef,
  readStoredSessionRef,
} from '@/services/auth/session-storage';
import type { StoredSessionRef } from '@/services/auth/types';

export function toStoredRef(
  userId: string,
  session: AuthSession,
): StoredSessionRef {
  return {
    userId,
    expiresAt: session.expiresAt,
    rememberMe: session.rememberMe,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  };
}

export function persistAuthSession(userId: string, session: AuthSession): void {
  persistSessionRef(toStoredRef(userId, session));
}

export function persistAuthLoginResult(result: LoginResult): void {
  persistAuthSession(result.user.id, result.session);
  persistAuthSnapshot(result);
}

export function clearPersistedAuth(): void {
  clearStoredSession();
  clearAuthSnapshot();
}

export { clearStoredSession, readStoredSessionRef };
