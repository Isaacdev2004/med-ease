import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/services/api/query-keys';
import { appToast } from '@/services/api/toast';
import { medicationOfflineQueue } from '@/services/medications/offline-sync';
import { medicationService } from '@/services/medications/medication.service';
import type {
  AdministerInput,
  CreatePrescriptionInput,
  DispenseInput,
  LogDoseInput,
  RefillRequestInput,
} from '@/services/medications/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    medicationOfflineQueue.enqueue({ label, execute: () => execute().then(() => undefined) });
    appToast.offline('Medication update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.medications.all });
}

export function useMedicationMutations() {
  const client = useQueryClient();

  const logDose = useMutation({
    mutationFn: (input: LogDoseInput) => runOrQueue('Log dose', () => medicationService.logDose(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Dose logged' }); },
  });

  const requestRefill = useMutation({
    mutationFn: (input: RefillRequestInput) => runOrQueue('Request refill', () => medicationService.requestRefill(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Refill requested' }); },
  });

  const createPrescription = useMutation({
    mutationFn: (input: CreatePrescriptionInput) => runOrQueue('Create prescription', () => medicationService.createPrescription(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Prescription created' }); },
  });

  const cancelPrescription = useMutation({
    mutationFn: (id: string) => runOrQueue('Cancel prescription', () => medicationService.cancelPrescription(id)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Prescription cancelled' }); },
  });

  const renewPrescription = useMutation({
    mutationFn: (id: string) => runOrQueue('Renew prescription', () => medicationService.renewPrescription(id)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Prescription renewed' }); },
  });

  const approveRefill = useMutation({
    mutationFn: (id: string) => runOrQueue('Approve refill', () => medicationService.approveRefill(id)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Refill approved' }); },
  });

  const rejectRefill = useMutation({
    mutationFn: (id: string) => runOrQueue('Reject refill', () => medicationService.rejectRefill(id)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Refill rejected' }); },
  });

  const dispense = useMutation({
    mutationFn: (input: DispenseInput) => runOrQueue('Dispense medication', () => medicationService.dispense(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Medication dispensed' }); },
  });

  const administer = useMutation({
    mutationFn: (input: AdministerInput) => runOrQueue('Administer medication', () => medicationService.administer(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Administration recorded' }); },
  });

  const pauseMedication = useMutation({
    mutationFn: (id: string) => runOrQueue('Pause medication', () => medicationService.pauseMedication(id)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Medication paused' }); },
  });

  const resumeMedication = useMutation({
    mutationFn: (id: string) => runOrQueue('Resume medication', () => medicationService.resumeMedication(id)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Medication resumed' }); },
  });

  const completeCourse = useMutation({
    mutationFn: (id: string) => runOrQueue('Complete course', () => medicationService.completeCourse(id)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Medication course completed' }); },
  });

  const stopMedication = useMutation({
    mutationFn: (id: string) => runOrQueue('Stop medication', () => medicationService.stopMedication(id)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Medication stopped' }); },
  });

  const markReminderDone = useMutation({
    mutationFn: (id: string) => runOrQueue('Mark reminder done', () => medicationService.markReminderDone(id)),
    onSuccess: () => invalidateAll(client),
  });

  const toggleFavorite = useMutation({
    mutationFn: (id: string) => runOrQueue('Toggle favorite', () => medicationService.toggleFavorite(id)),
    onSuccess: () => invalidateAll(client),
  });

  const exportMedications = useMutation({
    mutationFn: ({ patientId, format }: { patientId: string; format: 'pdf' | 'fhir' | 'csv' }) =>
      runOrQueue('Export medications', () => medicationService.exportMedications(patientId, format)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Medication export ready' }); },
  });

  const shareMedication = useMutation({
    mutationFn: ({ medicationId, sharedWith }: { medicationId: string; sharedWith: string }) =>
      runOrQueue('Share medication', () => medicationService.shareMedication(medicationId, sharedWith)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Medication shared' }); },
  });

  return {
    logDose,
    requestRefill,
    createPrescription,
    cancelPrescription,
    renewPrescription,
    approveRefill,
    rejectRefill,
    dispense,
    administer,
    pauseMedication,
    resumeMedication,
    completeCourse,
    stopMedication,
    markReminderDone,
    toggleFavorite,
    exportMedications,
    shareMedication,
  };
}

export function useCreatePrescription() {
  return useMedicationMutations().createPrescription;
}

export function useCancelPrescription() {
  return useMedicationMutations().cancelPrescription;
}
