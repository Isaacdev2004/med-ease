import {
  MOCK_ATTENDANCE,
  MOCK_DEPARTMENTS,
  MOCK_EMPLOYEES,
  MOCK_PAYROLL,
  MOCK_SHIFTS,
  MOCK_TRAINING,
} from '@/services/workforce/mock-data';
import type {
  CoverageMetrics,
  WorkforceAnalytics,
} from '@/services/workforce/types';

const WORKFORCE_ANALYTICS_ARRAY_KEYS = [
  'staffTrends',
  'coverageByDepartment',
  'absenteeismTrend',
  'trainingCompliance',
  'utilizationByDepartment',
] as const;

export function emptyWorkforceAnalytics(): WorkforceAnalytics {
  return {
    staffTrends: [],
    coverageByDepartment: [],
    absenteeismTrend: [],
    trainingCompliance: [],
    credentialCompliance: 0,
    overtimeHours: 0,
    turnoverRate: 0,
    burnoutIndicator: 0,
    payrollCost: 0,
    utilizationByDepartment: [],
  };
}

export function normalizeWorkforceAnalytics(raw: unknown): WorkforceAnalytics {
  const defaults = emptyWorkforceAnalytics();
  if (!raw || typeof raw !== 'object') return defaults;

  const row = raw as Record<string, unknown>;
  const merged: WorkforceAnalytics = {
    ...defaults,
    ...(row as Partial<WorkforceAnalytics>),
  };

  for (const key of WORKFORCE_ANALYTICS_ARRAY_KEYS) {
    if (!Array.isArray(merged[key])) {
      merged[key] = defaults[key];
    }
  }

  return merged;
}

export function isCoverageMetricsList(value: unknown): value is CoverageMetrics[] {
  return Array.isArray(value);
}

export function computeWorkforceAnalytics(): WorkforceAnalytics {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const staffTrends = months.map((label, i) => ({
    label,
    value: MOCK_EMPLOYEES.filter((_, idx) => idx % 6 === i).length,
  }));

  const coverageByDepartment = MOCK_DEPARTMENTS.slice(0, 10).map((d) => ({
    label: d.name.slice(0, 16),
    value: 70 + (parseInt(d.departmentId.replace('dept-', ''), 10) % 30),
  }));

  const absent = MOCK_ATTENDANCE.filter((a) => a.status === 'absent').length;
  const absenteeismTrend = months.map((label, i) => ({
    label,
    value: Math.round(
      (absent / MOCK_ATTENDANCE.length) * 100 * (0.8 + i * 0.04),
    ),
  }));

  const trainingDone = MOCK_TRAINING.filter(
    (t) => t.status === 'completed',
  ).length;
  const trainingCompliance = [
    { label: 'Completed', value: trainingDone },
    {
      label: 'In Progress',
      value: MOCK_TRAINING.filter((t) => t.status === 'in_progress').length,
    },
    {
      label: 'Overdue',
      value: MOCK_TRAINING.filter((t) => t.status === 'overdue').length,
    },
  ];

  const expiring = MOCK_EMPLOYEES.flatMap((e) => e.certifications).filter(
    (c) => c.status === 'expiring',
  ).length;
  const totalCerts = MOCK_EMPLOYEES.flatMap((e) => e.certifications).length;

  return {
    staffTrends,
    coverageByDepartment,
    absenteeismTrend,
    trainingCompliance,
    credentialCompliance: totalCerts
      ? Math.round(((totalCerts - expiring) / totalCerts) * 100)
      : 100,
    overtimeHours: MOCK_SHIFTS.filter((s) => s.isOvertime).length * 8,
    turnoverRate: 8.5,
    burnoutIndicator: 32,
    payrollCost: MOCK_PAYROLL.reduce((s, p) => s + p.netPay, 0),
    utilizationByDepartment: coverageByDepartment,
  };
}

export function computeCoverage(departmentId?: string): CoverageMetrics[] {
  const depts = departmentId
    ? MOCK_DEPARTMENTS.filter((d) => d.departmentId === departmentId)
    : MOCK_DEPARTMENTS.slice(0, 12);
  return depts.map((d) => {
    const scheduled = MOCK_SHIFTS.filter(
      (s) => s.departmentId === d.departmentId && s.status !== 'cancelled',
    ).length;
    const required = d.staffCount * 5;
    return {
      departmentId: d.departmentId,
      departmentName: d.name,
      required,
      scheduled,
      coveragePercent: Math.min(100, Math.round((scheduled / required) * 100)),
      gaps: Math.max(0, required - scheduled),
      overtimeShifts: MOCK_SHIFTS.filter(
        (s) => s.departmentId === d.departmentId && s.isOvertime,
      ).length,
    };
  });
}
