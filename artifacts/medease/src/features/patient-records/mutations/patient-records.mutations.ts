import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/services/api/query-keys';
import { appToast } from '@/services/api/toast';
import { patientRecordOfflineQueue } from '@/services/patient-records/offline-sync';
import { patientRecordService } from '@/services/patient-records/patient-record.service';
import type { VitalReading } from '@/services/patient-records/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (!navigator.onLine) {
    patientRecordOfflineQueue.enqueue({ label, execute: async () => { await execute(); } });
    appToast.offline('Record update queued until you are back online.');
    return Promise.resolve();
  }
  return execute();
}

export function usePatientRecordMutations(patientId: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.patientRecords.all });
  };

  const addVital = useMutation({
    mutationFn: (reading: Omit<VitalReading, 'id'>) =>
      runOrQueue('Add vital', () => patientRecordService.addVitalReading(patientId, reading)),
    onSuccess: invalidate,
  });

  return { addVital };
}
