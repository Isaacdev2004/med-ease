import type { RouteDefinition } from '@/config/routes/types';

const patientPage = () =>
  import('@/features/patient-monitoring/pages/PatientMonitoringPage');
const detailPage = () =>
  import('@/features/patient-monitoring/pages/MonitoringDetailPage');
const professionalPage = () =>
  import('@/features/patient-monitoring/pages/ProfessionalMonitoringPage');
const facilityPage = () =>
  import('@/features/patient-monitoring/pages/FacilityMonitoringPage');
const adminPage = () =>
  import('@/features/patient-monitoring/pages/AdminMonitoringPage');

export function createPatientMonitoringRoutes(options: {
  analyticsPrefix: string;
  nav?: RouteDefinition['nav'];
}): RouteDefinition[] {
  const { analyticsPrefix, nav } = options;
  return [
    {
      path: '/vitals',
      title: 'Vital Signs',
      breadcrumb: 'Vitals',
      analyticsName: `${analyticsPrefix}_vitals`,
      lazy: patientPage,
      permission: 'monitoring.read',
      featureFlag: 'patientMonitoring',
    },
    {
      path: '/observations',
      title: 'Observations',
      breadcrumb: 'Observations',
      analyticsName: `${analyticsPrefix}_observations`,
      lazy: patientPage,
      permission: 'monitoring.read',
      featureFlag: 'patientMonitoring',
    },
    {
      path: '/rpm',
      title: 'Remote Monitoring',
      breadcrumb: 'RPM',
      analyticsName: `${analyticsPrefix}_rpm`,
      lazy: patientPage,
      permission: 'monitoring.read',
      featureFlag: 'patientMonitoring',
    },
    {
      path: '/monitoring/:observationId',
      title: 'Observation Details',
      breadcrumb: 'Details',
      analyticsName: `${analyticsPrefix}_monitoring_detail`,
      lazy: detailPage,
      permission: 'monitoring.read',
      featureFlag: 'patientMonitoring',
    },
    {
      path: '/monitoring',
      title: 'Patient Monitoring',
      breadcrumb: 'Monitoring',
      analyticsName: `${analyticsPrefix}_monitoring`,
      lazy: patientPage,
      nav,
      permission: 'monitoring.read',
      featureFlag: 'patientMonitoring',
    },
  ];
}

export function createProfessionalMonitoringRoutes(
  analyticsPrefix: string,
): RouteDefinition[] {
  return [
    {
      path: '/monitoring',
      title: 'Patient Monitoring',
      breadcrumb: 'Monitoring',
      analyticsName: `${analyticsPrefix}_monitoring`,
      lazy: professionalPage,
      permission: 'monitoring.read',
      featureFlag: 'patientMonitoring',
    },
    {
      path: '/alerts',
      title: 'Monitoring Alerts',
      breadcrumb: 'Alerts',
      analyticsName: `${analyticsPrefix}_monitoring_alerts`,
      lazy: professionalPage,
      permission: 'monitoring.alerts',
      featureFlag: 'patientMonitoring',
    },
    {
      path: '/devices',
      title: 'Monitoring Devices',
      breadcrumb: 'Devices',
      analyticsName: `${analyticsPrefix}_monitoring_devices`,
      lazy: professionalPage,
      permission: 'monitoring.devices',
      featureFlag: 'patientMonitoring',
    },
    {
      path: '/analytics',
      title: 'Monitoring Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_monitoring_analytics`,
      lazy: professionalPage,
      permission: 'monitoring.analytics',
      featureFlag: 'patientMonitoring',
    },
    {
      path: '/patient/:patientId/monitoring',
      title: 'Patient Monitoring',
      breadcrumb: 'Monitoring',
      analyticsName: `${analyticsPrefix}_patient_monitoring`,
      lazy: professionalPage,
      permission: 'monitoring.read',
      featureFlag: 'patientMonitoring',
    },
  ];
}

export function createFacilityMonitoringRoutes(
  analyticsPrefix: string,
): RouteDefinition[] {
  return [
    {
      path: '/monitoring',
      title: 'Ward Monitoring',
      breadcrumb: 'Monitoring',
      analyticsName: `${analyticsPrefix}_monitoring`,
      lazy: facilityPage,
      permission: 'monitoring.read',
      featureFlag: 'patientMonitoring',
    },
    {
      path: '/dashboard',
      title: 'Monitoring Dashboard',
      breadcrumb: 'Dashboard',
      analyticsName: `${analyticsPrefix}_monitoring_dashboard`,
      lazy: facilityPage,
      permission: 'monitoring.read',
      featureFlag: 'patientMonitoring',
    },
    {
      path: '/devices',
      title: 'Bedside Devices',
      breadcrumb: 'Devices',
      analyticsName: `${analyticsPrefix}_monitoring_devices`,
      lazy: facilityPage,
      permission: 'monitoring.devices',
      featureFlag: 'patientMonitoring',
    },
    {
      path: '/alerts',
      title: 'Clinical Alerts',
      breadcrumb: 'Alerts',
      analyticsName: `${analyticsPrefix}_monitoring_alerts`,
      lazy: facilityPage,
      permission: 'monitoring.alerts',
      featureFlag: 'patientMonitoring',
    },
  ];
}

export function createAdminMonitoringRoutes(
  analyticsPrefix: string,
): RouteDefinition[] {
  return [
    {
      path: '/monitoring',
      title: 'Patient Monitoring',
      breadcrumb: 'Monitoring',
      analyticsName: `${analyticsPrefix}_monitoring`,
      lazy: adminPage,
      permission: 'monitoring.read',
      featureFlag: 'patientMonitoring',
    },
    {
      path: '/rpm',
      title: 'RPM Programs',
      breadcrumb: 'RPM',
      analyticsName: `${analyticsPrefix}_rpm`,
      lazy: adminPage,
      permission: 'monitoring.rpm',
      featureFlag: 'patientMonitoring',
    },
    {
      path: '/monitoring/analytics',
      title: 'Monitoring Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_monitoring_analytics`,
      lazy: adminPage,
      permission: 'monitoring.analytics',
      featureFlag: 'patientMonitoring',
    },
    {
      path: '/devices',
      title: 'Device Management',
      breadcrumb: 'Devices',
      analyticsName: `${analyticsPrefix}_monitoring_devices`,
      lazy: adminPage,
      permission: 'monitoring.devices',
      featureFlag: 'patientMonitoring',
    },
  ];
}
