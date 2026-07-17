import { useLocation } from 'wouter';

import { CommandCenterShell } from '@/features/executive/components/CommandCenterShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'executive' | 'department-dashboard';

function resolveSegment(location: string): Segment {
  if (location.includes('/department-dashboard')) return 'department-dashboard';
  return 'executive';
}

const TITLES: Record<Segment, string> = {
  executive: 'Executive Command Center',
  'department-dashboard': 'Department Dashboard',
};

export default function ProfessionalExecutivePage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <CommandCenterShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="professional"
      title={TITLES[segment]}
    />
  );
}
