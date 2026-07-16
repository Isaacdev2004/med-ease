import {
  Activity,
  Bell,
  Calendar,
  FileText,
  FlaskConical,
  FolderOpen,
  HeartPulse,
  Home,
  MessageSquare,
  Pill,
  PillBottle,
  Route,
  Scan,
  Settings,
  Shield,
  Stethoscope,
  Syringe,
  User,
  Video,
  CreditCard,
} from 'lucide-react';

import { createPatientAppointmentsRoutes } from '@/features/appointments/routes';
import { createPatientRadiologyRoutes } from '@/features/radiology/routes';
import { createPatientMonitoringRoutes } from '@/features/patient-monitoring/routes';
import { createPatientTelemedicineRoutes } from '@/features/telemedicine/routes';
import { createPatientBillingRoutes } from '@/features/billing/routes';
import { createPatientLaboratoryRoutes } from '@/features/laboratory/routes';
import { createPatientCarePlanRoutes } from '@/features/care-plans/routes';
import { createPatientMedicationsRoutes } from '@/features/medications/routes';
import { createMedicalLibraryRoutes } from '@/features/medical-library/routes';
import { createPatientRecordsRoutes } from '@/features/patient-records/routes';
import { createDirectoryRoutes } from '@/features/directory/routes';
import {
  createTransfersRoute,
  createAdmissionsRoute,
  createMessagesRoute,
  createPatientDocumentsRoute,
  createEmergencyProfileRoute,
  createVaccinationsRoute,
  createProfileRoute,
  createSettingsRoute,
} from '@/features/portal-pages/routes';
import { ROUTES } from '@/config/routes';
import { registerPortalRoutes } from '@/config/routes/metadata';
import type { PortalRouteGroup } from '@/config/routes/types';

export const patientRouteGroup: PortalRouteGroup = {
  id: 'patient',
  portalTitle: 'Patient Portal',
  roleName: 'Patient',
  userName: 'Sarah Jenkins',
  basePath: ROUTES.patient.root,
  routes: [
    {
      path: '/',
      title: 'Dashboard',
      breadcrumb: 'Overview',
      analyticsName: 'patient_dashboard',
      lazy: () => import('@/features/patient/pages/Dashboard'),
      nav: { icon: Home, label: 'Overview', order: 0 },
    },
    ...createPatientAppointmentsRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: Calendar, label: 'Appointments', order: 1 },
    }),
    ...createPatientRecordsRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: FileText, label: 'Health Records', order: 2 },
    }),
    ...createPatientMedicationsRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: PillBottle, label: 'Medications', order: 3 },
    }),
    ...createMedicalLibraryRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: Pill, label: 'Medical Library', order: 4 },
    }),
    ...createDirectoryRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: Stethoscope, label: 'Healthcare Directory', order: 5 },
    }),
    ...createPatientCarePlanRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: Activity, label: 'Care Plan', order: 6 },
    }),
    ...createPatientLaboratoryRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: FlaskConical, label: 'Laboratory', order: 7 },
    }),
    ...createPatientRadiologyRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: Scan, label: 'Radiology', order: 8 },
    }),
    ...createPatientMonitoringRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: HeartPulse, label: 'Monitoring', order: 9 },
    }),
    ...createPatientTelemedicineRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: Video, label: 'Telemedicine', order: 10 },
    }),
    ...createPatientBillingRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: CreditCard, label: 'Billing', order: 11 },
    }),
    createTransfersRoute('patient', {
      nav: { icon: Route, order: 12 },
    }),
    createAdmissionsRoute('patient', {
      title: 'Hospital Admissions',
      breadcrumb: 'Admissions',
    }),
    {
      path: '/notifications',
      title: 'Notifications',
      breadcrumb: 'Notifications',
      analyticsName: 'patient_notifications',
      lazy: () => import('@/features/notifications/pages/NotificationsPage'),
      nav: { icon: Bell, order: 7 },
    },
    createMessagesRoute('patient', {
      nav: { icon: MessageSquare, order: 8 },
    }),
    createPatientDocumentsRoute('patient', {
      nav: { icon: FolderOpen, order: 9 },
    }),
    createEmergencyProfileRoute('patient', {
      nav: { icon: Shield, order: 10 },
    }),
    createVaccinationsRoute('patient', {
      nav: { icon: Syringe, order: 11 },
    }),
    createProfileRoute('patient', {
      nav: { icon: User, order: 13 },
    }),
    createSettingsRoute('patient', {
      nav: { icon: Settings, order: 14 },
    }),
  ],
};

registerPortalRoutes(patientRouteGroup.basePath, patientRouteGroup.routes);
