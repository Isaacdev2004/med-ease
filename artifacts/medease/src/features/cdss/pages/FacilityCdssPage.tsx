import { useLocation } from 'wouter';

import { CdssShell } from '@/features/cdss/components/CdssShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'cdss' | 'clinical-governance' | 'guideline-compliance' | 'cdss-protocols' | 'cdss-analytics';

function resolveSegment(location: string): Segment {
  if (location.includes('/clinical-governance')) return 'clinical-governance';
  if (location.includes('/guideline-compliance')) return 'guideline-compliance';
  if (location.includes('/cdss-protocols')) return 'cdss-protocols';
  if (location.includes('/cdss-analytics')) return 'cdss-analytics';
  return 'cdss';
}

const TITLES: Record<Segment, string> = {
  cdss: 'Clinical Governance',
  'clinical-governance': 'Clinical Governance',
  'guideline-compliance': 'Guideline Compliance',
  'cdss-protocols': 'Protocol Management',
  'cdss-analytics': 'CDS Analytics',
};

export default function FacilityCdssPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <CdssShell basePath={resolveModuleBasePath(location, segment)} variant="facility" title={TITLES[segment]} />;
}
