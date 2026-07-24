import type {
  AuthSession,
  LoginCredentials,
  LoginResult,
  UserRole,
} from '@/types/auth';
import {
  buildDemoUser,
  findDemoAccount,
  getDemoAccountById,
  getDemoAccountForRole,
  getDemoOrganization,
} from '@/services/auth/demo-users';
import {
  clearStoredSession,
  readStoredSessionRef,
} from '@/services/auth/session-storage';
import type { AuthService, StoredSessionRef } from '@/services/auth/types';

const SESSION_TTL_MS = 60 * 60 * 1000;
const REMEMBER_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function createSession(rememberMe?: boolean): AuthSession {
  const ttl = rememberMe ? REMEMBER_TTL_MS : SESSION_TTL_MS;
  return {
    accessToken: crypto.randomUUID(),
    refreshToken: crypto.randomUUID(),
    expiresAt: Date.now() + ttl,
    rememberMe,
  };
}

function buildResult(
  account: ReturnType<typeof findDemoAccount>,
  rememberMe?: boolean,
): LoginResult {
  if (!account) {
    throw new Error('invalid_credentials');
  }

  const session = createSession(rememberMe);
  return {
    user: buildDemoUser(account),
    session,
    organization: getDemoOrganization(),
  };
}

/** Demo auth service — replace with SupabaseAuthService in production. */
export const demoAuthService: AuthService = {
  getStoredSessionRef() {
    return readStoredSessionRef();
  },

  async restoreSession(ref: StoredSessionRef) {
    if (ref.expiresAt <= Date.now()) {
      return null;
    }

    const account = getDemoAccountById(ref.userId);
    if (!account) return null;

    const session = createSession(ref.rememberMe);
    session.expiresAt = ref.expiresAt;

    return {
      user: buildDemoUser(account),
      session,
      organization: getDemoOrganization(),
    };
  },

  async signIn(credentials: LoginCredentials) {
    const account = findDemoAccount(credentials.email, credentials.password);
    if (!account) {
      throw new Error('invalid_credentials');
    }

    if (account.user.status === 'disabled') {
      throw new Error('account_disabled');
    }

    return buildResult(account, credentials.rememberMe);
  },

  async signOut() {
    clearStoredSession();
  },

  async refreshSession(session: AuthSession) {
    if (session.expiresAt <= Date.now()) {
      return null;
    }

    const ttl = session.rememberMe ? REMEMBER_TTL_MS : SESSION_TTL_MS;
    return {
      ...session,
      accessToken: crypto.randomUUID(),
      expiresAt: Date.now() + ttl,
    };
  },

  async switchRole(role: UserRole) {
    const account = getDemoAccountForRole(role);
    return buildResult(account, false);
  },
};
