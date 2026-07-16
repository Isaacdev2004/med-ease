import { useAuth } from '@/services/auth/auth-context';
import type { WorkflowPermissions } from '@/services/workflows/types';

export function useWorkflowPermissions(): WorkflowPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('workflow.read'),
    canWrite: permissions.includes('workflow.write'),
    canExecute: permissions.includes('workflow.execute'),
    canApprovals: permissions.includes('workflow.approvals'),
    canRules: permissions.includes('workflow.rules'),
    canScheduler: permissions.includes('workflow.scheduler'),
    canAnalytics: permissions.includes('workflow.analytics'),
    canExport: permissions.includes('workflow.export'),
    canShare: permissions.includes('workflow.share'),
    canAdmin: permissions.includes('workflow.admin'),
  };
}
