import type { RouteDefinition } from '@/config/routes/types';

const patientPage = () => import('@/features/medications/pages/PatientMedicationsPage');
const detailPage = () => import('@/features/medications/pages/MedicationDetailPage');
const professionalPage = () => import('@/features/medications/pages/ProfessionalPrescriptionsPage');
const pharmacyPage = () => import('@/features/medications/pages/PharmacyPrescriptionsPage');
const facilityPage = () => import('@/features/medications/pages/FacilityMedicationBoardPage');
const adminPage = () => import('@/features/medications/pages/AdminMedicationAnalyticsPage');

export function createPatientMedicationsRoutes(options: {
  analyticsPrefix: string;
  nav?: RouteDefinition['nav'];
}): RouteDefinition[] {
  const { analyticsPrefix, nav } = options;

  return [
    {
      path: '/medications/history',
      title: 'Medication History',
      breadcrumb: 'History',
      analyticsName: `${analyticsPrefix}_medications_history`,
      lazy: patientPage,
      permission: 'medications.read',
    },
    {
      path: '/medications/reminders',
      title: 'Reminders',
      breadcrumb: 'Reminders',
      analyticsName: `${analyticsPrefix}_medications_reminders`,
      lazy: patientPage,
      permission: 'medications.read',
    },
    {
      path: '/medications/refills',
      title: 'Refills',
      breadcrumb: 'Refills',
      analyticsName: `${analyticsPrefix}_medications_refills`,
      lazy: patientPage,
      permission: 'medications.read',
    },
    {
      path: '/medications/:medicationId',
      title: 'Medication Details',
      breadcrumb: 'Details',
      analyticsName: `${analyticsPrefix}_medication_detail`,
      lazy: detailPage,
      permission: 'medications.read',
    },
    {
      path: '/medications',
      title: 'Medications',
      breadcrumb: 'Medications',
      analyticsName: `${analyticsPrefix}_medications`,
      lazy: patientPage,
      nav,
      permission: 'medications.read',
    },
  ];
}

export function createProfessionalMedicationRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    {
      path: '/medications',
      title: 'Medications',
      breadcrumb: 'Medications',
      analyticsName: `${analyticsPrefix}_medications`,
      lazy: professionalPage,
      permission: 'medications.read',
    },
    {
      path: '/prescriptions',
      title: 'Prescriptions',
      breadcrumb: 'Prescriptions',
      analyticsName: `${analyticsPrefix}_prescriptions`,
      lazy: professionalPage,
      permission: 'medications.read',
    },
    {
      path: '/reconciliation',
      title: 'Medication Reconciliation',
      breadcrumb: 'Reconciliation',
      analyticsName: `${analyticsPrefix}_reconciliation`,
      lazy: professionalPage,
      permission: 'medications.prescribe',
    },
    {
      path: '/administration',
      title: 'Administration',
      breadcrumb: 'Administration',
      analyticsName: `${analyticsPrefix}_administration`,
      lazy: professionalPage,
      permission: 'medications.administer',
    },
    {
      path: '/analytics',
      title: 'Medication Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_medication_analytics`,
      lazy: professionalPage,
      permission: 'medications.analytics',
    },
    {
      path: '/patient/:patientId/medications',
      title: 'Patient Medications',
      breadcrumb: 'Medications',
      analyticsName: `${analyticsPrefix}_patient_medications`,
      lazy: professionalPage,
      permission: 'medications.read',
    },
    {
      path: '/patient/:patientId/prescribe',
      title: 'Prescribe Medication',
      breadcrumb: 'Prescribe',
      analyticsName: `${analyticsPrefix}_patient_prescribe`,
      lazy: professionalPage,
      permission: 'medications.prescribe',
    },
  ];
}

export function createPharmacyMedicationRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/medications',
      title: 'Medications',
      breadcrumb: 'Medications',
      analyticsName: `${analyticsPrefix}_medications`,
      lazy: pharmacyPage,
      permission: 'medications.read',
      nav,
    },
    {
      path: '/dispensing',
      title: 'Dispensing',
      breadcrumb: 'Dispensing',
      analyticsName: `${analyticsPrefix}_dispensing`,
      lazy: pharmacyPage,
      permission: 'medications.dispense',
    },
    {
      path: '/refills',
      title: 'Refill Requests',
      breadcrumb: 'Refills',
      analyticsName: `${analyticsPrefix}_refills`,
      lazy: pharmacyPage,
      permission: 'medications.refill',
    },
    {
      path: '/interactions',
      title: 'Interactions',
      breadcrumb: 'Interactions',
      analyticsName: `${analyticsPrefix}_interactions`,
      lazy: pharmacyPage,
      permission: 'medications.read',
    },
    {
      path: '/inventory',
      title: 'Inventory',
      breadcrumb: 'Inventory',
      analyticsName: `${analyticsPrefix}_inventory`,
      lazy: pharmacyPage,
      permission: 'medications.dispense',
    },
    {
      path: '/prescriptions',
      title: 'Prescriptions',
      breadcrumb: 'Prescriptions',
      analyticsName: `${analyticsPrefix}_prescriptions`,
      lazy: pharmacyPage,
      permission: 'medications.read',
    },
  ];
}

export function createFacilityMedicationRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    {
      path: '/medications',
      title: 'Medications',
      breadcrumb: 'Medications',
      analyticsName: `${analyticsPrefix}_medications`,
      lazy: facilityPage,
      permission: 'medications.read',
    },
    {
      path: '/emar',
      title: 'eMAR',
      breadcrumb: 'eMAR',
      analyticsName: `${analyticsPrefix}_emar`,
      lazy: facilityPage,
      permission: 'medications.administer',
    },
    {
      path: '/administration',
      title: 'Medication Administration',
      breadcrumb: 'Administration',
      analyticsName: `${analyticsPrefix}_medication_administration`,
      lazy: facilityPage,
      permission: 'medications.administer',
    },
  ];
}

export function createAdminMedicationRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    {
      path: '/medications',
      title: 'Medications',
      breadcrumb: 'Medications',
      analyticsName: `${analyticsPrefix}_medications`,
      lazy: adminPage,
      permission: 'medications.read',
    },
    {
      path: '/medication-analytics',
      title: 'Medication Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_medication_analytics`,
      lazy: adminPage,
      permission: 'medications.analytics',
    },
    {
      path: '/formulary',
      title: 'Formulary',
      breadcrumb: 'Formulary',
      analyticsName: `${analyticsPrefix}_formulary`,
      lazy: adminPage,
      permission: 'medications.admin',
    },
  ];
}
