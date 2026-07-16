import type { ReactNode } from 'react';

import { configureApiClient } from '@/services/api/configure-api-client';
import { offlineMutationQueue } from '@/services/api/offline-queue';
import { notificationOfflineQueue } from '@/services/notifications/offline-sync';
import { appointmentOfflineQueue } from '@/services/appointments/offline-sync';
import { patientRecordOfflineQueue } from '@/services/patient-records/offline-sync';
import { carePlanOfflineQueue } from '@/services/care-plans/offline-sync';
import { laboratoryOfflineQueue } from '@/services/laboratory/offline-sync';
import { radiologyOfflineQueue } from '@/services/radiology/offline-sync';
import { medicationOfflineQueue } from '@/services/medications/offline-sync';
import { patientMonitoringOfflineQueue } from '@/services/patient-monitoring/offline-sync';
import { telemedicineOfflineQueue } from '@/services/telemedicine/offline-sync';
import { billingOfflineQueue } from '@/services/billing/offline-sync';
import { inventoryOfflineQueue } from '@/services/inventory/offline-sync';
import { procurementOfflineQueue } from '@/services/procurement/offline-sync';
import { workforceOfflineQueue } from '@/services/workforce/offline-sync';
import { facilitiesOfflineQueue } from '@/services/facilities/offline-sync';
import { financeOfflineQueue } from '@/services/finance/offline-sync';
import { qualityOfflineQueue } from '@/services/quality/offline-sync';
import { phmOfflineQueue } from '@/services/population-health/offline-sync';
import { cdssOfflineQueue } from '@/services/cdss/offline-sync';
import { interoperabilityOfflineQueue } from '@/services/interoperability/offline-sync';
import { researchOfflineQueue } from '@/services/research/offline-sync';
import { publicHealthOfflineQueue } from '@/services/public-health/offline-sync';
import { aiOfflineQueue } from '@/services/ai-intelligence/offline-sync';
import { executiveOfflineQueue } from '@/services/executive/offline-sync';
import { iamOfflineQueue } from '@/services/iam/offline-sync';
import { documentOfflineQueue } from '@/services/documents/offline-sync';
import { workflowOfflineQueue } from '@/services/workflows/offline-sync';
import { messagingOfflineQueue } from '@/services/messaging/offline-sync';
import { apiPlatformOfflineQueue } from '@/services/api-platform/offline-sync';
import { reportingOfflineQueue } from '@/services/reporting/offline-sync';
import { platformAdminOfflineQueue } from '@/services/platform-admin/offline-sync';
import { useAuth } from '@/services/auth/auth-context';
import { useEffect } from 'react';

/** Syncs API client auth token and flushes offline mutation queue on reconnect. */
export function ApiProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();

  useEffect(() => {
    configureApiClient(() => session?.accessToken ?? null);
  }, [session?.accessToken]);

  useEffect(() => {
    const flush = () => {
      void offlineMutationQueue.flush();
      void notificationOfflineQueue.flush();
      void patientRecordOfflineQueue.flush();
      void appointmentOfflineQueue.flush();
      void medicationOfflineQueue.flush();
      void carePlanOfflineQueue.flush();
      void laboratoryOfflineQueue.flush();
      void radiologyOfflineQueue.flush();
      void patientMonitoringOfflineQueue.flush();
      void telemedicineOfflineQueue.flush();
      void billingOfflineQueue.flush();
      void inventoryOfflineQueue.flush();
      void procurementOfflineQueue.flush();
      void workforceOfflineQueue.flush();
      void facilitiesOfflineQueue.flush();
      void financeOfflineQueue.flush();
      void qualityOfflineQueue.flush();
      void phmOfflineQueue.flush();
      void cdssOfflineQueue.flush();
      void interoperabilityOfflineQueue.flush();
      void researchOfflineQueue.flush();
      void publicHealthOfflineQueue.flush();
      void aiOfflineQueue.flush();
      void executiveOfflineQueue.flush();
      void iamOfflineQueue.flush();
      void documentOfflineQueue.flush();
      void workflowOfflineQueue.flush();
      void messagingOfflineQueue.flush();
      void apiPlatformOfflineQueue.flush();
      void reportingOfflineQueue.flush();
      void platformAdminOfflineQueue.flush();
    };
    window.addEventListener('online', flush);
    return () => window.removeEventListener('online', flush);
  }, []);

  return children;
}
