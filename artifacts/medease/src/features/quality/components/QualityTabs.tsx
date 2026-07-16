import { Link, useLocation } from 'wouter';

import type { QualitySection } from '@/features/quality/components/QualitySections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: QualitySection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Quality', path: 'quality' },
  { segment: 'incidents', label: 'Incidents', path: 'incidents' },
  { segment: 'policies', label: 'Policies', path: 'policies' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Quality', path: 'eqms' },
  { segment: 'incidents', label: 'Incidents', path: 'incidents' },
  { segment: 'infection', label: 'Infection Control', path: 'infection-control' },
  { segment: 'audits', label: 'Audits', path: 'eqms-audits' },
  { segment: 'compliance', label: 'Compliance', path: 'compliance' },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Quality', path: 'quality' },
  { segment: 'risks', label: 'Risk Register', path: 'risk-register' },
  { segment: 'capa', label: 'CAPA', path: 'capa' },
  { segment: 'accreditation', label: 'Accreditation', path: 'accreditation' },
  { segment: 'documents', label: 'Document Control', path: 'document-control' },
  { segment: 'regulatory', label: 'Regulatory', path: 'regulatory' },
  { segment: 'audits', label: 'Audits', path: 'eqms-audits' },
  { segment: 'analytics', label: 'Analytics', path: 'quality-analytics' },
];

interface QualityTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: QualityTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function QualityTabs({ basePath, variant = 'professional' }: QualityTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Quality sections">
      {tabs.map((tab) => {
        const href = flatModuleTabHref(tab.path);
        const active = location.includes(`/${tab.path}`);
        return (
          <Link key={tab.label} href={href} className={cn('rounded-md px-3 py-1.5 text-sm font-medium transition-colors', active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')} aria-current={active ? 'page' : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function getQualitySectionFromPath(pathname: string): QualitySection {
  if (pathname.includes('/incidents')) return 'incidents';
  if (pathname.includes('/policies')) return 'policies';
  if (pathname.includes('/infection-control')) return 'infection';
  if (pathname.includes('/eqms-audits')) return 'audits';
  if (pathname.includes('/compliance')) return 'compliance';
  if (pathname.includes('/risk-register')) return 'risks';
  if (pathname.includes('/capa')) return 'capa';
  if (pathname.includes('/accreditation')) return 'accreditation';
  if (pathname.includes('/document-control')) return 'documents';
  if (pathname.includes('/regulatory')) return 'regulatory';
  if (pathname.includes('/quality-analytics')) return 'analytics';
  if (pathname.includes('/eqms')) return 'dashboard';
  return 'dashboard';
}
