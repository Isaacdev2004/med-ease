import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { facilitiesOfflineQueue } from '@/services/facilities/offline-sync';
import { facilitiesService } from '@/services/facilities/facilities.service';
import type { AssignWorkOrderInput, CreateMaintenanceRequestInput, RecordCalibrationInput, ReportIncidentInput } from '@/services/facilities/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    facilitiesOfflineQueue.enqueue({ label, execute: () => execute().then(() => undefined) });
    appToast.offline('Facilities update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.facilities.all });
}

export function useFacilitiesMutations() {
  const client = useQueryClient();

  const createMaintenanceRequest = useMutation({
    mutationFn: (input: CreateMaintenanceRequestInput) => runOrQueue('Create maintenance request', () => facilitiesService.createMaintenanceRequest(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Maintenance request created.' }); },
  });

  const assignWorkOrder = useMutation({
    mutationFn: (input: AssignWorkOrderInput) => runOrQueue('Assign work order', () => facilitiesService.assignWorkOrder(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Work order assigned.' }); },
  });

  const completeWorkOrder = useMutation({
    mutationFn: (workOrderId: string) => runOrQueue('Complete work order', () => facilitiesService.completeWorkOrder(workOrderId)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Work order completed.' }); },
  });

  const schedulePreventive = useMutation({
    mutationFn: ({ scheduleId, performedDate }: { scheduleId: string; performedDate: string }) =>
      runOrQueue('Schedule preventive maintenance', () => facilitiesService.schedulePreventive(scheduleId, performedDate)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Preventive maintenance scheduled.' }); },
  });

  const recordCalibration = useMutation({
    mutationFn: (input: RecordCalibrationInput) => runOrQueue('Record calibration', () => facilitiesService.recordCalibration(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Calibration recorded.' }); },
  });

  const recordInspection = useMutation({
    mutationFn: ({ inspectionId, passed }: { inspectionId: string; passed: boolean }) =>
      runOrQueue('Record inspection', () => facilitiesService.recordInspection(inspectionId, passed)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Inspection recorded.' }); },
  });

  const reportIncident = useMutation({
    mutationFn: (input: ReportIncidentInput) => runOrQueue('Report incident', () => facilitiesService.reportIncident(input)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Incident reported.' }); },
  });

  const updateEquipment = useMutation({
    mutationFn: ({ equipmentId, status }: { equipmentId: string; status: string }) =>
      runOrQueue('Update equipment', () => facilitiesService.updateEquipment(equipmentId, status)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Equipment updated.' }); },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') => runOrQueue('Export facilities', () => facilitiesService.exportData(format)),
    onSuccess: () => { invalidateAll(client); appToast.success({ title: 'Export complete.' }); },
  });

  const favorite = useMutation({
    mutationFn: ({ userId, entityType, entityId }: { userId: string; entityType: 'equipment' | 'building' | 'work_order' | 'room'; entityId: string }) =>
      runOrQueue('Favorite', () => facilitiesService.favorite(userId, entityType, entityId)),
    onSuccess: () => invalidateAll(client),
  });

  const archiveEquipment = useMutation({
    mutationFn: (equipmentId: string) => runOrQueue('Archive equipment', () => facilitiesService.archiveEquipment(equipmentId)),
    onSuccess: () => { invalidateAll(client); appToast.info({ title: 'Equipment archived.' }); },
  });

  return {
    createMaintenanceRequest,
    assignWorkOrder,
    completeWorkOrder,
    schedulePreventive,
    recordCalibration,
    recordInspection,
    reportIncident,
    updateEquipment,
    exportData,
    favorite,
    archiveEquipment,
  };
}
