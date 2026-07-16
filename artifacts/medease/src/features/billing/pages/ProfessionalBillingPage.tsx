import { useLocation } from 'wouter';

import { BillingShell } from '@/features/billing/components/BillingShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

function resolveProfessionalBasePath(location: string) {
  if (location.includes('/claims')) return resolveModuleBasePath(location, 'claims');
  if (location.includes('/payments')) return resolveModuleBasePath(location, 'payments');
  if (location.includes('/revenue')) return resolveModuleBasePath(location, 'revenue');
  return resolveModuleBasePath(location, 'billing');
}

function resolveTitle(location: string) {
  if (location.includes('/claims')) return 'Insurance Claims';
  if (location.includes('/payments')) return 'Payments';
  if (location.includes('/revenue')) return 'Revenue';
  return 'Billing';
}

export default function ProfessionalBillingPage() {
  const [location] = useLocation();
  return (
    <BillingShell
      basePath={resolveProfessionalBasePath(location)}
      variant="clinician"
      title={resolveTitle(location)}
      providerId="prov-001"
    />
  );
}
