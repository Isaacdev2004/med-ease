import { PortalRouter } from '@/app/router/PortalRouter';
import { transportRouteGroup } from '@/config/routes/portals/transport';

export default function TransportPortalRoutes() {
  return <PortalRouter group={transportRouteGroup} />;
}
