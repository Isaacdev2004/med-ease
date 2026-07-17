import { Link, useLocation } from 'wouter';

import type { InteropSection } from '@/features/interoperability/components/InteropSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: InteropSection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  {
    segment: 'dashboard',
    label: 'Integration Status',
    path: 'interoperability',
  },
  {
    segment: 'external-records',
    label: 'External Records',
    path: 'external-records',
  },
  { segment: 'fhir', label: 'FHIR Exchange', path: 'interop-fhir' },
  { segment: 'dicom', label: 'DICOM Exchange', path: 'interop-dicom' },
];

const FACILITY_TABS: Tab[] = [
  {
    segment: 'dashboard',
    label: 'Integration Dashboard',
    path: 'interoperability',
  },
  {
    segment: 'interface-engine',
    label: 'Interface Engine',
    path: 'interface-engine',
  },
  { segment: 'queue', label: 'Queue Monitor', path: 'integration-queue' },
  { segment: 'webhooks', label: 'Webhooks', path: 'webhooks' },
  { segment: 'api-clients', label: 'API Clients', path: 'api-clients' },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'hub', label: 'Integration Hub', path: 'interoperability' },
  { segment: 'fhir-servers', label: 'FHIR Servers', path: 'fhir-servers' },
  { segment: 'hl7', label: 'HL7 Messages', path: 'interop-hl7' },
  { segment: 'dicom', label: 'DICOM', path: 'interop-dicom-admin' },
  { segment: 'cda', label: 'CDA', path: 'interop-cda' },
  { segment: 'smart-apps', label: 'SMART Apps', path: 'smart-apps' },
  { segment: 'api-gateway', label: 'API Gateway', path: 'api-gateway' },
  { segment: 'terminology', label: 'Terminology', path: 'terminology' },
  { segment: 'audit', label: 'Audit Logs', path: 'integration-audit' },
  {
    segment: 'analytics',
    label: 'Analytics',
    path: 'interoperability-analytics',
  },
];

interface InteropTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: InteropTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function InteropTabs({
  basePath: _basePath,
  variant = 'professional',
}: InteropTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav
      className="flex flex-wrap gap-1 border-b pb-2"
      aria-label="Interoperability sections"
    >
      {tabs.map((tab) => {
        const href = flatModuleTabHref(tab.path);
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

export function getInteropSectionFromPath(
  pathname: string,
  variant: 'professional' | 'facility' | 'admin' = 'professional',
): InteropSection {
  if (pathname.includes('/external-records')) return 'external-records';
  if (pathname.includes('/interop-fhir') || pathname.includes('/fhir-servers'))
    return variant === 'admin' ? 'fhir-servers' : 'fhir';
  if (pathname.includes('/interop-dicom-admin')) return 'dicom';
  if (pathname.includes('/interop-dicom')) return 'dicom';
  if (pathname.includes('/interface-engine')) return 'interface-engine';
  if (pathname.includes('/integration-queue')) return 'queue';
  if (pathname.includes('/webhooks')) return 'webhooks';
  if (pathname.includes('/api-clients')) return 'api-clients';
  if (pathname.includes('/interop-hl7')) return 'hl7';
  if (pathname.includes('/interop-cda')) return 'cda';
  if (pathname.includes('/smart-apps')) return 'smart-apps';
  if (pathname.includes('/api-gateway')) return 'api-gateway';
  if (pathname.includes('/terminology')) return 'terminology';
  if (pathname.includes('/integration-audit')) return 'audit';
  if (pathname.includes('/interoperability-analytics')) return 'analytics';
  if (
    variant === 'admin' &&
    pathname.includes('/interoperability') &&
    !pathname.includes('/interoperability-analytics')
  )
    return 'hub';
  return 'dashboard';
}
