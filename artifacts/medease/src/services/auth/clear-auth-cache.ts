import { queryClient } from '@/services/api/query-client';
import { clearStoredSession } from '@/services/auth/session-storage';

/** Clears all client-side auth-related state on logout. */
export async function clearAuthCache(): Promise<void> {
  clearStoredSession();
  await queryClient.cancelQueries();
  queryClient.clear();
}
