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
      title: 'Search Medications',
      breadcrumb: 'Search',
      analyticsName: `${analyticsPrefix}_medical_library_search`,
      lazy: libraryPage,
    },
    {
      path: '/medical-library/categories',
      title: 'Medication Categories',
      breadcrumb: 'Categories',
      analyticsName: `${analyticsPrefix}_medical_library_categories`,
      lazy: libraryPage,
    },
    {
      path: '/medical-library/:medicationId',
      title: 'Medication Profile',
      breadcrumb: 'Medication Profile',
      analyticsName: `${analyticsPrefix}_medical_library_profile`,
      lazy: profilePage,
    },
    {
      path: '/medical-library',
      title: 'Medical Library',
      breadcrumb: 'Medical Library',
      analyticsName: `${analyticsPrefix}_medical_library`,
      lazy: libraryPage,
      nav,
    },
  ];
}
