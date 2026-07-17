import type { LabAlert, LabAlertSeverity } from '@/services/laboratory/types';

export function sortAlertsByDate(alerts: LabAlert[]): LabAlert[] {
  return [...alerts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getUnacknowledgedAlerts(alerts: LabAlert[]): LabAlert[] {
  return alerts.filter((a) => !a.acknowledged);
}

export function alertSeverityColor(severity: LabAlertSeverity): string {
  if (severity === 'critical') return 'hsl(var(--destructive))';
  if (severity === 'warning') return 'hsl(var(--warning))';
  return 'hsl(var(--primary))';
}
