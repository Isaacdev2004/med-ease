import { useAuthOptional } from '@/services/auth/auth-context';
import { useApiAuth } from '@/services/auth/auth-service';

const DEMO_TENANT_ID = 'tenant-001';

/** Tenant scope for API calls — uses the signed-in user in production, mock id in demo UI. */
export function useScopedTenantId(): string | undefined {
  const auth = useAuthOptional();
  const tenantId = auth?.user?.tenantId;

  if (tenantId) {
    return tenantId;
  }

  return useApiAuth ? undefined : DEMO_TENANT_ID;
}
