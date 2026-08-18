import type { RouteDefinition } from '@/config/routes/types';

const libraryPage = () =>
  import('@/features/medical-library/pages/MedicalLibraryPage');
const profilePage = () =>
  import('@/features/medical-library/pages/MedicationProfilePage');

export function createMedicalLibraryRoutes(options: {
  analyticsPrefix: string;
  nav?: RouteDefinition['nav'];
}): RouteDefinition[] {
  const { analyticsPrefix, nav } = options;

  return [
    {
      path: '/medical-library/search',
      title: 'Recherche médicaments',
      breadcrumb: 'Recherche',
      analyticsName: `${analyticsPrefix}_medical_library_search`,
      lazy: libraryPage,
    },
    {
      path: '/medical-library/categories',
      title: 'Catégories',
      breadcrumb: 'Catégories',
      analyticsName: `${analyticsPrefix}_medical_library_categories`,
      lazy: libraryPage,
    },
    {
      path: '/medical-library/:medicationId',
      title: 'Fiche médicament',
      breadcrumb: 'Fiche',
      analyticsName: `${analyticsPrefix}_medical_library_profile`,
      lazy: profilePage,
    },
    {
      path: '/medical-library',
      title: 'Bibliothèque médicale',
      breadcrumb: 'Bibliothèque',
      analyticsName: `${analyticsPrefix}_medical_library`,
      lazy: libraryPage,
      nav,
    },
  ];
}
