import type { EnterpriseAlert } from '@/services/executive/types';

export function formatExecutiveAlertNotification(alert: EnterpriseAlert) {
  return { title: alert.title, body: alert.message, severity: alert.severity };
}

export function shouldNotifyExecutive(alert: EnterpriseAlert): boolean {
  return !alert.acknowledged && (alert.severity === 'critical' || alert.severity === 'warning');
}

export function groupAlertsByModule(alerts: EnterpriseAlert[]): Record<string, EnterpriseAlert[]> {
  return alerts.reduce<Record<string, EnterpriseAlert[]>>((acc, alert) => {
    acc[alert.sourceModule] = acc[alert.sourceModule] ?? [];
    acc[alert.sourceModule]!.push(alert);
    return acc;
  }, {});
}
