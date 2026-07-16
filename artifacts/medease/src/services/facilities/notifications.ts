export type FacilitiesNotificationType =
  | 'maintenance_due'
  | 'calibration_expiry'
  | 'equipment_failure'
  | 'environmental_alert'
  | 'inspection_reminder'
  | 'contract_expiry';

export function buildFacilitiesNotification(type: FacilitiesNotificationType, context: Record<string, string>) {
  const templates: Record<FacilitiesNotificationType, string> = {
    maintenance_due: `Preventive maintenance due for ${context.equipment ?? 'equipment'}`,
    calibration_expiry: `Calibration expiring for ${context.equipment ?? 'device'}`,
    equipment_failure: `Critical equipment failure: ${context.equipment ?? 'unknown'}`,
    environmental_alert: `Environmental alert at ${context.location ?? 'facility'}`,
    inspection_reminder: `Inspection scheduled: ${context.inspection ?? 'inspection'}`,
    contract_expiry: `Service contract expiring: ${context.contract ?? 'contract'}`,
  };
  return { type, message: templates[type], context, createdAt: new Date().toISOString() };
}
