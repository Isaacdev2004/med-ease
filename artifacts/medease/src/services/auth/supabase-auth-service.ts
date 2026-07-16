import type { AuthService } from '@/services/auth/types';

/** Placeholder for future Supabase Auth integration. */
export const supabaseAuthService: AuthService = {
  getStoredSessionRef() {
    throw new Error('Supabase auth is not configured.');
  },
  restoreSession() {
    throw new Error('Supabase auth is not configured.');
  },
  signIn() {
    throw new Error('Supabase auth is not configured.');
  },
  signOut() {
    throw new Error('Supabase auth is not configured.');
  },
  refreshSession() {
    throw new Error('Supabase auth is not configured.');
  },
};
