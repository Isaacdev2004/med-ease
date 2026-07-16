import { useLocation } from 'wouter';

import { CdssShell } from '@/features/cdss/components/CdssShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'cdss' | 'clinical-alerts' | 'recommendations' | 'guidelines' | 'order-sets' | 'risk-calculators' | 'cdss-diagnostics' | 'cdss-drug-safety' | 'cdss-preventive' | 'cdss-analytics';

function resolveSegment(location: string): Segment {
  if (location.includes('/clinical-alerts')) return 'clinical-alerts';
  if (location.includes('/recommendations')) return 'recommendations';
  if (location.includes('/guidelines')) return 'guidelines';
  if (location.includes('/cdss-diagnostics')) return 'cdss-diagnostics';
  if (location.includes('/cdss-drug-safety')) return 'cdss-drug-safety';
  if (location.includes('/cdss-preventive')) return 'cdss-preventive';
  if (location.includes('/order-sets')) return 'order-sets';
  if (location.includes('/risk-calculators')) return 'risk-calculators';
  if (location.includes('/cdss-analytics')) return 'cdss-analytics';
  return 'cdss';
}

const TITLES: Record<Segment, string> = {
  cdss: 'CDSS Dashboard',
  'clinical-alerts': 'Clinical Alerts',
  recommendations: 'Clinical Recommendations',
  guidelines: 'Evidence-Based Guidelines',
  'cdss-diagnostics': 'Diagnostic Support',
  'cdss-drug-safety': 'Drug Safety',
  'cdss-preventive': 'Preventive Care',
  'order-sets': 'Order Sets',
  'risk-calculators': 'Risk Calculators',
  'cdss-analytics': 'CDSS Analytics',
};

export default function ProfessionalCdssPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <CdssShell basePath={resolveModuleBasePath(location, segment)} variant="professional" title={TITLES[segment]} />;
}
