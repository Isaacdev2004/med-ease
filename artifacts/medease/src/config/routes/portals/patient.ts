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
  createHelpRoute,
} from '@/features/portal-pages/routes';
import { ROUTES } from '@/config/routes';
import { registerPortalRoutes } from '@/config/routes/metadata';
import type { PortalRouteGroup } from '@/config/routes/types';

export const patientRouteGroup: PortalRouteGroup = {
  id: 'patient',
  portalTitle: 'Espace patient',
  roleName: 'Patient',
  userName: 'Sarah Jenkins',
  basePath: ROUTES.patient.root,
  routes: [
    {
      path: '/',
      title: 'Tableau de bord',
      breadcrumb: 'Aperçu',
      analyticsName: 'patient_dashboard',
      lazy: () => import('@/features/patient/pages/Dashboard'),
      nav: { icon: Home, label: 'Aperçu', order: 0 },
    },
    ...createPatientAppointmentsRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: Calendar, label: 'Rendez-vous', order: 1 },
    }),
    ...createPatientRecordsRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: FileText, label: 'Mega carnet', order: 2 },
    }),
    ...createPatientMedicationsRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: PillBottle, label: 'Pilulier', order: 3 },
    }),
    ...createMedicalLibraryRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: Pill, label: 'Bibliothèque', order: 4 },
    }),
    ...createDirectoryRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: Stethoscope, label: 'Répertoire', order: 5 },
    }),
    ...createPatientCarePlanRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: Activity, label: 'E-Parcours', order: 6 },
    }),
    ...createPatientLaboratoryRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: FlaskConical, label: 'Laboratoire', order: 7 },
    }),
    ...createPatientRadiologyRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: Scan, label: 'Imagerie', order: 8 },
    }),
    ...createPatientMonitoringRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: HeartPulse, label: 'Suivi', order: 9 },
    }),
    ...createPatientTelemedicineRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: Video, label: 'Télémédecine', order: 10 },
    }),
    ...createPatientBillingRoutes({
      analyticsPrefix: 'patient',
      nav: { icon: CreditCard, label: 'Facturation', order: 11 },
    }),
    createTransfersRoute('patient', {
      nav: { icon: Route, label: 'Transferts', order: 12 },
    }),
    createAdmissionsRoute('patient', {
      title: 'Admissions hospitalières',
      breadcrumb: 'Admissions',
    }),
    {
      path: '/notifications',
      title: 'Notifications',
      breadcrumb: 'Notifications',
      analyticsName: 'patient_notifications',
      lazy: () => import('@/features/notifications/pages/NotificationsPage'),
      nav: { icon: Bell, label: 'Notifications', order: 13 },
    },
    createMessagesRoute('patient', {
      nav: { icon: MessageSquare, label: 'Messages', order: 14 },
    }),
    createPatientDocumentsRoute('patient', {
      nav: { icon: FolderOpen, label: 'Documents', order: 15 },
    }),
    createEmergencyProfileRoute('patient', {
      nav: { icon: Shield, label: 'Urgence', order: 16 },
    }),
    createVaccinationsRoute('patient', {
      nav: { icon: Syringe, label: 'Vaccinations', order: 17 },
    }),
    createProfileRoute('patient', {
      nav: { icon: User, label: 'Profil', order: 18 },
    }),
    createSettingsRoute('patient', {
      nav: { icon: Settings, label: 'Paramètres', order: 19 },
    }),
    createHelpRoute('patient'),
  ],
};

registerPortalRoutes(patientRouteGroup.basePath, patientRouteGroup.routes);
