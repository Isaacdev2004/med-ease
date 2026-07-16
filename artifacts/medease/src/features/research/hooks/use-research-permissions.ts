import { useAuth } from '@/services/auth/auth-context';
import type { ResearchPermissions } from '@/services/research/types';

export function useResearchPermissions(): ResearchPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('research.read'),
    canWrite: permissions.includes('research.write'),
    canTrials: permissions.includes('research.trials'),
    canParticipants: permissions.includes('research.participants'),
    canConsent: permissions.includes('research.consent'),
    canProtocol: permissions.includes('research.protocol'),
    canSafety: permissions.includes('research.safety'),
    canPublications: permissions.includes('research.publications'),
    canAnalytics: permissions.includes('research.analytics'),
    canExport: permissions.includes('research.export'),
    canShare: permissions.includes('research.share'),
    canAdmin: permissions.includes('research.admin'),
  };
}
