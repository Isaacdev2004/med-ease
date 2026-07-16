export type { NavItem, PortalConfig } from '@/config/navigation/types';
export { patientPortalConfig } from '@/config/navigation/patient';
export { professionalPortalConfig } from '@/config/navigation/professional';
export { facilityPortalConfig } from '@/config/navigation/facility';
export { pharmacyPortalConfig } from '@/config/navigation/pharmacy';
export { transportPortalConfig } from '@/config/navigation/transport';
export { adminPortalConfig } from '@/config/navigation/admin';

import { adminPortalConfig } from '@/config/navigation/admin';
import { facilityPortalConfig } from '@/config/navigation/facility';
import { patientPortalConfig } from '@/config/navigation/patient';
import { pharmacyPortalConfig } from '@/config/navigation/pharmacy';
import { professionalPortalConfig } from '@/config/navigation/professional';
import { transportPortalConfig } from '@/config/navigation/transport';
import type { PortalConfig } from '@/config/navigation/types';
import type { PortalId } from '@/config/routes';

export const portalConfigs: Record<PortalId, PortalConfig> = {
  patient: patientPortalConfig,
  professional: professionalPortalConfig,
  facility: facilityPortalConfig,
  pharmacy: pharmacyPortalConfig,
  transport: transportPortalConfig,
  admin: adminPortalConfig,
};
