import { Link, useLocation } from 'wouter';

import type { AiIntelligenceSection } from '@/features/ai-intelligence/components/AiIntelligenceSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: AiIntelligenceSection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'dashboard', label: 'AI Hub', path: 'ai' },
  { segment: 'copilot', label: 'Clinical Copilot', path: 'clinical-copilot' },
  { segment: 'predictions', label: 'Predictions', path: 'predictions' },
  { segment: 'risk-scores', label: 'Risk Scores', path: 'risk-scores' },
  { segment: 'summaries', label: 'Clinical Summaries', path: 'clinical-summaries' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'AI Hub', path: 'ai' },
  { segment: 'forecasting', label: 'Operational Forecasting', path: 'operational-forecasting' },
  { segment: 'resource-predictions', label: 'Resource Predictions', path: 'resource-predictions' },
  { segment: 'capacity', label: 'Capacity Planning', path: 'capacity-planning' },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'hub', label: 'AI Hub', path: 'ai' },
  { segment: 'model-registry', label: 'Model Registry', path: 'model-registry' },
  { segment: 'model-monitoring', label: 'Model Monitoring', path: 'model-monitoring' },
  { segment: 'governance', label: 'Model Governance', path: 'model-governance' },
  { segment: 'bias', label: 'Bias Monitoring', path: 'bias-monitoring' },
  { segment: 'analytics', label: 'AI Analytics', path: 'ai-analytics' },
  { segment: 'audit', label: 'AI Audit', path: 'ai-audit' },
];

interface AiIntelligenceTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: AiIntelligenceTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function AiIntelligenceTabs({ basePath: _basePath, variant = 'professional' }: AiIntelligenceTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="AI intelligence sections">
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

export function getAiSectionFromPath(pathname: string, variant: 'professional' | 'facility' | 'admin' = 'professional'): AiIntelligenceSection {
  if (pathname.includes('/clinical-copilot')) return 'copilot';
  if (pathname.includes('/predictions')) return 'predictions';
  if (pathname.includes('/risk-scores')) return 'risk-scores';
  if (pathname.includes('/clinical-summaries')) return 'summaries';
  if (pathname.includes('/operational-forecasting')) return 'forecasting';
  if (pathname.includes('/resource-predictions')) return 'resource-predictions';
  if (pathname.includes('/capacity-planning')) return 'capacity';
  if (pathname.includes('/model-registry')) return 'model-registry';
  if (pathname.includes('/model-monitoring')) return 'model-monitoring';
  if (pathname.includes('/model-governance')) return 'governance';
  if (pathname.includes('/bias-monitoring')) return 'bias';
  if (pathname.includes('/ai-analytics')) return 'analytics';
  if (pathname.includes('/ai-audit')) return 'audit';
  if (variant === 'admin' && pathname.includes('/ai') && !pathname.includes('/ai-analytics') && !pathname.includes('/ai-audit')) return 'hub';
  return 'dashboard';
}
