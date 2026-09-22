import { queryClient } from '@/services/api/query-client';
import { clearPersistedAuth } from '@/services/auth/auth-persistence';

/** Clears all client-side auth-related state on logout. */
export async function clearAuthCache(): Promise<void> {
  clearPersistedAuth();
  await queryClient.cancelQueries();
  queryClient.clear();
}
