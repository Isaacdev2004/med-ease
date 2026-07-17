import { registerGlobalRoute } from '@/config/routes/metadata';
import { getPortalLoginPath, PORTAL_IDS } from '@/config/routes/portal-login';
import type { GlobalRouteDefinition } from '@/config/routes/types';

const PORTAL_LOGIN_TITLES: Record<(typeof PORTAL_IDS)[number], string> = {
  patient: 'Patient Portal Sign In',
  professional: 'Professional Portal Sign In',
  facility: 'Facility Portal Sign In',
  pharmacy: 'Pharmacy Portal Sign In',
  transport: 'Transport Portal Sign In',
  admin: 'Admin Portal Sign In',
};

const PORTAL_LOGIN_SUBTITLES: Record<(typeof PORTAL_IDS)[number], string> = {
  patient: 'Access your health records, appointments, and care pathways.',
  professional: 'Sign in to manage patients and clinical workflows.',
  facility: 'Sign in to manage beds, admissions, and facility operations.',
  pharmacy: 'Sign in to manage prescriptions and inventory.',
  transport: 'Sign in to coordinate patient transfers.',
  admin: 'Sign in to manage users, organizations, and system settings.',
};

export const portalAuthRoutes: GlobalRouteDefinition[] = PORTAL_IDS.map(
  (portalId) => {
    const path = getPortalLoginPath(portalId);
    const route: GlobalRouteDefinition = {
      path,
      title: PORTAL_LOGIN_TITLES[portalId],
      layout: 'auth',
      public: true,
      lazy: () =>
        import('@/features/auth/pages/Login').then((mod) => ({
          default: mod.default,
        })),
      description: PORTAL_LOGIN_SUBTITLES[portalId],
    };
    registerGlobalRoute(route);
    return route;
  },
);
