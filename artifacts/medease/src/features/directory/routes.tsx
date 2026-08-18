import type { RouteDefinition } from '@/config/routes/types';

const directoryPage = () => import('@/features/directory/pages/DirectoryPage');
const profilePage = () =>
  import('@/features/directory/pages/ProviderProfilePage');

/** Shared directory routes for any portal. Register category routes before the :providerId route. */
export function createDirectoryRoutes(options: {
  analyticsPrefix: string;
  nav?: RouteDefinition['nav'];
}): RouteDefinition[] {
  const { analyticsPrefix, nav } = options;

  return [
    {
      path: '/directory/professionals',
      title: 'Professionnels de santé',
      breadcrumb: 'Professionnels',
      analyticsName: `${analyticsPrefix}_directory_professionals`,
      lazy: directoryPage,
    },
    {
      path: '/directory/facilities',
      title: 'Établissements de santé',
      breadcrumb: 'Établissements',
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
      title: 'Transport médical',
      breadcrumb: 'Transport',
      analyticsName: `${analyticsPrefix}_directory_transport`,
      lazy: directoryPage,
    },
    {
      path: '/directory/:providerId',
      title: 'Profil établissement',
      breadcrumb: 'Profil',
      analyticsName: `${analyticsPrefix}_directory_profile`,
      lazy: profilePage,
    },
    {
      path: '/directory',
      title: 'Répertoire',
      breadcrumb: 'Répertoire',
      analyticsName: `${analyticsPrefix}_directory`,
      lazy: directoryPage,
      nav,
    },
  ];
}
