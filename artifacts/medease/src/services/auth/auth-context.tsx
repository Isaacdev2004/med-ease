import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  canAccessPortal,
  getPortalForRole,
  hasPermission,
} from '@/config/permissions';
import { env } from '@/config/env';
import { PORTAL_PATHS, type PortalId } from '@/config/routes';
import { trackAuthEvent } from '@/services/auth/audit-events';
import { authService } from '@/services/auth/auth-service';
import { persistAuthSession } from '@/services/auth/demo-auth-service';
import { clearAuthCache } from '@/services/auth/clear-auth-cache';
import { toFriendlyAuthError } from '@/services/auth/types';
import type {
  AuthError,
  AuthSession,
  AuthState,
  AuthUser,
  LoginCredentials,
  Organization,
  UserRole,
} from '@/types/auth';

interface AuthContextValue {
  authState: AuthState;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOffline: boolean;
  user: AuthUser | null;
  session: AuthSession | null;
  organization: Organization | null;
  activeRole: UserRole | null;
  permissions: string[];
  error: AuthError | null;
  defaultPortalPath: string;
  login: (credentials: LoginCredentials) => Promise<string>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  switchRole: (role: UserRole) => Promise<string>;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  canAccessPortal: (portalId: PortalId) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

function applyAuthResult(
  result: Awaited<ReturnType<typeof authService.signIn>>,
  setUser: (u: AuthUser) => void,
  setSession: (s: AuthSession) => void,
  setOrganization: (o: Organization) => void,
) {
  setUser(result.user);
  setSession(result.session);
  setOrganization(result.organization);
  persistAuthSession(result.user.id, result.session);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>('authenticating');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [error, setError] = useState<AuthError | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOnline = () => {
      setIsOffline(false);
      setAuthState((current) =>
        current === 'offline' ? 'authenticated' : current,
      );
    };
    const goOffline = () => {
      setIsOffline(true);
      setAuthState((current) =>
        current === 'authenticated' ? 'offline' : current,
      );
    };

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setAuthState('authenticating');
      const ref = authService.getStoredSessionRef();

      if (!ref) {
        if (!cancelled) setAuthState('unauthenticated');
        return;
      }

      try {
        const restored = await authService.restoreSession(ref);
        if (cancelled) return;

        if (!restored) {
          await clearAuthCache();
          setAuthState('session_expired');
          return;
        }

        applyAuthResult(restored, setUser, setSession, setOrganization);
        setAuthState(navigator.onLine ? 'authenticated' : 'offline');
      } catch {
        if (!cancelled) {
          await clearAuthCache();
          setAuthState('unauthenticated');
        }
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    if (!session) return false;

    setAuthState((s) =>
      s === 'authenticated' || s === 'offline' ? 'refreshing' : s,
    );

    try {
      const refreshed = await authService.refreshSession(session);
      if (!refreshed) {
        trackAuthEvent('session_timeout');
        await clearAuthCache();
        setUser(null);
        setSession(null);
        setOrganization(null);
        setAuthState('session_expired');
        return false;
      }

      setSession(refreshed);
      if (user) persistAuthSession(user.id, refreshed);
      setAuthState(navigator.onLine ? 'authenticated' : 'offline');
      trackAuthEvent('session_refresh');
      return true;
    } catch {
      trackAuthEvent('session_timeout');
      await clearAuthCache();
      setUser(null);
      setSession(null);
      setOrganization(null);
      setAuthState('session_expired');
      return false;
    }
  }, [session, user]);

  useEffect(() => {
    if (authState !== 'authenticated' && authState !== 'offline') return;
    if (!session) return;

    const interval = window.setInterval(() => {
      void refreshSession();
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [authState, session, refreshSession]);

  const permissions = useMemo(
    () => user?.permissions ?? [],
    [user?.permissions],
  );
  const activeRole = user?.role ?? null;

  const login = useCallback(async (credentials: LoginCredentials) => {
    setError(null);
    setAuthState('authenticating');

    try {
      const result = await authService.signIn(credentials);
      applyAuthResult(result, setUser, setSession, setOrganization);
      setAuthState(navigator.onLine ? 'authenticated' : 'offline');
      trackAuthEvent('login', { rememberMe: Boolean(credentials.rememberMe) });
      return PORTAL_PATHS[getPortalForRole(result.user.role)];
    } catch (err) {
      const code = err instanceof Error ? err.message : 'unknown';
      const friendly = toFriendlyAuthError(code);
      setError({ code: code as AuthError['code'], message: friendly.message });
      setAuthState('unauthenticated');
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthState('logging_out');
    trackAuthEvent('logout');
    await authService.signOut();
    await clearAuthCache();
    setUser(null);
    setSession(null);
    setOrganization(null);
    setAuthState('unauthenticated');
  }, []);

  const switchRole = useCallback(
    async (role: UserRole) => {
      if (!env.isDev || !authService.switchRole) {
        return PORTAL_PATHS[getPortalForRole(user?.role ?? 'patient')];
      }

      const result = await authService.switchRole(role);
      applyAuthResult(result, setUser, setSession, setOrganization);
      setAuthState(navigator.onLine ? 'authenticated' : 'offline');
      return PORTAL_PATHS[getPortalForRole(role)];
    },
    [user?.role],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      authState,
      isAuthenticated: authState === 'authenticated' || authState === 'offline',
      isLoading:
        authState === 'authenticating' ||
        authState === 'refreshing' ||
        authState === 'logging_out',
      isOffline,
      user,
      session,
      organization,
      activeRole,
      permissions,
      error,
      defaultPortalPath: user
        ? PORTAL_PATHS[getPortalForRole(user.role)]
        : PORTAL_PATHS.patient,
      login,
      logout,
      refreshSession,
      switchRole,
      clearError: () => setError(null),
      hasPermission: (permission: string) =>
        hasPermission(permissions, permission),
      canAccessPortal: (portalId: PortalId) =>
        user ? canAccessPortal(user.role, portalId) : false,
    }),
    [
      authState,
      isOffline,
      user,
      session,
      organization,
      activeRole,
      permissions,
      error,
      login,
      logout,
      refreshSession,
      switchRole,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function useAuthOptional() {
  return useContext(AuthContext);
}
