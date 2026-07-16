import { buildPortalConfig } from '@/config/routes/build-portal-config';
import { pharmacyRouteGroup } from '@/config/routes/portals/pharmacy';

export const pharmacyPortalConfig = buildPortalConfig(pharmacyRouteGroup);
