import { PortalRouter } from '@/app/router/PortalRouter';
import { adminRouteGroup } from '@/config/routes/portals/admin';

export default function AdminPortalRoutes() {
  return <PortalRouter group={adminRouteGroup} />;
}
