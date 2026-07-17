import type {
  AlertSeverity,
  DeviceAssignment,
  DeviceCalibration,
  DeviceReading,
  EarlyWarningScore,
  MonitoringAlert,
  MonitoringContext,
  MonitoringDevice,
  MonitoringSession,
  Observation,
  PatientTrend,
  RemoteMonitoringProgram,
  RPMProgramStatus,
  VitalSign,
  VitalType,
} from '@/services/patient-monitoring/types';
import {
  AUTH_USER_PATIENT_MAP,
  MONITORED_PATIENT_IDS,
} from '@/services/patient-monitoring/types';

const PATIENT_NAMES = [
  'Sarah Jenkins',
  'Jean Dupont',
  'Marie Laurent',
  'Pierre Martin',
  'Sophie Bernard',
  'Luc Moreau',
  'Emma Petit',
  'Thomas Roux',
  'Camille Simon',
  'Nicolas Michel',
];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(8 + (n % 12), (n * 7) % 60, 0, 0);
  return d.toISOString();
}

function hoursAgo(n: number) {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d.toISOString();
}

function patientName(patientId: string) {
  const idx = parseInt(patientId.replace('phr-', ''), 10) - 1;
  return PATIENT_NAMES[idx % PATIENT_NAMES.length] ?? `Patient ${patientId}`;
}

const CONTEXTS: MonitoringContext[] = [
  'home',
  'ward',
  'telemonitoring',
  'outpatient',
  'rpm',
];
const VITAL_UNITS: Record<VitalType, string> = {
  blood_pressure: 'mmHg',
  heart_rate: 'bpm',
  respiratory_rate: '/min',
  temperature: '°C',
  spo2: '%',
  blood_glucose: 'mg/dL',
  weight: 'kg',
  bmi: 'kg/m²',
  ecg_summary: 'bpm',
  pain_score: '/10',
  fall_risk: 'score',
};

function vitalStatus(
  type: VitalType,
  value: number,
): 'normal' | 'warning' | 'critical' {
  if (type === 'heart_rate') {
    if (value > 120 || value < 45) return 'critical';
    if (value > 100 || value < 55) return 'warning';
  }
  if (type === 'spo2') {
    if (value < 90) return 'critical';
    if (value < 94) return 'warning';
  }
  if (type === 'temperature') {
    if (value >= 39 || value <= 35) return 'critical';
    if (value >= 38 || value <= 36) return 'warning';
  }
  if (type === 'blood_glucose') {
    if (value > 250 || value < 54) return 'critical';
    if (value > 180 || value < 70) return 'warning';
  }
  return 'normal';
}

function generateVitalValue(type: VitalType, seed: number): number | string {
  switch (type) {
    case 'blood_pressure':
      return `${110 + (seed % 30)}/${70 + (seed % 20)}`;
    case 'heart_rate':
      return 60 + (seed % 50);
    case 'respiratory_rate':
      return 12 + (seed % 10);
    case 'temperature':
      return +(36.2 + (seed % 30) / 10).toFixed(1);
    case 'spo2':
      return 92 + (seed % 8);
    case 'blood_glucose':
      return 80 + (seed % 120);
    case 'weight':
      return +(55 + (seed % 40)).toFixed(1);
    case 'bmi':
      return +(20 + (seed % 15)).toFixed(1);
    case 'ecg_summary':
      return 60 + (seed % 40);
    case 'pain_score':
      return seed % 11;
    case 'fall_risk':
      return seed % 10;
    default:
      return 0;
  }
}

