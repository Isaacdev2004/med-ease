import type { SecurityIncident } from '@/services/iam/types';

export function formatSecurityAlert(incident: SecurityIncident) {
  return { title: incident.title, severity: incident.severity, category: incident.category };
}

export function shouldNotifyIncident(incident: SecurityIncident): boolean {
  return incident.status !== 'resolved' && (incident.severity === 'high' || incident.severity === 'critical');
}
