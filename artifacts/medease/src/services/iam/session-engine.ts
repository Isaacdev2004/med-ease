import type { IamSession } from '@/services/iam/types';

export function isSessionExpired(session: IamSession): boolean {
  return new Date(session.expiresAt).getTime() < Date.now() || session.status !== 'active';
}

export function sessionDurationMinutes(session: IamSession): number {
  const start = new Date(session.startedAt).getTime();
  const end = session.status === 'active' ? Date.now() : new Date(session.lastActivityAt).getTime();
  return Math.round((end - start) / 60000);
}

export function activeSessionCount(sessions: IamSession[]): number {
  return sessions.filter((s) => s.status === 'active' && !isSessionExpired(s)).length;
}