export const MOCK_DEVICES: MonitoringDevice[] = Array.from(
  { length: 100 },
  (_, i) => {
    const types = ['wearable', 'bedside', 'home', 'mobile', 'gateway'] as const;
    const type = types[i % 5]!;
    const manufacturers = [
      'Withings',
      'Philips',
      'Masimo',
      'Omron',
      'Fitbit',
      'Garmin',
      'Apple',
      'Medtronic',
    ];
    const metrics: VitalType[] =
      type === 'wearable'
        ? ['heart_rate', 'spo2', 'weight', 'blood_glucose']
        : type === 'bedside'
          ? [
              'blood_pressure',
              'heart_rate',
              'respiratory_rate',
              'temperature',
              'spo2',
            ]
          : ['blood_pressure', 'heart_rate', 'weight', 'blood_glucose'];
    return {
      id: `dev-${String(i + 1).padStart(4, '0')}`,
      name: `${manufacturers[i % manufacturers.length]} ${type === 'wearable' ? 'Watch' : type === 'bedside' ? 'Monitor' : 'Hub'} ${i + 1}`,
      manufacturer: manufacturers[i % manufacturers.length]!,
      model: `Model-${1000 + i}`,
      type,
      serialNumber: `SN-${String(100000 + i)}`,
      status: (
        ['online', 'offline', 'syncing', 'error', 'maintenance'] as const
      )[i % 12 === 0 ? 1 : 0]!,
      battery: (['full', 'good', 'low', 'critical'] as const)[
        i % 15 === 0 ? 2 : i % 20 === 0 ? 3 : 1
      ]!,
      batteryPercent: 20 + (i % 80),
      lastSyncAt: hoursAgo(i % 48),
      firmwareVersion: `v${1 + (i % 3)}.${i % 10}.0`,
      calibrationDue: daysAgo(-(30 + (i % 60))),
      supportedMetrics: metrics,
    };
  },
);

export const MOCK_DEVICE_ASSIGNMENTS: DeviceAssignment[] = Array.from(
  { length: 75 },
  (_, i) => {
    const patientId = MONITORED_PATIENT_IDS[i % 40]!;
    const device = MOCK_DEVICES[i % MOCK_DEVICES.length]!;
    return {
      id: `assign-${String(i + 1).padStart(4, '0')}`,
      deviceId: device.id,
      patientId,
      assignedAt: daysAgo(30 + (i % 90)),
      assignedBy: ['Dr. Chen', 'Nurse Marie', 'RPM Coordinator'][i % 3]!,
      active: i % 8 !== 0,
      programId: i % 3 === 0 ? `rpm-${(i % 200) + 1}` : undefined,
    };
  },
);

export const MOCK_RPM_PROGRAMS: RemoteMonitoringProgram[] = Array.from(
  { length: 200 },
  (_, i) => {
    const patientId = MONITORED_PATIENT_IDS[i % 40]!;
    const status: RPMProgramStatus = (
      ['active', 'paused', 'completed', 'pending'] as const
    )[i % 10 === 0 ? 2 : i % 15 === 0 ? 1 : 0]!;
    return {
      id: `rpm-${String(i + 1).padStart(4, '0')}`,
      patientId,
      name: [
        'Hypertension RPM',
        'Diabetes Home Monitoring',
        'CHF Remote Care',
        'Post-Discharge Monitoring',
        'COPD Telemonitoring',
      ][i % 5]!,
      status,
      enrolledAt: daysAgo(60 + (i % 120)),
      enrolledBy: 'Dr. Emily Chen',
      deviceIds: [MOCK_DEVICES[i % MOCK_DEVICES.length]!.id],
      metrics: (
        [
          'blood_pressure',
          'heart_rate',
          'blood_glucose',
          'weight',
          'spo2',
        ] as VitalType[]
      ).slice(0, 2 + (i % 3)),
      frequency: ['Daily', 'Twice daily', 'Weekly'][i % 3]!,
      clinicianId: 'prov-001',
      clinicianName: 'Dr. Emily Chen',
      carePlanId: i % 4 === 0 ? `cp-${patientId}` : undefined,
      completedAt: status === 'completed' ? daysAgo(i % 30) : undefined,
    };
  },
);

const VITAL_TYPES: VitalType[] = [
  'blood_pressure',
  'heart_rate',
  'respiratory_rate',
  'temperature',
  'spo2',
  'blood_glucose',
  'weight',
  'bmi',
  'ecg_summary',
  'pain_score',
  'fall_risk',
];

