import type { RouteDefinition } from '@/config/routes/types';

const directoryPage = () => import('@/features/directory/pages/DirectoryPage');
const profilePage = () => import('@/features/directory/pages/ProviderProfilePage');

/** Shared directory routes for any portal. Register category routes before the :providerId route. */
export function createDirectoryRoutes(options: {
  analyticsPrefix: string;
  nav?: RouteDefinition['nav'];
}): RouteDefinition[] {
  const { analyticsPrefix, nav } = options;

  return [
    {
      path: '/directory/professionals',
      title: 'Healthcare Professionals',
      breadcrumb: 'Professionals',
      analyticsName: `${analyticsPrefix}_directory_professionals`,
      lazy: directoryPage,
    },
    {
      path: '/directory/facilities',
      title: 'Healthcare Facilities',
      breadcrumb: 'Facilities',
      analyticsName: `${analyticsPrefix}_directory_facilities`,
      lazy: directoryPage,
    },
    {
      path: '/directory/pharmacies',
      title: 'Pharmacies',
      breadcrumb: 'Pharmacies',
      analyticsName: `${analyticsPrefix}_directory_pharmacies`,
      lazy: directoryPage,
    },
    {
      path: '/directory/transport',
      title: 'Medical Transport',
      breadcrumb: 'Transport',
      analyticsName: `${analyticsPrefix}_directory_transport`,
      lazy: directoryPage,
    },
    {
      path: '/directory/:providerId',
      title: 'Provider Profile',
      breadcrumb: 'Provider Profile',
      analyticsName: `${analyticsPrefix}_directory_profile`,
      lazy: profilePage,
    },
    {
      path: '/directory',
      title: 'Healthcare Directory',
      breadcrumb: 'Directory',
      analyticsName: `${analyticsPrefix}_directory`,
      lazy: directoryPage,
      nav,
    },
  ];
}
