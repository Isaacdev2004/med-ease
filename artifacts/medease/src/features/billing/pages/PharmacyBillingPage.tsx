import { useLocation } from 'wouter';

import { BillingShell } from '@/features/billing/components/BillingShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type PharmacySegment = 'billing' | 'payments' | 'claims';

function resolveSegment(location: string): PharmacySegment {
  if (location.includes('/payments')) return 'payments';
  if (location.includes('/claims')) return 'claims';
  return 'billing';
}

export default function PharmacyBillingPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  const basePath = resolveModuleBasePath(location, segment);
  const titles: Record<PharmacySegment, string> = { billing: 'Billing', payments: 'Payments', claims: 'Claims' };
  return <BillingShell basePath={basePath} variant="pharmacy" title={titles[segment]} />;
}
