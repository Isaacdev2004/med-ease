import { buildPortalConfig } from '@/config/routes/build-portal-config';
import { patientRouteGroup } from '@/config/routes/portals/patient';

export const patientPortalConfig = buildPortalConfig(patientRouteGroup);
