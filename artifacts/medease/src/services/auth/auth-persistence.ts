import type { AuthSession } from '@/types/auth';

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

export { clearStoredSession, readStoredSessionRef };
