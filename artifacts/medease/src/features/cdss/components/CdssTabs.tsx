import { Link, useLocation } from 'wouter';

import type { CdssSection } from '@/features/cdss/components/CdssSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: CdssSection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Dashboard', path: 'cdss' },
  { segment: 'alerts', label: 'Alerts', path: 'clinical-alerts' },
  { segment: 'recommendations', label: 'Recommendations', path: 'recommendations' },
  { segment: 'guidelines', label: 'Guidelines', path: 'guidelines' },
  { segment: 'diagnostics', label: 'Diagnostic Support', path: 'cdss-diagnostics' },
  { segment: 'drug-safety', label: 'Drug Safety', path: 'cdss-drug-safety' },
  { segment: 'preventive', label: 'Preventive Care', path: 'cdss-preventive' },
  { segment: 'order-sets', label: 'Order Sets', path: 'order-sets' },
  { segment: 'calculators', label: 'Risk Calculators', path: 'risk-calculators' },
  { segment: 'analytics', label: 'Analytics', path: 'cdss-analytics' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Clinical Governance', path: 'cdss' },
  { segment: 'compliance', label: 'Guideline Compliance', path: 'guideline-compliance' },
  { segment: 'analytics', label: 'CDS Analytics', path: 'cdss-analytics' },
  { segment: 'protocols', label: 'Protocol Management', path: 'cdss-protocols' },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'rules', label: 'Rules Engine', path: 'rules-engine' },
  { segment: 'knowledge', label: 'Knowledge Base', path: 'knowledge-base' },
  { segment: 'guidelines', label: 'Guidelines', path: 'cdss-guidelines' },
  { segment: 'order-sets', label: 'Order Sets', path: 'cdss-order-sets' },
  { segment: 'analytics', label: 'CDS Analytics', path: 'cdss-analytics' },
  { segment: 'audit', label: 'Audit', path: 'cdss-audit' },
];

interface CdssTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: CdssTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function CdssTabs({ basePath: _basePath, variant = 'professional' }: CdssTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Clinical decision support sections">
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

export function getCdssSectionFromPath(pathname: string, variant: 'professional' | 'facility' | 'admin' = 'professional'): CdssSection {
  if (variant === 'admin' && (pathname.endsWith('/cdss') || pathname.includes('/cdss') && !pathname.includes('/cdss-'))) return 'rules';
  if (pathname.includes('/clinical-alerts')) return 'alerts';
  if (pathname.includes('/recommendations')) return 'recommendations';
  if (pathname.includes('/cdss-guidelines') || (variant !== 'admin' && pathname.includes('/guidelines'))) return 'guidelines';
  if (pathname.includes('/cdss-diagnostics')) return 'diagnostics';
  if (pathname.includes('/cdss-drug-safety')) return 'drug-safety';
  if (pathname.includes('/cdss-preventive')) return 'preventive';
  if (pathname.includes('/cdss-order-sets') || pathname.includes('/order-sets')) return 'order-sets';
  if (pathname.includes('/risk-calculators')) return 'calculators';
  if (pathname.includes('/cdss-analytics')) return 'analytics';
  if (pathname.includes('/clinical-governance')) return 'dashboard';
  if (pathname.includes('/guideline-compliance')) return 'compliance';
  if (pathname.includes('/cdss-protocols')) return 'protocols';
  if (pathname.includes('/rules-engine')) return 'rules';
  if (pathname.includes('/knowledge-base')) return 'knowledge';
  if (pathname.includes('/cdss-audit')) return 'audit';
  return 'dashboard';
}
