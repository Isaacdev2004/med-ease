import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { workforceOfflineQueue } from '@/services/workforce/offline-sync';
import { workforceService } from '@/services/workforce/workforce.service';
import type {
  AssignShiftInput,
  ClockInput,
  CreateEmployeeInput,
  LeaveRequestInput,
} from '@/services/workforce/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    workforceOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('Workforce update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.workforce.all });
}

export function useWorkforceMutations() {
  const client = useQueryClient();

  const createEmployee = useMutation({
    mutationFn: (input: CreateEmployeeInput) =>
      runOrQueue('Create employee', () =>
        workforceService.createEmployee(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Employee created.' });
    },
  });

  const assignShift = useMutation({
    mutationFn: (input: AssignShiftInput) =>
      runOrQueue('Assign shift', () => workforceService.assignShift(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Shift assigned.' });
    },
  });

  const approveLeave = useMutation({
    mutationFn: ({
      leaveId,
      approverId,
    }: {
      leaveId: string;
      approverId: string;
    }) =>
      runOrQueue('Approve leave', () =>
        workforceService.approveLeave(leaveId, approverId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Leave approved.' });
    },
  });

  const rejectLeave = useMutation({
    mutationFn: (leaveId: string) =>
      runOrQueue('Reject leave', () => workforceService.rejectLeave(leaveId)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Leave rejected.' });
    },
  });

  const createLeaveRequest = useMutation({
    mutationFn: (input: LeaveRequestInput) =>
      runOrQueue('Leave request', () =>
        workforceService.createLeaveRequest(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Leave request submitted.' });
    },
  });

  const clockIn = useMutation({
    mutationFn: (input: ClockInput) =>
      runOrQueue('Clock in', () =>
        workforceService.clock({ ...input, type: 'clock_in' }),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Clocked in.' });
    },
  });

  const clockOut = useMutation({
    mutationFn: (input: ClockInput) =>
      runOrQueue('Clock out', () =>
        workforceService.clock({ ...input, type: 'clock_out' }),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Clocked out.' });
    },
  });

  const assignTraining = useMutation({
    mutationFn: ({
      employeeId,
      courseName,
      mandatory,
    }: {
      employeeId: string;
      courseName: string;
      mandatory?: boolean;
    }) =>
      runOrQueue('Assign training', () =>
        workforceService.assignTraining(employeeId, courseName, mandatory),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Training assigned.' });
    },
  });

  const renewCredential = useMutation({
    mutationFn: ({
      employeeId,
      certificationId,
    }: {
      employeeId: string;
      certificationId: string;
    }) =>
      runOrQueue('Renew credential', () =>
        workforceService.renewCredential(employeeId, certificationId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Credential renewed.' });
    },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') =>
      runOrQueue('Export workforce', () => workforceService.exportData(format)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Export complete.' });
    },
  });

  const favorite = useMutation({
    mutationFn: ({
      userId,
      entityType,
      entityId,
    }: {
      userId: string;
      entityType: 'employee' | 'department' | 'shift';
      entityId: string;
    }) =>
      runOrQueue('Favorite', () =>
        workforceService.favorite(userId, entityType, entityId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  const archiveEmployee = useMutation({
    mutationFn: (employeeId: string) =>
      runOrQueue('Archive employee', () =>
        workforceService.archiveEmployee(employeeId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Employee archived.' });
    },
  });

  return {
    createEmployee,
    assignShift,
    approveLeave,
    rejectLeave,
    createLeaveRequest,
    clockIn,
    clockOut,
    assignTraining,
    renewCredential,
    exportData,
    favorite,
    archiveEmployee,
  };
}
