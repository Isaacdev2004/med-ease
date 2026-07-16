import { useAuth } from '@/services/auth/auth-context';
import type { MessagingPermissions } from '@/services/messaging/types';

export function useMessagingPermissions(): MessagingPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('messaging.read'),
    canWrite: permissions.includes('messaging.write'),
    canSend: permissions.includes('messaging.send'),
    canTemplates: permissions.includes('messaging.templates'),
    canCampaigns: permissions.includes('messaging.campaigns'),
    canChannels: permissions.includes('messaging.channels'),
    canAnalytics: permissions.includes('messaging.analytics'),
    canExport: permissions.includes('messaging.export'),
    canAdmin: permissions.includes('messaging.admin'),
  };
}
