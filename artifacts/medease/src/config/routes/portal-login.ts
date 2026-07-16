import { PORTAL_PATHS, ROUTES, type PortalId } from '@/config/routes';

export const PORTAL_IDS: PortalId[] = [
  'patient',
  'professional',
  'facility',
  'pharmacy',
  'transport',
  'admin',
];

const PORTAL_LABELS: Record<PortalId, string> = {
  patient: 'Patient',
  professional: 'Professional',
  facility: 'Facility',
  pharmacy: 'Pharmacy',
  transport: 'Transport',
  admin: 'Admin',
};

export function getPortalLoginPath(portalId: PortalId): string {
  return `${PORTAL_PATHS[portalId]}/login`;
}

export function getPortalLoginPathFromPathname(pathname: string): string {
  for (const id of PORTAL_IDS) {
    const base = PORTAL_PATHS[id];
    if (pathname === base || pathname.startsWith(`${base}/`)) {
      return getPortalLoginPath(id);
    }
  }
  return ROUTES.login;
}

export function isPortalLoginPath(pathname: string): boolean {
  return PORTAL_IDS.some((id) => pathname === getPortalLoginPath(id));
}

export function getPortalLabelFromLoginPath(pathname: string): string | null {
  for (const id of PORTAL_IDS) {
    if (pathname === getPortalLoginPath(id)) {
      return PORTAL_LABELS[id];
    }
  }
  return null;
}
