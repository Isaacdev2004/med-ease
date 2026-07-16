import type { ComponentType } from 'react';

import type { RouteDefinition } from '@/config/routes/types';

type PageImport = () => Promise<{ default: ComponentType }>;

export interface PortalUtilityRouteOptions
  extends Partial<Omit<RouteDefinition, 'path' | 'lazy'>> {
  breadcrumb?: string;
}

/** Build a portal route definition pointing at a portal-pages lazy import. */
export function portalUtilityRoute(
  path: string,
  title: string,
  pageImport: PageImport,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  const { breadcrumb = title, title: titleOverride, analyticsName, ...rest } = options;

  return {
    path,
    title: titleOverride ?? title,
    breadcrumb,
    analyticsName,
    lazy: pageImport,
    ...rest,
  };
}

const profilePage = () => import('@/features/portal-pages/pages/ProfilePage');
const settingsPage = () => import('@/features/portal-pages/pages/SettingsPage');
const admissionsPage = () => import('@/features/portal-pages/pages/AdmissionsPage');
const transfersPage = () => import('@/features/portal-pages/pages/TransfersPage');
const consultationsPage = () => import('@/features/portal-pages/pages/ConsultationsPage');
const clinicalTasksPage = () => import('@/features/portal-pages/pages/ClinicalTasksPage');
const analyticsPage = () => import('@/features/portal-pages/pages/AnalyticsPage');
const bedManagementPage = () => import('@/features/portal-pages/pages/BedManagementPage');
const capacityPage = () => import('@/features/portal-pages/pages/CapacityPage');
const resourcesPage = () => import('@/features/portal-pages/pages/ResourcesPage');
const patientsListPage = () => import('@/features/portal-pages/pages/PatientsListPage');
const healthcareProfessionalsPage = () =>
  import('@/features/portal-pages/pages/HealthcareProfessionalsPage');
const medicationRequestsPage = () => import('@/features/portal-pages/pages/MedicationRequestsPage');
const emergencyProfilePage = () => import('@/features/portal-pages/pages/EmergencyProfilePage');
const vaccinationsPage = () => import('@/features/portal-pages/pages/VaccinationsPage');
const transportVehiclesPage = () => import('@/features/portal-pages/pages/TransportVehiclesPage');
const transportDriversPage = () => import('@/features/portal-pages/pages/TransportDriversPage');
const transportSchedulesPage = () => import('@/features/portal-pages/pages/TransportSchedulesPage');
const transportHistoryPage = () => import('@/features/portal-pages/pages/TransportHistoryPage');
const transportFacilitiesPage = () => import('@/features/portal-pages/pages/TransportFacilitiesPage');
const medicalRecordsPage = () => import('@/features/portal-pages/pages/MedicalRecordsPage');
const messagesPage = () => import('@/features/portal-pages/pages/MessagesPage');
const patientDocumentsPage = () => import('@/features/portal-pages/pages/PatientDocumentsPage');
const reportsPage = () => import('@/features/portal-pages/pages/ReportsPage');
const adminSecurityPage = () => import('@/features/iam/pages/AdminSecurityPage');
const adminPlatformPage = () => import('@/features/platform-admin/pages/AdminPlatformPage');

export function createProfileRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/profile', 'Profile', profilePage, {
    analyticsName: `${analyticsPrefix}_profile`,
    ...options,
  });
}

export function createSettingsRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/settings', 'Settings', settingsPage, {
    analyticsName: `${analyticsPrefix}_settings`,
    ...options,
  });
}

export function createAdmissionsRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/admissions', 'Admissions', admissionsPage, {
    analyticsName: `${analyticsPrefix}_admissions`,
    ...options,
  });
}

export function createTransfersRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/transfers', 'Transfers', transfersPage, {
    analyticsName: `${analyticsPrefix}_transfers`,
    ...options,
  });
}

export function createConsultationsRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/consultations', 'Consultations', consultationsPage, {
    analyticsName: `${analyticsPrefix}_consultations`,
    ...options,
  });
}

