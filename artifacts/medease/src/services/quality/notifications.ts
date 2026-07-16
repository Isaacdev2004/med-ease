export type QualityNotificationType =
  | 'incident_escalation'
  | 'capa_due'
  | 'audit_scheduled'
  | 'policy_review'
  | 'infection_alert';

export function buildQualityNotification(type: QualityNotificationType, context: Record<string, string>) {
  const templates: Record<QualityNotificationType, string> = {
    incident_escalation: `Incident escalated: ${context.incident ?? 'event'}`,
    capa_due: `CAPA due: ${context.capa ?? 'action'} by ${context.date ?? 'soon'}`,
    audit_scheduled: `Audit scheduled: ${context.audit ?? 'audit'} on ${context.date ?? 'TBD'}`,
    policy_review: `Policy review due: ${context.policy ?? 'document'}`,
    infection_alert: `Infection alert: ${context.type ?? 'HAI'} in ${context.department ?? 'department'}`,
  };
  return { type, message: templates[type], context, createdAt: new Date().toISOString() };
}
