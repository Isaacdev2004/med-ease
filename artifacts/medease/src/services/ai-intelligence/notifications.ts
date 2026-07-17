import type { AiAlert } from '@/services/ai-intelligence/types';

export function formatAiAlertNotification(alert: AiAlert): {
  title: string;
  body: string;
  severity: AiAlert['severity'];
} {
  return {
    title: alert.title,
    body: alert.message,
    severity: alert.severity,
  };
}

export function shouldNotifyAlert(alert: AiAlert): boolean {
  return (
    !alert.acknowledged &&
    (alert.severity === 'critical' || alert.severity === 'warning')
  );
}

export function groupAlertsByType(
  alerts: AiAlert[],
): Record<string, AiAlert[]> {
  return alerts.reduce<Record<string, AiAlert[]>>((acc, alert) => {
    acc[alert.type] = acc[alert.type] ?? [];
    acc[alert.type]!.push(alert);
    return acc;
  }, {});
}