export function createClinicalTasksRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/tasks', 'Clinical Tasks', clinicalTasksPage, {
    breadcrumb: 'Tasks',
    analyticsName: `${analyticsPrefix}_clinical_tasks`,
    ...options,
  });
}

export function createAnalyticsRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/analytics', 'Analytics', analyticsPage, {
    analyticsName: `${analyticsPrefix}_analytics`,
    ...options,
  });
}

export function createBedManagementRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/beds', 'Bed Management', bedManagementPage, {
    analyticsName: `${analyticsPrefix}_bed_management`,
    ...options,
  });
}

export function createCapacityRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/capacity', 'Capacity', capacityPage, {
    analyticsName: `${analyticsPrefix}_capacity`,
    ...options,
  });
}

export function createResourcesRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/resources', 'Resources', resourcesPage, {
    analyticsName: `${analyticsPrefix}_resources`,
    ...options,
  });
}

export function createPatientsListRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/patients', 'Patients', patientsListPage, {
    analyticsName: `${analyticsPrefix}_patients`,
    ...options,
  });
}

export function createHealthcareProfessionalsRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute(
    '/healthcare-professionals',
    'Healthcare Professionals',
    healthcareProfessionalsPage,
    {
      analyticsName: `${analyticsPrefix}_healthcare_professionals`,
      ...options,
    },
  );
}

export function createMedicationRequestsRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/medication-requests', 'Medication Requests', medicationRequestsPage, {
    analyticsName: `${analyticsPrefix}_medication_requests`,
    ...options,
  });
}

export function createEmergencyProfileRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/emergency-profile', 'Emergency Profile', emergencyProfilePage, {
    analyticsName: `${analyticsPrefix}_emergency_profile`,
    ...options,
  });
}

export function createVaccinationsRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/vaccinations', 'Vaccinations', vaccinationsPage, {
    analyticsName: `${analyticsPrefix}_vaccinations`,
    ...options,
  });
}

export function createTransportVehiclesRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/vehicles', 'Vehicles', transportVehiclesPage, {
    analyticsName: `${analyticsPrefix}_transport_vehicles`,
    ...options,
  });
}

export function createTransportDriversRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/drivers', 'Drivers', transportDriversPage, {
    analyticsName: `${analyticsPrefix}_transport_drivers`,
    ...options,
  });
}

export function createTransportSchedulesRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/schedules', 'Schedules', transportSchedulesPage, {
    analyticsName: `${analyticsPrefix}_transport_schedules`,
    ...options,
  });
}

export function createTransportHistoryRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/history', 'History', transportHistoryPage, {
    analyticsName: `${analyticsPrefix}_transport_history`,
    ...options,
  });
}

export function createTransportFacilitiesRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/facilities', 'Facilities', transportFacilitiesPage, {
    analyticsName: `${analyticsPrefix}_transport_facilities`,
    ...options,
  });
}

export function createMedicalRecordsRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/medical-records', 'Medical Records', medicalRecordsPage, {
    analyticsName: `${analyticsPrefix}_medical_records`,
    ...options,
  });
}

export function createMessagesRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/messages', 'Messages', messagesPage, {
    analyticsName: `${analyticsPrefix}_messages`,
    ...options,
  });
}

export function createPatientDocumentsRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/documents', 'Documents', patientDocumentsPage, {
    analyticsName: `${analyticsPrefix}_patient_documents`,
    ...options,
  });
}

export function createReportsRoute(
  analyticsPrefix: string,
  options: PortalUtilityRouteOptions = {},
): RouteDefinition {
  return portalUtilityRoute('/reports', 'Reports', reportsPage, {
    analyticsName: `${analyticsPrefix}_reports`,
    ...options,
  });
}

