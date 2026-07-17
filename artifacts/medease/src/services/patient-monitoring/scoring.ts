import type {
  EarlyWarningScore,
  VitalSign,
} from '@/services/patient-monitoring/types';

export function calculateNEWS2(
  patientId: string,
  vitals: Partial<Record<string, number>>,
): EarlyWarningScore {
  let score = 0;
  const components: Record<string, number> = {};

  const rr = vitals.respiratory_rate ?? 16;
  components.respiration =
    rr <= 8 ? 3 : rr <= 11 ? 1 : rr <= 20 ? 0 : rr <= 24 ? 2 : 3;
  score += components.respiration;

  const spo2 = vitals.spo2 ?? 97;
  components.spo2 = spo2 <= 91 ? 3 : spo2 <= 93 ? 2 : spo2 <= 95 ? 1 : 0;
  score += components.spo2;

  components.supplementalO2 = vitals.supplemental_o2 ? 2 : 0;
  score += components.supplementalO2;

  const temp = vitals.temperature ?? 36.8;
  components.temperature =
    temp <= 35 ? 3 : temp <= 36 ? 1 : temp <= 38 ? 0 : temp <= 39 ? 1 : 2;
  score += components.temperature;

  const sys = vitals.systolic ?? 120;
  components.systolic =
    sys <= 90 ? 3 : sys <= 100 ? 2 : sys <= 110 ? 1 : sys <= 219 ? 0 : 3;
  score += components.systolic;

  const hr = vitals.heart_rate ?? 72;
  components.heartRate =
    hr <= 40
      ? 3
      : hr <= 50
        ? 1
        : hr <= 90
          ? 0
          : hr <= 110
            ? 1
            : hr <= 130
              ? 2
              : 3;
  score += components.heartRate;

  components.consciousness = vitals.consciousness_altered ? 3 : 0;
  score += components.consciousness;

  return {
    id: `news2-${Date.now()}`,
    patientId,
    type: 'NEWS2',
    score,
    riskLevel:
      score >= 7
        ? 'critical'
        : score >= 5
          ? 'high'
          : score >= 3
            ? 'medium'
            : 'low',
    components,
    calculatedAt: new Date().toISOString(),
    context: 'ward',
  };
}

export function calculateMEWS(
  patientId: string,
  vitals: Partial<Record<string, number>>,
): EarlyWarningScore {
  let score = 0;
  const components: Record<string, number> = {};

  const sys = vitals.systolic ?? 120;
  components.systolic =
    sys < 70 ? 3 : sys < 80 ? 2 : sys < 100 ? 1 : sys < 199 ? 0 : 2;
  score += components.systolic;

  const hr = vitals.heart_rate ?? 72;
  components.heartRate =
    hr < 40 ? 2 : hr < 50 ? 1 : hr < 100 ? 0 : hr < 110 ? 1 : hr < 129 ? 2 : 3;
  score += components.heartRate;

  const rr = vitals.respiratory_rate ?? 16;
  components.respiration =
    rr < 9 ? 2 : rr < 14 ? 0 : rr < 20 ? 1 : rr < 29 ? 2 : 3;
  score += components.respiration;

  const temp = vitals.temperature ?? 36.8;
  components.temperature =
    temp < 35 ? 2 : temp < 38.5 ? 0 : temp < 38.9 ? 1 : 2;
  score += components.temperature;

  components.consciousness = vitals.consciousness_altered ? 3 : 0;
  score += components.consciousness;

  return {
    id: `mews-${Date.now()}`,
    patientId,
    type: 'MEWS',
    score,
    riskLevel:
      score >= 5
        ? 'critical'
        : score >= 3
          ? 'high'
          : score >= 2
            ? 'medium'
            : 'low',
    components,
    calculatedAt: new Date().toISOString(),
    context: 'ward',
  };
}

export function calculateShockIndex(systolic: number, heartRate: number) {
  if (!systolic) return 0;
  return Math.round((heartRate / systolic) * 100) / 100;
}

export function calculateBMI(weightKg: number, heightM: number) {
  if (!heightM) return 0;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function classifyBloodPressure(systolic: number, diastolic: number) {
  if (systolic >= 180 || diastolic >= 120) return 'hypertensive-crisis';
  if (systolic >= 140 || diastolic >= 90) return 'stage-2';
  if (systolic >= 130 || diastolic >= 80) return 'stage-1';
  if (systolic >= 120 && diastolic < 80) return 'elevated';
  return 'normal';
}

export function classifyHeartRateZone(heartRate: number, age = 50) {
  const maxHr = 220 - age;
  const pct = heartRate / maxHr;
  if (pct >= 0.9) return 'maximum';
  if (pct >= 0.8) return 'vigorous';
  if (pct >= 0.6) return 'moderate';
  if (pct >= 0.5) return 'light';
  return 'rest';
}

export function classifyTemperatureSeverity(celsius: number) {
  if (celsius >= 39) return 'high-fever';
  if (celsius >= 38) return 'fever';
  if (celsius <= 35) return 'hypothermia';
  return 'normal';
}

export function classifyGlucose(mgDl: number) {
  if (mgDl >= 250) return 'severe-hyperglycemia';
  if (mgDl >= 180) return 'hyperglycemia';
  if (mgDl <= 54) return 'severe-hypoglycemia';
  if (mgDl <= 70) return 'hypoglycemia';
  return 'normal';
}

export function vitalsToScoreInput(
  patientId: string,
  vitals: VitalSign[],
): Partial<Record<string, number>> {
  const input: Partial<Record<string, number>> = {};
  for (const v of vitals) {
    if (typeof v.value !== 'number') {
      if (v.type === 'blood_pressure' && v.systolic)
        input.systolic = v.systolic;
      continue;
    }
    input[v.type] = v.value;
  }
  return input;
}
