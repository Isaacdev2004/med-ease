import type { RouteDefinition } from '@/config/routes/types';

const patientPage = () =>
  import('@/features/appointments/pages/PatientAppointmentsPage');
const professionalPage = () =>
  import('@/features/appointments/pages/ProfessionalAppointmentsPage');
const facilityPage = () =>
  import('@/features/appointments/pages/FacilitySchedulePage');
const detailPage = () =>
  import('@/features/appointments/pages/AppointmentDetailPage');

const PATIENT_SECTIONS = [
  'book',
  'calendar',
  'upcoming',
  'history',
  'telemedicine',
] as const;

const CLINICIAN_SECTIONS = [
  'schedule',
  'calendar',
  'queue',
  'waitlist',
  'analytics',
  'follow-ups',
] as const;

const FACILITY_SECTIONS = [
  'resources',
  'calendar',
  'queue',
  'analytics',
] as const;

export function createPatientAppointmentsRoutes(options: {
  analyticsPrefix: string;
  nav?: RouteDefinition['nav'];
}): RouteDefinition[] {
  const { analyticsPrefix, nav } = options;
  const sectionRoutes: RouteDefinition[] = PATIENT_SECTIONS.map((section) => ({
    path: `/appointments/${section}`,
    title: `Appointments — ${section}`,
    breadcrumb: section.charAt(0).toUpperCase() + section.slice(1),
    analyticsName: `${analyticsPrefix}_appointments_${section}`,
    lazy: patientPage,
    permission: 'appointments.manage',
  }));

  return [
    ...sectionRoutes,
    {
      path: '/appointments/:appointmentId',
      title: 'Appointment Details',
      breadcrumb: 'Details',
      analyticsName: `${analyticsPrefix}_appointment_detail`,
      lazy: detailPage,
      permission: 'appointments.manage',
    },
    {
      path: '/appointments',
      title: 'Appointments',
      breadcrumb: 'Appointments',
      analyticsName: `${analyticsPrefix}_appointments`,
      lazy: patientPage,
      nav,
      permission: 'appointments.manage',
    },
  ];
}

export function createProfessionalAppointmentsRoutes(
  analyticsPrefix: string,
): RouteDefinition[] {
  const sectionRoutes: RouteDefinition[] = CLINICIAN_SECTIONS.map(
    (section) => ({
      path: section === 'schedule' ? '/schedule' : `/appointments/${section}`,
      title: `Schedule — ${section}`,
      breadcrumb: section.charAt(0).toUpperCase() + section.slice(1),
      analyticsName: `${analyticsPrefix}_appointments_${section}`,
      lazy: professionalPage,
      permission: 'appointments.manage',
    }),
  );

  return [
    {
      path: '/calendar',
      title: 'Calendar',
      breadcrumb: 'Calendar',
      analyticsName: `${analyticsPrefix}_calendar`,
      lazy: professionalPage,
      permission: 'appointments.manage',
    },
    {
      path: '/appointments/:appointmentId',
      title: 'Appointment Details',
      breadcrumb: 'Details',
      analyticsName: `${analyticsPrefix}_appointment_detail`,
      lazy: detailPage,
      permission: 'appointments.manage',
    },
    ...sectionRoutes.filter((r) => r.path !== '/schedule'),
    {
      path: '/appointments',
      title: 'Appointments',
      breadcrumb: 'Appointments',
      analyticsName: `${analyticsPrefix}_appointments`,
      lazy: professionalPage,
      permission: 'appointments.manage',
    },
    {
      path: '/schedule',
      title: 'Daily Schedule',
      breadcrumb: 'Schedule',
      analyticsName: `${analyticsPrefix}_schedule`,
      lazy: professionalPage,
      permission: 'appointments.manage',
    },
  ];
}

export function createFacilityScheduleRoutes(
  analyticsPrefix: string,
): RouteDefinition[] {
  return [
    {
      path: '/schedule',
      title: 'Facility Schedule',
      breadcrumb: 'Schedule',
      analyticsName: `${analyticsPrefix}_schedule`,
      lazy: facilityPage,
      permission: 'appointments.manage',
    },
    {
      path: '/resources',
      title: 'Resource Calendar',
      breadcrumb: 'Resources',
      analyticsName: `${analyticsPrefix}_resources`,
      lazy: facilityPage,
      permission: 'appointments.manage',
    },
    {
      path: '/calendar',
      title: 'Facility Calendar',
      breadcrumb: 'Calendar',
      analyticsName: `${analyticsPrefix}_calendar`,
      lazy: facilityPage,
      permission: 'appointments.manage',
    },
    ...FACILITY_SECTIONS.filter(
      (s) => !['resources', 'calendar'].includes(s),
    ).map((section) => ({
      path: `/schedule/${section}`,
      title: `Schedule — ${section}`,
      breadcrumb: section,
      analyticsName: `${analyticsPrefix}_schedule_${section}`,
      lazy: facilityPage,
      permission: 'appointments.manage' as const,
    })),
  ];
}

export function createAdminSchedulingRoutes(
  analyticsPrefix: string,
): RouteDefinition[] {
  return [
    {
      path: '/appointments',
      title: 'Appointments',
      breadcrumb: 'Appointments',
      analyticsName: `${analyticsPrefix}_appointments`,
      lazy: professionalPage,
      permission: 'appointments.manage',
    },
    {
      path: '/calendar',
      title: 'Calendar',
      breadcrumb: 'Calendar',
      analyticsName: `${analyticsPrefix}_calendar`,
      lazy: professionalPage,
      permission: 'appointments.manage',
    },
    {
      path: '/scheduling',
      title: 'Scheduling',
      breadcrumb: 'Scheduling',
      analyticsName: `${analyticsPrefix}_scheduling`,
      lazy: professionalPage,
      permission: 'appointments.manage',
    },
    {
      path: '/appointments/analytics',
      title: 'Appointment Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_appointments_analytics`,
      lazy: professionalPage,
      permission: 'appointments.manage',
    },
  ];
}