/** Admin sidebar aliases → IAM Security Hub sections */
export function createAdminSecurityAliasRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    portalUtilityRoute('/users', 'User Management', adminSecurityPage, {
      analyticsName: `${analyticsPrefix}_users`,
      permission: 'iam.users',
      featureFlag: 'iam',
    }),
    portalUtilityRoute('/audit-logs', 'Audit Logs', adminSecurityPage, {
      analyticsName: `${analyticsPrefix}_audit_logs`,
      permission: 'iam.audit',
      featureFlag: 'iam',
    }),
  ];
}

/** Admin sidebar aliases → Platform Admin sections */
export function createAdminPlatformAliasRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    portalUtilityRoute('/feature-flags', 'Feature Flags', adminPlatformPage, {
      analyticsName: `${analyticsPrefix}_feature_flags`,
      permission: 'platform.admin',
      featureFlag: 'platformAdmin',
    }),
    portalUtilityRoute('/system-status', 'System Status', adminPlatformPage, {
      analyticsName: `${analyticsPrefix}_system_status`,
      permission: 'platform.health',
      featureFlag: 'platformAdmin',
    }),
  ];
}

/** Convenience bundle for facility portal placeholder replacements. */
export function createFacilityPortalUtilityRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    createBedManagementRoute(analyticsPrefix, { permission: 'beds.manage' }),
    createAdmissionsRoute(analyticsPrefix),
    createTransfersRoute(analyticsPrefix),
    createCapacityRoute(analyticsPrefix),
    createResourcesRoute(analyticsPrefix),
    createPatientsListRoute(analyticsPrefix),
    createAnalyticsRoute(analyticsPrefix),
    createSettingsRoute(analyticsPrefix),
  ];
}

/** Convenience bundle for professional portal placeholder replacements. */
export function createProfessionalPortalUtilityRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    createConsultationsRoute(analyticsPrefix),
    createMedicalRecordsRoute(analyticsPrefix),
    createTransfersRoute(analyticsPrefix),
    createAdmissionsRoute(analyticsPrefix),
    createClinicalTasksRoute(analyticsPrefix),
    createProfileRoute(analyticsPrefix),
    createSettingsRoute(analyticsPrefix),
  ];
}

/** Convenience bundle for admin portal placeholder replacements (subset). */
export function createAdminPortalUtilityRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    createHealthcareProfessionalsRoute(analyticsPrefix),
    createPatientsListRoute(analyticsPrefix),
    createSettingsRoute(analyticsPrefix),
  ];
}

/** Convenience bundle for pharmacy portal placeholder replacements. */
export function createPharmacyPortalUtilityRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    createMedicationRequestsRoute(analyticsPrefix),
    createPatientsListRoute(analyticsPrefix),
    createReportsRoute(analyticsPrefix),
    createProfileRoute(analyticsPrefix),
    createSettingsRoute(analyticsPrefix),
  ];
}

/** Convenience bundle for patient portal placeholder replacements. */
export function createPatientPortalUtilityRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    createTransfersRoute(analyticsPrefix, { breadcrumb: 'Transfers' }),
    createAdmissionsRoute(analyticsPrefix, { title: 'Hospital Admissions', breadcrumb: 'Admissions' }),
    createMessagesRoute(analyticsPrefix),
    createPatientDocumentsRoute(analyticsPrefix),
    createEmergencyProfileRoute(analyticsPrefix),
    createVaccinationsRoute(analyticsPrefix),
    createProfileRoute(analyticsPrefix),
    createSettingsRoute(analyticsPrefix),
  ];
}

/** Convenience bundle for transport portal placeholder replacements. */
export function createTransportPortalUtilityRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    createTransportVehiclesRoute(analyticsPrefix),
    createTransportDriversRoute(analyticsPrefix),
    createTransportSchedulesRoute(analyticsPrefix),
    createPatientsListRoute(analyticsPrefix),
    createTransportFacilitiesRoute(analyticsPrefix),
    createTransportHistoryRoute(analyticsPrefix),
    createReportsRoute(analyticsPrefix),
    createSettingsRoute(analyticsPrefix),
  ];
}
