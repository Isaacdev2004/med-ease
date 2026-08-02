import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/services/api/query-keys';
import { appToast } from '@/services/api/toast';
import { patientsService } from '@/services/patients';
import { useAuth } from '@/services/auth/auth-context';
import type {
  CreatePatientInput,
  ExportPatientsInput,
  UpdatePatientInput,
} from '@medease/patients-contract';

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.patients.all });
}

export function usePatientMutations() {
  const client = useQueryClient();
  const { user } = useAuth();
  const actorId = user?.id ?? 'system';

  const create = useMutation({
    mutationFn: (input: Omit<CreatePatientInput, 'createdBy'>) =>
      patientsService.createPatient({ ...input, createdBy: actorId }),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({
        title: 'Patient registered',
        description: 'The patient record has been created.',
      });
    },
    onError: (err: Error) => {
      appToast.error({ title: 'Registration failed', description: err.message });
    },
  });

  const update = useMutation({
    mutationFn: ({
      patientId,
      input,
    }: {
      patientId: string;
      input: Omit<UpdatePatientInput, 'updatedBy'>;
    }) =>
      patientsService.updatePatient(patientId, {
        ...input,
        updatedBy: actorId,
      }),
    onSuccess: (_data, variables) => {
      invalidateAll(client);
      void client.invalidateQueries({
        queryKey: queryKeys.patients.detail(variables.patientId),
      });
      appToast.success({ title: 'Patient updated' });
    },
    onError: (err: Error) => {
      appToast.error({ title: 'Update failed', description: err.message });
    },
  });

  const archive = useMutation({
    mutationFn: (patientId: string) =>
      patientsService.archivePatient(patientId, actorId),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Patient archived' });
    },
    onError: (err: Error) => {
      appToast.error({ title: 'Archive failed', description: err.message });
    },
  });

  const restore = useMutation({
    mutationFn: (patientId: string) =>
      patientsService.restorePatient(patientId, actorId),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Patient restored' });
    },
    onError: (err: Error) => {
      appToast.error({ title: 'Restore failed', description: err.message });
    },
  });

  const exportPatients = useMutation({
    mutationFn: (input: ExportPatientsInput) =>
      patientsService.exportPatients(input),
    onSuccess: (result) => {
      appToast.success({
        title: 'Export ready',
        description: `${result.recordCount} records exported as ${result.format.toUpperCase()}.`,
      });
    },
    onError: (err: Error) => {
      appToast.error({ title: 'Export failed', description: err.message });
    },
  });

  return { create, update, archive, restore, exportPatients };
}

export function useCreatePatient() {
  return usePatientMutations().create;
}

export function useUpdatePatient() {
  return usePatientMutations().update;
}

export function useArchivePatient() {
  return usePatientMutations().archive;
}

export function useRestorePatient() {
  return usePatientMutations().restore;
}
