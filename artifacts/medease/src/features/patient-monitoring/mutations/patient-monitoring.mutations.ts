import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { patientMonitoringOfflineQueue } from '@/services/patient-monitoring/offline-sync';
import { patientMonitoringService } from '@/services/patient-monitoring/patient-monitoring.service';
import type {
  AssignDeviceInput,
  CreateObservationInput,
  EnrollRPMInput,
  UpdateObservationInput,
} from '@/services/patient-monitoring/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    patientMonitoringOfflineQueue.enqueue({ label, execute: () => execute().then(() => undefined) });
    appToast.offline('Monitoring update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.monitoring.all });
}

export function useMonitoringMutations() {
  const client = useQueryClient();

  const createObservation = useMutation({
    mutationFn: (input: CreateObservationInput) =>
      runOrQueue('Create observation', () => patientMonitoringService.createObservation(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Observation recorded.' });
    },
  });

  const updateObservation = useMutation({
    mutationFn: (input: UpdateObservationInput) =>
      runOrQueue('Update observation', () => patientMonitoringService.updateObservation(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Observation updated.' });
    },
  });

  const assignDevice = useMutation({
    mutationFn: (input: AssignDeviceInput) =>
      runOrQueue('Assign device', () => patientMonitoringService.assignDevice(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Device assigned.' });
    },
  });

  const syncDevice = useMutation({
    mutationFn: (deviceId: string) =>
      runOrQueue('Sync device', () => patientMonitoringService.syncDevice(deviceId)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Device synchronized.' });
    },
  });

  const resolveAlert = useMutation({
    mutationFn: ({ id, by }: { id: string; by?: string }) =>
      runOrQueue('Resolve alert', () => patientMonitoringService.resolveAlert(id, by)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Alert resolved.' });
    },
  });

  const dismissAlert = useMutation({
    mutationFn: (id: string) =>
      runOrQueue('Dismiss alert', () => patientMonitoringService.dismissAlert(id)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Alert dismissed.' });
    },
  });

  const enrollRPM = useMutation({
    mutationFn: (input: EnrollRPMInput) =>
      runOrQueue('Enroll RPM', () => patientMonitoringService.enrollRPM(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'RPM enrollment confirmed.' });
    },
  });

  const removeRPM = useMutation({
    mutationFn: (programId: string) =>
      runOrQueue('Remove RPM', () => patientMonitoringService.removeRPM(programId)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'RPM program completed.' });
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: ({ patientId, observationId }: { patientId: string; observationId: string }) =>
      runOrQueue('Toggle favorite', () => patientMonitoringService.toggleFavorite(patientId, observationId)),
    onSuccess: () => invalidateAll(client),
  });

  const exportObservations = useMutation({
    mutationFn: ({ patientId, format }: { patientId: string; format: 'pdf' | 'csv' | 'fhir' }) =>
      runOrQueue('Export observations', () => patientMonitoringService.exportObservations(patientId, format)),
    onSuccess: () => appToast.success({ title: 'Export ready.' }),
  });

  const shareObservations = useMutation({
    mutationFn: ({ patientId, sharedWith, observationIds }: { patientId: string; sharedWith: string; observationIds: string[] }) =>
      runOrQueue('Share observations', () => patientMonitoringService.shareObservations(patientId, sharedWith, observationIds)),
    onSuccess: () => appToast.success({ title: 'Observations shared.' }),
  });

  return {
    createObservation,
    updateObservation,
    assignDevice,
    syncDevice,
    resolveAlert,
    dismissAlert,
    enrollRPM,
    removeRPM,
    toggleFavorite,
    exportObservations,
    shareObservations,
  };
}
