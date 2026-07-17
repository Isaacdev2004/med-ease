export type PhmNotificationType =
  | 'care_gap_alert'
  | 'high_risk_patient'
  | 'campaign_scheduled'
  | 'registry_update';

export function buildPhmNotification(
  type: PhmNotificationType,
  context: Record<string, string>,
) {
  const templates: Record<PhmNotificationType, string> = {
    care_gap_alert: `Care gap: ${context.gap ?? 'screening'} due for ${context.patient ?? 'patient'}`,
    high_risk_patient: `High-risk patient flagged: ${context.patient ?? 'patient'}`,
    campaign_scheduled: `Outreach campaign scheduled: ${context.campaign ?? 'campaign'}`,
    registry_update: `Registry updated: ${context.registry ?? 'registry'}`,
  };
  return {
    type,
    message: templates[type],
    context,
    createdAt: new Date().toISOString(),
  };
}
