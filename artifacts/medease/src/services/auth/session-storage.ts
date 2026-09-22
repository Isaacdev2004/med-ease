const SESSION_KEY = 'medease.session';
const LOCAL_SESSION_KEY = 'medease.session.local';

import type { StoredSessionRef } from '@/services/auth/types';

/** Stores only minimal session reference — never passwords or permissions. */
export const sessionStorage = {
  read(): StoredSessionRef | null {
    try {
      const raw = window.sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as StoredSessionRef;
    } catch {
      return null;
    }
  },

  write(ref: StoredSessionRef): void {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(ref));
  },

  clear(): void {
    window.sessionStorage.removeItem(SESSION_KEY);
  },
};

const REMEMBER_KEY = 'medease.remember';

export const rememberStorage = {
  read(): StoredSessionRef | null {
    try {
      const raw = window.localStorage.getItem(REMEMBER_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as StoredSessionRef;
    } catch {
      return null;
    }
  },

  write(ref: StoredSessionRef): void {
    window.localStorage.setItem(REMEMBER_KEY, JSON.stringify(ref));
  },

  clear(): void {
    window.localStorage.removeItem(REMEMBER_KEY);
  },
};

const localSessionStorage = {
  read(): StoredSessionRef | null {
    try {
      const raw = window.localStorage.getItem(LOCAL_SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as StoredSessionRef;
    } catch {
      return null;
    }
  },

  write(ref: StoredSessionRef): void {
    window.localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(ref));
  },

  clear(): void {
    window.localStorage.removeItem(LOCAL_SESSION_KEY);
  },
};

export function readStoredSessionRef(): StoredSessionRef | null {
  const session = sessionStorage.read();
  if (session) return session;

  const localSession = localSessionStorage.read();
  if (localSession) return localSession;

  return rememberStorage.read();
}

export function persistSessionRef(ref: StoredSessionRef): void {
  sessionStorage.write(ref);
  localSessionStorage.write(ref);

  if (ref.rememberMe) {
    rememberStorage.write(ref);
  } else {
    rememberStorage.clear();
  }
}

export function clearStoredSession(): void {
  sessionStorage.clear();
  localSessionStorage.clear();
  rememberStorage.clear();
}
