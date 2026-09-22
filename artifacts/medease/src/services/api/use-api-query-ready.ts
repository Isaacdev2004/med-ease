import { useAuth } from '@/services/auth/auth-context';
import { useApiAuth } from '@/services/auth/auth-service';

/** True when authenticated API calls can attach a bearer token. */
export function useApiQueryReady(): boolean {
  const { session } = useAuth();
  return !useApiAuth || Boolean(session?.accessToken);
}
