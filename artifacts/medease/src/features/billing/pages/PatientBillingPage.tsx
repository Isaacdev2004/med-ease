import { useLocation } from 'wouter';

import { BillingShell } from '@/features/billing/components/BillingShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

function resolvePatientBasePath(location: string) {
  if (location.includes('/invoices')) return resolveModuleBasePath(location, 'invoices');
  if (location.includes('/payments')) return resolveModuleBasePath(location, 'payments');
  if (location.includes('/insurance')) return resolveModuleBasePath(location, 'insurance');
  if (location.includes('/receipts')) return resolveModuleBasePath(location, 'receipts');
  return resolveModuleBasePath(location, 'billing');
}

function resolveTitle(location: string) {
  if (location.includes('/invoices')) return 'Invoices';
  if (location.includes('/payments')) return 'Payments';
  if (location.includes('/insurance')) return 'Insurance';
  if (location.includes('/receipts')) return 'Receipts';
  return 'Billing';
}

export default function PatientBillingPage() {
  const [location] = useLocation();
  return <BillingShell basePath={resolvePatientBasePath(location)} variant="patient" title={resolveTitle(location)} />;
}
