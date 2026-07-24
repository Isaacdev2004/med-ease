import type {
  AuthSession,
  LoginCredentials,
  LoginResult,
  UserRole,
} from '@/types/auth';

import { getApiBaseUrl } from '@/services/api/configure-api-client';
import {
  clearStoredSession,
  readStoredSessionRef,
} from '@/services/auth/auth-persistence';
import type { AuthService, StoredSessionRef } from '@/services/auth/types';

const ACCESS_REFRESH_BUFFER_MS = 60_000;

function apiRoot(): string {
  const base = getApiBaseUrl().replace(/\/$/, '');
  if (!base) {
    throw new Error('network_error');
  }
  return `${base}/api`;
}

async function parseAuthError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { code?: string; message?: string };
    if (body.code && typeof body.code === 'string') {
      return body.code;
    }
  } catch {
    // fall through
  }

  if (response.status === 401) return 'session_expired';
  if (response.status >= 500) return 'network_error';
  return 'unknown';
}

function mapLoginResult(json: LoginResult): LoginResult {
  return {
    user: {
      ...json.user,
      role: json.user.role as UserRole,
    },
    session: {
      accessToken: json.session.accessToken,
      expiresAt: json.session.expiresAt,
      rememberMe: json.session.rememberMe,
      refreshToken: json.session.refreshToken,
    },
    organization: json.organization,
  };
}

async function fetchLogin(credentials: LoginCredentials): Promise<LoginResult> {
  const response = await fetch(`${apiRoot()}/auth/login`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
      rememberMe: credentials.rememberMe ?? false,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseAuthError(response));
  }

  return mapLoginResult((await response.json()) as LoginResult);
}

async function fetchRefresh(refreshToken: string): Promise<AuthSession | null> {
  const response = await fetch(`${apiRoot()}/auth/refresh`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as {
    accessToken: string;
    expiresAt: number;
    refreshToken?: string;
  };

  return {
    accessToken: json.accessToken,
    expiresAt: json.expiresAt,
    refreshToken: json.refreshToken ?? refreshToken,
  };
}

async function fetchMe(accessToken: string): Promise<LoginResult | null> {
  const response = await fetch(`${apiRoot()}/auth/me`, {
    headers: {
      accept: 'application/json',
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as LoginResult;
  return {
    ...mapLoginResult(json),
    session: {
      accessToken,
      expiresAt: json.session.expiresAt,
      rememberMe: json.session.rememberMe,
      refreshToken: json.session.refreshToken,
    },
  };
}

async function restoreFromRef(
  ref: StoredSessionRef,
): Promise<LoginResult | null> {
  const accessStillValid =
    ref.accessToken && ref.expiresAt > Date.now() + ACCESS_REFRESH_BUFFER_MS;

  if (accessStillValid && ref.accessToken) {
    const me = await fetchMe(ref.accessToken);
    if (me) {
      return {
        ...me,
        session: {
          accessToken: ref.accessToken,
          expiresAt: ref.expiresAt,
          rememberMe: ref.rememberMe,
          refreshToken: ref.refreshToken,
        },
      };
    }
  }

  if (!ref.refreshToken) {
    return null;
  }

  const refreshed = await fetchRefresh(ref.refreshToken);
  if (!refreshed) {
    return null;
  }

  const me = await fetchMe(refreshed.accessToken);
  if (!me) {
    return null;
  }

  return {
    ...me,
    session: {
      ...refreshed,
      rememberMe: ref.rememberMe,
    },
  };
}

/** NestJS JWT auth — used when VITE_API_BASE_URL is configured. */
export const apiAuthService: AuthService = {
  getStoredSessionRef() {
    return readStoredSessionRef();
  },

  async restoreSession(ref: StoredSessionRef) {
    try {
      return await restoreFromRef(ref);
    } catch {
      return null;
    }
  },

  async signIn(credentials: LoginCredentials) {
    return fetchLogin(credentials);
  },

  async signOut() {
    const ref = readStoredSessionRef();
    if (ref?.refreshToken) {
      try {
        await fetch(`${apiRoot()}/auth/logout`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ refreshToken: ref.refreshToken }),
        });
      } catch {
        // Best-effort revoke; clear local session regardless.
      }
    }
    clearStoredSession();
  },

  async refreshSession(session: AuthSession) {
    if (!session.refreshToken) {
      return null;
    }

    try {
      const refreshed = await fetchRefresh(session.refreshToken);
      if (!refreshed) {
        return null;
      }

      return {
        ...session,
        ...refreshed,
        rememberMe: session.rememberMe,
      };
    } catch {
      return null;
    }
  },
};