export const MOCK_VITALS: VitalSign[] = Array.from(
  { length: 25000 },
  (_, i) => {
    const patientId = MONITORED_PATIENT_IDS[i % 40]!;
    const type = VITAL_TYPES[i % VITAL_TYPES.length]!;
    const raw = generateVitalValue(type, i);
    const numeric =
      typeof raw === 'number'
        ? raw
        : parseInt(String(raw).split('/')[0] ?? '0', 10);
    const [sys, dia] =
      type === 'blood_pressure' && typeof raw === 'string'
        ? raw.split('/').map(Number)
        : [undefined, undefined];
    return {
      id: `vit-${String(i + 1).padStart(6, '0')}`,
      patientId,
      type,
      value: raw,
      unit: VITAL_UNITS[type],
      recordedAt: daysAgo(Math.floor(i / 40)),
      context: CONTEXTS[i % CONTEXTS.length]!,
      deviceId: MOCK_DEVICES[i % MOCK_DEVICES.length]!.id,
      recordedBy:
        i % 5 === 0
          ? 'Device auto-sync'
          : ['Nurse Marie', 'Patient self-report', 'Dr. Chen'][i % 3],
      status: vitalStatus(type, numeric),
      systolic: sys,
      diastolic: dia,
    };
  },
);

export const MOCK_OBSERVATIONS: Observation[] = Array.from(
  { length: 10000 },
  (_, i) => {
    const patientId = MONITORED_PATIENT_IDS[i % 40]!;
    const type = VITAL_TYPES[i % VITAL_TYPES.length]!;
    const raw = generateVitalValue(type, i + 100);
    const categories = [
      'vital-signs',
      'activity',
      'symptom',
      'survey',
      'device',
    ] as const;
    const category = categories[i % 5]!;
    const display = type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      id: `obs-${String(i + 1).padStart(6, '0')}`,
      patientId,
      category,
      code: type.toUpperCase(),
      display,
      value: raw,
      unit: VITAL_UNITS[type],
      recordedAt: daysAgo(Math.floor(i / 20)),
      context: CONTEXTS[i % CONTEXTS.length]!,
      deviceId:
        i % 3 === 0 ? MOCK_DEVICES[i % MOCK_DEVICES.length]!.id : undefined,
      sessionId: i % 7 === 0 ? `sess-${Math.floor(i / 7)}` : undefined,
      status: 'final' as const,
      interpretation:
        i % 20 === 0 ? 'critical' : i % 8 === 0 ? 'abnormal' : 'normal',
      referenceRange: type === 'heart_rate' ? '60-100 bpm' : undefined,
      recordedBy:
        i % 4 === 0
          ? undefined
          : ['Nurse Pierre', 'Patient', 'RPM Device'][i % 3],
      carePlanId: i % 6 === 0 ? `cp-${patientId}` : undefined,
    };
  },
);

export const MOCK_ALERTS: MonitoringAlert[] = Array.from(
  { length: 1500 },
  (_, i) => {
    const patientId = MONITORED_PATIENT_IDS[i % 40]!;
    const type = VITAL_TYPES[i % VITAL_TYPES.length]!;
    const severity: AlertSeverity = (
      ['info', 'warning', 'critical', 'urgent'] as const
    )[i % 20 === 0 ? 3 : i % 8 === 0 ? 2 : i % 4]!;
    const alertTypes = [
      'threshold',
      'missed_reading',
      'device_offline',
      'battery_low',
      'escalation',
      'clinical',
    ] as const;
    return {
      id: `alert-${String(i + 1).padStart(5, '0')}`,
      patientId,
      patientName: patientName(patientId),
      type: alertTypes[i % 6]!,
      severity,
      status: (['active', 'acknowledged', 'resolved', 'dismissed'] as const)[
        i % 10 === 0 ? 0 : i % 5 === 0 ? 1 : 2
      ]!,
      title:
        severity === 'critical'
          ? 'Critical vital sign'
          : severity === 'urgent'
            ? 'Clinical escalation required'
            : 'Monitoring alert',
      message: `${type.replace(/_/g, ' ')} ${severity === 'critical' ? 'outside safe range' : 'requires review'}`,
      metric: type,
      value: generateVitalValue(type, i),
      threshold: type === 'heart_rate' ? '>120 or <45 bpm' : undefined,
      createdAt: hoursAgo(i % 168),
      acknowledgedAt: i % 5 === 0 ? hoursAgo(i % 24) : undefined,
      acknowledgedBy: i % 5 === 0 ? 'Dr. Chen' : undefined,
      resolvedAt: i % 3 === 0 ? hoursAgo(i % 12) : undefined,
      deviceId:
        i % 4 === 0 ? MOCK_DEVICES[i % MOCK_DEVICES.length]!.id : undefined,
    };
  },
);

