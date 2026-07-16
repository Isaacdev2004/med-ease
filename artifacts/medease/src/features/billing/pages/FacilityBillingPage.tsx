import { useLocation } from 'wouter';

import { BillingShell } from '@/features/billing/components/BillingShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type FacilitySegment = 'billing' | 'revenue' | 'claims' | 'payments';

function resolveSegment(location: string): FacilitySegment {
  if (location.includes('/revenue')) return 'revenue';
  if (location.includes('/claims')) return 'claims';
  if (location.includes('/payments')) return 'payments';
  return 'billing';
}

export default function FacilityBillingPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  const basePath = resolveModuleBasePath(location, segment);
  const titles: Record<FacilitySegment, string> = {
    billing: 'Billing',
    revenue: 'Revenue',
    claims: 'Claims',
    payments: 'Payments',
  };
  return <BillingShell basePath={basePath} variant="facility" title={titles[segment]} facilityId="fac-001" />;
}
