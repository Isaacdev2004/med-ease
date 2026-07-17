import type { MonitoringAnalytics } from '@/services/patient-monitoring/types';
import {
  MOCK_ALERTS,
  MOCK_DEVICES,
  MOCK_EARLY_WARNING,
  MOCK_RPM_PROGRAMS,
  MOCK_VITALS,
} from '@/services/patient-monitoring/mock-data';
import { MONITORED_PATIENT_IDS } from '@/services/patient-monitoring/types';

export function computeMonitoringAnalytics(): MonitoringAnalytics {
  const activeAlerts = MOCK_ALERTS.filter((a) => a.status === 'active');
  const news2 = MOCK_EARLY_WARNING.filter((e) => e.type === 'NEWS2');
  const mews = MOCK_EARLY_WARNING.filter((e) => e.type === 'MEWS');
  const onlineDevices = MOCK_DEVICES.filter(
    (d) => d.status === 'online',
  ).length;
  const rpmActive = MOCK_RPM_PROGRAMS.filter(
    (r) => r.status === 'active',
  ).length;

  return {
    activeMonitoredPatients: MONITORED_PATIENT_IDS.length,
    rpmEnrollments: rpmActive,
    criticalAlerts: activeAlerts.filter(
      (a) => a.severity === 'critical' || a.severity === 'urgent',
    ).length,
    averageNews2: news2.length
      ? Math.round(
          (news2.reduce((s, e) => s + e.score, 0) / news2.length) * 10,
        ) / 10
      : 0,
    averageMews: mews.length
      ? Math.round((mews.reduce((s, e) => s + e.score, 0) / mews.length) * 10) /
        10
      : 0,
    deviceUtilization: Math.round((onlineDevices / MOCK_DEVICES.length) * 100),
    monitoringCompliance: 88,
    missedReadings: Math.round(MOCK_VITALS.length * 0.025),
    batteryHealth: 84,
    alertResponseMinutes: 16,
    dailyVitalTrends: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
      (label, i) => ({
        label,
        value: 120 + i * 8 + (MOCK_VITALS.length % 20),
      }),
    ),
    populationBloodPressure: [
      'Normal',
      'Elevated',
      'Stage 1',
      'Stage 2',
      'Crisis',
    ].map((label, i) => ({
      label,
      value: [45, 22, 18, 10, 5][i]!,
    })),
    heartRateDistribution: ['<55', '55-70', '70-90', '90-110', '>110'].map(
      (label, i) => ({
        label,
        value: [8, 25, 40, 20, 7][i]!,
      }),
    ),
    glucoseTrends: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(
      (label, i) => ({
        label,
        value: 105 + i * 3,
      }),
    ),
    alertTrends: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
      (label, i) => ({
        label,
        value: 12 + (i % 5) * 3,
      }),
    ),
    deviceUtilizationChart: [
      'Wearable',
      'Bedside',
      'Home',
      'Mobile',
      'Gateway',
    ].map((label, i) => ({
      label,
      value: 60 + i * 8,
    })),
    deteriorationTrends: ['W1', 'W2', 'W3', 'W4'].map((label, i) => ({
      label,
      value: 5 - i,
    })),
    rpmEnrollmentGrowth: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(
      (label, i) => ({
        label,
        value: 20 + i * 15,
      }),
    ),
  };
}
