export { authRoutes } from '@/config/routes/auth-routes';
export { buildPortalConfig } from '@/config/routes/build-portal-config';
export { getRouteBreadcrumbLabel } from '@/config/routes/metadata';
export { placeholderRoute } from '@/config/routes/placeholder-loader';
export { publicRoutes } from '@/config/routes/public';
export { adminRouteGroup } from '@/config/routes/portals/admin';
export { facilityRouteGroup } from '@/config/routes/portals/facility';
export { patientRouteGroup } from '@/config/routes/portals/patient';
export { pharmacyRouteGroup } from '@/config/routes/portals/pharmacy';
export { professionalRouteGroup } from '@/config/routes/portals/professional';
export { transportRouteGroup } from '@/config/routes/portals/transport';
export type {
  GlobalRouteDefinition,
  PortalRouteGroup,
  RouteDefinition,
  RouteLayout,
  RouteNavMeta,
} from '@/config/routes/types';

import type { PortalId } from '@/config/routes';
import { adminRouteGroup } from '@/config/routes/portals/admin';
import { facilityRouteGroup } from '@/config/routes/portals/facility';
import { patientRouteGroup } from '@/config/routes/portals/patient';
import { pharmacyRouteGroup } from '@/config/routes/portals/pharmacy';
import { professionalRouteGroup } from '@/config/routes/portals/professional';
import { transportRouteGroup } from '@/config/routes/portals/transport';
import type { PortalRouteGroup } from '@/config/routes/types';

export const portalRouteGroups: Record<PortalId, PortalRouteGroup> = {
  patient: patientRouteGroup,
  professional: professionalRouteGroup,
  facility: facilityRouteGroup,
  pharmacy: pharmacyRouteGroup,
  transport: transportRouteGroup,
  admin: adminRouteGroup,
};
