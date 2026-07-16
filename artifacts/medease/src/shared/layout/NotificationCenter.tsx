import { NotificationCenterPanel } from '@/shared/notifications/NotificationCenterPanel';
import { getPortalForRole } from '@/config/permissions';
import { PORTAL_PATHS } from '@/config/routes';
import { useAuth } from '@/services/auth/auth-context';

export function NotificationCenter() {
  const { user } = useAuth();
  const portalId = user ? getPortalForRole(user.role) : 'patient';
  const notificationsPath = `${PORTAL_PATHS[portalId]}/notifications`;

  return <NotificationCenterPanel notificationsPath={notificationsPath} />;
}
