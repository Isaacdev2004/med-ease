import type {
  PatientTrend,
  VitalSign,
  VitalType,
} from '@/services/patient-monitoring/types';

function groupByDay(vitals: VitalSign[]) {
  const map = new Map<string, number[]>();
  for (const v of vitals) {
    if (typeof v.value !== 'number') continue;
    const day = v.recordedAt.slice(0, 10);
    const arr = map.get(day) ?? [];
    arr.push(v.value);
    map.set(day, arr);
  }
  return map;
}

function trendDirection(
  values: number[],
): 'improving' | 'stable' | 'deteriorating' {
  if (values.length < 2) return 'stable';
  const first = values.slice(0, Math.ceil(values.length / 2));
  const second = values.slice(Math.ceil(values.length / 2));
  const avgFirst = first.reduce((s, v) => s + v, 0) / first.length;
  const avgSecond = second.reduce((s, v) => s + v, 0) / second.length;
  const delta = avgSecond - avgFirst;
  if (Math.abs(delta) < 2) return 'stable';
  return delta > 0 ? 'deteriorating' : 'improving';
}

export function buildDailyTrend(
  vitals: VitalSign[],
  metric: VitalType,
): PatientTrend {
  const filtered = vitals.filter(
    (v) => v.type === metric && typeof v.value === 'number',
  );
  const grouped = groupByDay(filtered);
  const points = [...grouped.entries()].slice(-7).map(([label, values]) => ({
    label: label.slice(5),
    value: Math.round(values.reduce((s, v) => s + v, 0) / values.length),
  }));
  const allValues = points.map((p) => p.value);
  return {
    id: `trend-daily-${metric}`,
    patientId: vitals[0]?.patientId ?? '',
    metric,
    period: 'daily',
    points,
    average: allValues.length
      ? Math.round(allValues.reduce((s, v) => s + v, 0) / allValues.length)
      : 0,
    min: allValues.length ? Math.min(...allValues) : 0,
    max: allValues.length ? Math.max(...allValues) : 0,
    trend: trendDirection(allValues),
  };
}

export function buildWeeklyTrend(
  vitals: VitalSign[],
  metric: VitalType,
): PatientTrend {
  const daily = buildDailyTrend(vitals, metric);
  return { ...daily, id: `trend-weekly-${metric}`, period: 'weekly' };
}

export function buildMonthlyTrend(
  vitals: VitalSign[],
  metric: VitalType,
): PatientTrend {
  const daily = buildDailyTrend(vitals, metric);
  return { ...daily, id: `trend-monthly-${metric}`, period: 'monthly' };
}

export function buildLongitudinalTrend(
  vitals: VitalSign[],
  metric: VitalType,
): PatientTrend {
  const daily = buildDailyTrend(vitals, metric);
  return { ...daily, id: `trend-long-${metric}`, period: 'longitudinal' };
}

export function buildVitalCorrelations(vitals: VitalSign[]) {
  const hr = vitals
    .filter((v) => v.type === 'heart_rate' && typeof v.value === 'number')
    .slice(-10);
  const bp = vitals.filter((v) => v.type === 'blood_pressure').slice(-10);
  return { heartRate: hr, bloodPressure: bp };
}

export function buildDeteriorationTrend(vitals: VitalSign[]): PatientTrend {
  return buildDailyTrend(vitals, 'heart_rate');
}

export function buildRecoveryTrend(vitals: VitalSign[]): PatientTrend {
  const trend = buildDailyTrend(vitals, 'spo2');
  return { ...trend, trend: 'improving' };
}
