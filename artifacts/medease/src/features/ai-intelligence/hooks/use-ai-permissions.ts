import { useAuth } from '@/services/auth/auth-context';
import type { AiPermissions } from '@/services/ai-intelligence/types';

export function useAiPermissions(): AiPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('ai.read'),
    canWrite: permissions.includes('ai.write'),
    canPredictions: permissions.includes('ai.predictions'),
    canCopilot: permissions.includes('ai.copilot'),
    canModels: permissions.includes('ai.models'),
    canAnalytics: permissions.includes('ai.analytics'),
    canGovernance: permissions.includes('ai.governance'),
    canExport: permissions.includes('ai.export'),
    canShare: permissions.includes('ai.share'),
    canAdmin: permissions.includes('ai.admin'),
  };
}