export const MOCK_SESSIONS: MonitoringSession[] = Array.from(
  { length: 300 },
  (_, i) => {
    const patientId = MONITORED_PATIENT_IDS[i % 40]!;
    const started = daysAgo(i % 60);
    return {
      id: `sess-${String(i + 1).padStart(4, '0')}`,
      patientId,
      context: CONTEXTS[i % CONTEXTS.length]!,
      startedAt: started,
      endedAt: i % 5 === 0 ? undefined : daysAgo(Math.max(0, (i % 60) - 1)),
      deviceIds: [MOCK_DEVICES[i % MOCK_DEVICES.length]!.id],
      observationCount: 5 + (i % 20),
      alertCount: i % 7,
      status: i % 5 === 0 ? 'active' : 'completed',
    };
  },
);

export const MOCK_DEVICE_READINGS: DeviceReading[] = MOCK_VITALS.slice(
  0,
  5000,
).map((v, i) => ({
  id: `dr-${String(i + 1).padStart(6, '0')}`,
  deviceId: v.deviceId ?? MOCK_DEVICES[0]!.id,
  patientId: v.patientId,
  metric: v.type,
  value: v.value,
  unit: v.unit,
  recordedAt: v.recordedAt,
  syncedAt: v.recordedAt,
}));

export const MOCK_TRENDS: PatientTrend[] = Array.from(
  { length: 500 },
  (_, i) => {
    const patientId = MONITORED_PATIENT_IDS[i % 40]!;
    const metric = VITAL_TYPES[i % VITAL_TYPES.length]!;
    const period = (['daily', 'weekly', 'monthly', 'longitudinal'] as const)[
      i % 4
    ]!;
    const points = Array.from({ length: 7 }, (_, j) => ({
      label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][j]!,
      value: 60 + ((i + j) % 40),
      status: j % 5 === 0 ? 'warning' : 'normal',
    }));
    const values = points.map((p) => p.value);
    return {
      id: `trend-${String(i + 1).padStart(4, '0')}`,
      patientId,
      metric,
      period,
      points,
      average: Math.round(values.reduce((s, v) => s + v, 0) / values.length),
      min: Math.min(...values),
      max: Math.max(...values),
      trend: (['improving', 'stable', 'deteriorating'] as const)[i % 3]!,
    };
  },
);

export const MOCK_EARLY_WARNING: EarlyWarningScore[] = Array.from(
  { length: 150 },
  (_, i) => {
    const patientId = MONITORED_PATIENT_IDS[i % 40]!;
    const scoreType = i % 2 === 0 ? 'NEWS2' : 'MEWS';
    const score = 1 + (i % 12);
    return {
      id: `ews-${String(i + 1).padStart(4, '0')}`,
      patientId,
      type: scoreType,
      score,
      riskLevel:
        score >= 7
          ? 'critical'
          : score >= 5
            ? 'high'
            : score >= 3
              ? 'medium'
              : 'low',
      components: {
        respiration: i % 3,
        spo2: i % 3,
        supplementalO2: i % 2,
        temperature: i % 3,
        systolic: i % 3,
        heartRate: i % 3,
        consciousness: i % 2,
      },
      calculatedAt: hoursAgo(i % 72),
      context: CONTEXTS[i % CONTEXTS.length]!,
    };
  },
);

