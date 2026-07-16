import type { RouteDefinition } from '@/config/routes/types';

const recordsPage = () => import('@/features/patient-records/pages/PatientRecordsPage');
const clinicianPage = () => import('@/features/patient-records/pages/ClinicianPatientRecordPage');

const SECTIONS = [
  'profile',
  'summary',
  'vitals',
  'laboratory',
  'medications',
  'allergies',
  'immunizations',
  'procedures',
  'radiology',
  'timeline',
  'documents',
  'emergency',
  'notes',
  'care-plans',
  'family-history',
  'lifestyle',
  'social-history',
] as const;

export function createPatientRecordsRoutes(options: {
  analyticsPrefix: string;
  nav?: RouteDefinition['nav'];
}): RouteDefinition[] {
  const { analyticsPrefix, nav } = options;

  const sectionRoutes: RouteDefinition[] = SECTIONS.map((section) => ({
    path: `/records/${section}`,
    title: `Health Record — ${section}`,
    breadcrumb: section.charAt(0).toUpperCase() + section.slice(1),
    analyticsName: `${analyticsPrefix}_records_${section}`,
    lazy: recordsPage,
  }));

  return [
    ...sectionRoutes,
    {
      path: '/records',
      title: 'Health Records',
      breadcrumb: 'Health Records',
      analyticsName: `${analyticsPrefix}_records`,
      lazy: recordsPage,
      nav,
      permission: 'patients.read',
    },
  ];
}

export function createClinicianPatientRecordRoute(analyticsPrefix: string): RouteDefinition {
  return {
    path: '/patient/:patientId',
    title: 'Patient Health Record',
    breadcrumb: 'Patient Record',
    analyticsName: `${analyticsPrefix}_patient_record`,
    lazy: clinicianPage,
    permission: 'patients.read',
  };
}

export function createClinicianPatientRecordRoutes(analyticsPrefix: string): RouteDefinition[] {
  const sectionRoutes: RouteDefinition[] = SECTIONS.map((section) => ({
    path: `/patient/:patientId/${section}`,
    title: `Patient Health Record — ${section}`,
    breadcrumb: section.charAt(0).toUpperCase() + section.slice(1),
    analyticsName: `${analyticsPrefix}_patient_record_${section}`,
    lazy: clinicianPage,
    permission: 'patients.read',
  }));

  return [...sectionRoutes, createClinicianPatientRecordRoute(analyticsPrefix)];
}
