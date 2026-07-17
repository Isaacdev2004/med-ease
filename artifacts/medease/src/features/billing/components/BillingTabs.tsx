import { Link, useLocation } from 'wouter';

import type { BillingSection } from '@/features/billing/components/BillingSections';
import { cn } from '@/shared/lib/utils';

const PATIENT_TABS: {
  segment: BillingSection | '';
  label: string;
  path: string;
}[] = [
  { segment: '', label: 'Dashboard', path: 'billing' },
  { segment: 'invoices', label: 'Invoices', path: 'invoices' },
  { segment: 'payments', label: 'Payments', path: 'payments' },
  { segment: 'insurance', label: 'Insurance', path: 'insurance' },
  { segment: 'receipts', label: 'Receipts', path: 'receipts' },
];

type PortalTab = { segment: BillingSection; label: string; path: string };

const CLINICIAN_TABS: PortalTab[] = [
  { segment: 'dashboard', label: 'Billing', path: 'billing' },
  { segment: 'claims', label: 'Claims', path: 'claims' },
  { segment: 'payments', label: 'Payments', path: 'payments' },
  { segment: 'revenue', label: 'Revenue', path: 'revenue' },
];

const FACILITY_TABS: PortalTab[] = [
  { segment: 'dashboard', label: 'Billing', path: 'billing' },
  { segment: 'revenue', label: 'Revenue', path: 'revenue' },
  { segment: 'claims', label: 'Claims', path: 'claims' },
  { segment: 'payments', label: 'Payments', path: 'payments' },
];

const PHARMACY_TABS: PortalTab[] = [
  { segment: 'dashboard', label: 'Billing', path: 'billing' },
  { segment: 'payments', label: 'Payments', path: 'payments' },
  { segment: 'claims', label: 'Claims', path: 'claims' },
];

const ADMIN_TABS: PortalTab[] = [
  { segment: 'dashboard', label: 'Billing', path: 'billing' },
  { segment: 'revenue', label: 'Revenue', path: 'revenue' },
  { segment: 'financial-reports', label: 'Reports', path: 'financial-reports' },
  { segment: 'claims', label: 'Claims', path: 'claims' },
  { segment: 'payments', label: 'Payments', path: 'payments' },
];

interface BillingTabsProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'facility' | 'pharmacy' | 'admin';
}

function portalRoot(basePath: string, variant: BillingTabsProps['variant']) {
  if (variant === 'clinician')
    return basePath.replace(/\/(billing|claims|payments|revenue)$/, '');
  if (variant === 'facility')
    return basePath.replace(/\/(billing|revenue|claims|payments)$/, '');
  if (variant === 'pharmacy')
    return basePath.replace(/\/(billing|payments|claims)$/, '');
  if (variant === 'admin')
    return basePath.replace(
      /\/(billing|revenue|financial-reports|claims|payments)$/,
      '',
    );
  return basePath;
}

function PortalTabs({
  basePath,
  variant,
  tabs,
}: {
  basePath: string;
  variant: 'clinician' | 'facility' | 'pharmacy' | 'admin';
  tabs: PortalTab[];
}) {
  const [location] = useLocation();
  const root = portalRoot(basePath, variant);
  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Billing sections"
    >
      {tabs.map((tab) => {
        const href = `${root}/${tab.path}`;
        const active = location.includes(`/${tab.path}`);
        return (
          <Link
            key={tab.label}
            href={href}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            aria-current={active ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function BillingTabs({
  basePath,
  variant = 'patient',
}: BillingTabsProps) {
  const [location] = useLocation();
  if (variant === 'clinician')
    return (
      <PortalTabs
        basePath={basePath}
        variant="clinician"
        tabs={CLINICIAN_TABS}
      />
    );
  if (variant === 'facility')
    return (
      <PortalTabs basePath={basePath} variant="facility" tabs={FACILITY_TABS} />
    );
  if (variant === 'pharmacy')
    return (
      <PortalTabs basePath={basePath} variant="pharmacy" tabs={PHARMACY_TABS} />
    );
  if (variant === 'admin')
    return <PortalTabs basePath={basePath} variant="admin" tabs={ADMIN_TABS} />;

  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Billing sections"
    >
      {PATIENT_TABS.map((tab) => {
        const href = `/${tab.path}`;
        const active =
          tab.segment === ''
            ? location.endsWith('/billing') && !location.includes('/billing/')
            : location.includes(`/${tab.path.split('/').pop()}`);
        return (
          <Link
            key={tab.label}
            href={href}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
            aria-current={active ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function getBillingSectionFromPath(pathname: string): BillingSection {
  if (pathname.includes('/invoices')) return 'invoices';
  if (pathname.includes('/payments')) return 'payments';
  if (pathname.includes('/insurance')) return 'insurance';
  if (pathname.includes('/receipts')) return 'receipts';
  if (pathname.includes('/claims')) return 'claims';
  if (pathname.includes('/revenue')) return 'revenue';
  if (pathname.includes('/financial-reports')) return 'financial-reports';
  if (pathname.includes('/refunds')) return 'refunds';
  if (pathname.includes('/outstanding')) return 'outstanding';
  if (pathname.includes('/analytics')) return 'analytics';
  return 'dashboard';
}