export const MOCK_CALIBRATIONS: DeviceCalibration[] = MOCK_DEVICES.slice(
  0,
  50,
).map((d, i) => ({
  id: `cal-${String(i + 1).padStart(3, '0')}`,
  deviceId: d.id,
  calibratedAt: daysAgo(30 + (i % 60)),
  calibratedBy: 'Biomedical Engineering',
  nextDue: daysAgo(-(i % 90)),
  status: (['valid', 'due', 'overdue'] as const)[
    i % 10 === 0 ? 2 : i % 5 === 0 ? 1 : 0
  ]!,
}));

export function getPatientIdForUser(userId: string) {
  return AUTH_USER_PATIENT_MAP[userId] ?? MONITORED_PATIENT_IDS[0]!;
}

export function buildDashboard(patientId?: string) {
  const vitals = patientId
    ? MOCK_VITALS.filter((v) => v.patientId === patientId)
    : MOCK_VITALS;
  const alerts = patientId
    ? MOCK_ALERTS.filter((a) => a.patientId === patientId)
    : MOCK_ALERTS;
  const rpm = patientId
    ? MOCK_RPM_PROGRAMS.filter(
        (r) => r.patientId === patientId && r.status === 'active',
      )
    : MOCK_RPM_PROGRAMS.filter((r) => r.status === 'active');
  const news2 = MOCK_EARLY_WARNING.filter(
    (e) => e.type === 'NEWS2' && (!patientId || e.patientId === patientId),
  );
  const mews = MOCK_EARLY_WARNING.filter(
    (e) => e.type === 'MEWS' && (!patientId || e.patientId === patientId),
  );
  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const onlineDevices = MOCK_DEVICES.filter(
    (d) => d.status === 'online',
  ).length;

  return {
    patientId,
    activePatients: patientId ? 1 : MONITORED_PATIENT_IDS.length,
    rpmEnrollments: rpm.length,
    activeAlerts: activeAlerts.length,
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
    monitoringCompliance: 87 + (vitals.length % 10),
    missedReadings: Math.round(vitals.length * 0.03),
    batteryHealth: 82,
    alertResponseMinutes: 18,
    recentObservations: (patientId
      ? MOCK_OBSERVATIONS.filter((o) => o.patientId === patientId)
      : MOCK_OBSERVATIONS
    ).slice(0, 8),
    recentAlerts: activeAlerts.slice(0, 6),
    activeSessions: MOCK_SESSIONS.filter(
      (s) => s.status === 'active' && (!patientId || s.patientId === patientId),
    ).length,
  };
}

export function buildTimeline(patientId: string) {
  const obs = MOCK_OBSERVATIONS.filter((o) => o.patientId === patientId).slice(
    0,
    30,
  );
  const alerts = MOCK_ALERTS.filter((a) => a.patientId === patientId).slice(
    0,
    15,
  );
  const sessions = MOCK_SESSIONS.filter((s) => s.patientId === patientId).slice(
    0,
    10,
  );
  const scores = MOCK_EARLY_WARNING.filter(
    (e) => e.patientId === patientId,
  ).slice(0, 10);

  const entries = [
    ...obs.map((o) => ({
      id: o.id,
      patientId,
      date: o.recordedAt,
      type: 'observation' as const,
      title: o.display,
      description: `${o.value} ${o.unit}`,
      actor: o.recordedBy,
    })),
    ...alerts.map((a) => ({
      id: a.id,
      patientId,
      date: a.createdAt,
      type: 'alert' as const,
      title: a.title,
      description: a.message,
      severity: a.severity,
    })),
    ...sessions.map((s) => ({
      id: s.id,
      patientId,
      date: s.startedAt,
      type: 'session' as const,
      title: `Monitoring session (${s.context})`,
      description: `${s.observationCount} observations, ${s.alertCount} alerts`,
    })),
    ...scores.map((e) => ({
      id: e.id,
      patientId,
      date: e.calculatedAt,
      type: 'score' as const,
      title: `${e.type} score: ${e.score}`,
      description: `Risk level: ${e.riskLevel}`,
    })),
  ];

  return entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
