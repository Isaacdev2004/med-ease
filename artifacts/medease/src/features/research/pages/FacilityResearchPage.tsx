import { useLocation } from 'wouter';

import { ResearchShell } from '@/features/research/components/ResearchShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'research' | 'study-sites' | 'recruitment' | 'research-dashboard' | 'innovation';

function resolveSegment(location: string): Segment {
  if (location.includes('/study-sites')) return 'study-sites';
  if (location.includes('/recruitment')) return 'recruitment';
  if (location.includes('/research-dashboard')) return 'research-dashboard';
  if (location.includes('/innovation')) return 'innovation';
  return 'research';
}

const TITLES: Record<Segment, string> = {
  research: 'Clinical Research',
  'study-sites': 'Study Sites',
  recruitment: 'Participant Recruitment',
  'research-dashboard': 'Research Dashboard',
  innovation: 'Innovation Pipeline',
};

export default function FacilityResearchPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <ResearchShell basePath={resolveModuleBasePath(location, segment)} variant="facility" title={TITLES[segment]} />;
}
