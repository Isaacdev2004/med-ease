import { useLocation } from 'wouter';

import { BillingShell } from '@/features/billing/components/BillingShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type AdminSegment = 'billing' | 'revenue' | 'financial-reports' | 'claims' | 'payments';

function resolveSegment(location: string): AdminSegment {
  if (location.includes('/financial-reports')) return 'financial-reports';
  if (location.includes('/revenue')) return 'revenue';
  if (location.includes('/claims')) return 'claims';
  if (location.includes('/payments')) return 'payments';
  return 'billing';
}

function resolveBasePath(location: string, segment: AdminSegment) {
  if (segment === 'financial-reports') return resolveModuleBasePath(location, 'financial-reports');
  return resolveModuleBasePath(location, segment);
}

export default function AdminBillingPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  const basePath = resolveBasePath(location, segment);
  const titles: Record<AdminSegment, string> = {
    billing: 'Billing',
    revenue: 'Revenue',
    'financial-reports': 'Financial Reports',
    claims: 'Claims',
    payments: 'Payments',
  };
  return <BillingShell basePath={basePath} variant="admin" title={titles[segment]} />;
}
