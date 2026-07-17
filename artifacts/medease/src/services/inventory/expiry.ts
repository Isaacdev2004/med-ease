import { MOCK_EXPIRY_ALERTS } from '@/services/inventory/mock-data';

export function getExpiryAlerts(department?: string, daysThreshold = 90) {
  return MOCK_EXPIRY_ALERTS.filter(
    (a) =>
      a.daysUntilExpiry <= daysThreshold &&
      (!department || a.department === department),
  );
}

export function getCriticalExpiry() {
  return MOCK_EXPIRY_ALERTS.filter((a) => a.severity === 'critical');
}
