import type {
  CareActivityItem,
  CareAnalytics,
  CareGoal,
  CarePlan,
  CarePlanDashboard,
  CareProgressTracking,
  CareTask,
  CareTeamMember,
  CareTimelineEntry,
  ClinicalPathway,
  PathwayId,
  RiskAssessment,
  RiskSeverity,
} from '@/services/care-plans/types';
import { AUTH_USER_PATIENT_MAP } from '@/services/care-plans/types';

const PHYSICIANS = ['Dr. Emily Chen', 'Dr. Jean-Luc Martin', 'Dr. Sophie Bernard'];
const FACILITIES = ['Pitié-Salpêtrière', 'Hôpital Européen Georges-Pompidou', 'Hôpital Necker'];
const CONDITIONS = ['Type 2 Diabetes', 'Hypertension', 'COPD', 'Heart Failure', 'Post-operative Recovery'];

const PATHWAY_DEFS: ClinicalPathway[] = [
  {
    id: 'diabetes',
    name: 'Diabetes Management',
    description: 'Evidence-based diabetes care pathway with HbA1c targets and medication titration.',
    milestones: [
      { id: 'm1', title: 'Baseline labs', completed: true },
      { id: 'm2', title: 'Medication optimization', completed: true },
      { id: 'm3', title: '3-month review', completed: false },
    ],
    mandatoryTasks: ['HbA1c test', 'Foot exam', 'Nutrition consult'],
    requiredAppointments: 4,
    requiredLabs: 3,
    medicationProtocols: ['Metformin first-line', 'GLP-1 if indicated'],
    completionCriteria: 'HbA1c < 7% for 2 consecutive readings',
  },
  {
    id: 'hypertension',
    name: 'Hypertension Control',
    description: 'Blood pressure management with lifestyle and pharmacologic interventions.',
    milestones: [
      { id: 'm1', title: 'BP baseline', completed: true },
      { id: 'm2', title: 'Home monitoring setup', completed: false },
    ],
    mandatoryTasks: ['Daily BP log', 'Sodium reduction education'],
    requiredAppointments: 3,
    requiredLabs: 2,
    medicationProtocols: ['ACE inhibitor or ARB first-line'],
    completionCriteria: 'BP < 130/80 for 3 months',
  },
  {
    id: 'heart_failure',
    name: 'Heart Failure Care',
    description: 'Comprehensive heart failure management and readmission prevention.',
    milestones: [
      { id: 'm1', title: 'Echo baseline', completed: true },
      { id: 'm2', title: 'Medication titration', completed: false },
    ],
    mandatoryTasks: ['Daily weight', 'Fluid restriction education'],
    requiredAppointments: 5,
    requiredLabs: 4,
    medicationProtocols: ['Beta-blocker', 'ACE inhibitor', 'Diuretic'],
    completionCriteria: 'Stable weight, no hospitalization 90 days',
  },
  {
    id: 'post_surgery',
    name: 'Post-Operative Recovery',
    description: 'Structured recovery after surgical procedures.',
    milestones: [
      { id: 'm1', title: 'Discharge planning', completed: true },
      { id: 'm2', title: 'Wound check', completed: false },
    ],
    mandatoryTasks: ['Pain management', 'Mobility exercises'],
    requiredAppointments: 2,
    requiredLabs: 1,
    medicationProtocols: ['Analgesia protocol', 'DVT prophylaxis'],
    completionCriteria: 'Full mobility restored, wound healed',
  },
  {
    id: 'copd',
    name: 'COPD Management',
    description: 'Chronic obstructive pulmonary disease care pathway.',
    milestones: [{ id: 'm1', title: 'Spirometry', completed: true }],
    mandatoryTasks: ['Inhaler technique', 'Smoking cessation'],
    requiredAppointments: 3,
    requiredLabs: 1,
    medicationProtocols: ['Bronchodilator', 'Inhaled corticosteroid if indicated'],
    completionCriteria: 'Stable FEV1, reduced exacerbations',
  },
];

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length]!;
}

function riskFromIndex(index: number): RiskSeverity {
  const pool: RiskSeverity[] = ['low', 'moderate', 'high', 'critical'];
  return pool[index % 4]!;
}

export function generateCarePlan(index: number, patientIdx: number): CarePlan {
  const patientId = `phr-${String(patientIdx + 1).padStart(3, '0')}`;
  const condition = pick(CONDITIONS, index);
  const pathwayId = pick(['diabetes', 'hypertension', 'copd', 'heart_failure', 'post_surgery'] as PathwayId[], index);
  const statusPool = index % 15 === 0 ? 'completed' : index % 12 === 0 ? 'on_hold' : 'active';

  return {
    id: `cp-${String(index + 1).padStart(4, '0')}`,
    patientId,
    patientName: patientIdx === 0 ? 'Sarah Jenkins' : `Patient ${patientIdx + 1}`,
    title: `${condition} Care Plan`,
    description: `Comprehensive care plan for ${condition.toLowerCase()} management and coordination.`,
    type: index % 3 === 0 ? 'chronic_disease' : index % 3 === 1 ? 'rehabilitation' : 'preventive',
    status: statusPool,
    pathwayId,
    primaryDiagnosis: condition,
    diagnosisCode: `ICD-E11.${index % 9}`,
    startDate: daysAgo(90 + (index % 60)),
    endDate: statusPool === 'completed' ? daysAgo(5) : daysFromNow(180 - (index % 90)),
    reviewDate: daysFromNow(14 + (index % 30)),
    completionPercent: 40 + (index % 55),
    progressPercent: 35 + (index % 60),
    healthScore: 65 + (index % 30),
    riskLevel: riskFromIndex(index),
    assignedPhysician: pick(PHYSICIANS, index),
    assignedPhysicianId: `prov-00${(index % 3) + 1}`,
    facilityId: 'fac-001',
    facilityName: pick(FACILITIES, index),
    isShared: index % 5 === 0,
    isCollaborative: index % 4 === 0,
    templateId: index % 6 === 0 ? `tpl-${pathwayId}` : undefined,
    version: 1 + (index % 3),
    versionHistory: [{
      version: 1,
      changedAt: daysAgo(30),
      changedBy: pick(PHYSICIANS, index),
      summary: 'Initial care plan created',
    }],
    linkedMedicationIds: [`med-${index % 20}`, `med-${(index + 1) % 20}`],
    linkedAppointmentIds: [`apt-${index % 30}`],
    linkedProviderIds: [`prov-00${(index % 3) + 1}`],
    createdAt: daysAgo(90),
    updatedAt: new Date().toISOString(),
  };
}

export function generateGoals(plan: CarePlan, index: number): CareGoal[] {
  const categories = ['clinical', 'medication', 'lifestyle', 'blood_sugar', 'blood_pressure'] as const;
  return categories.slice(0, 3 + (index % 3)).map((cat, i) => ({
    id: `goal-${plan.id}-${i}`,
    carePlanId: plan.id,
    patientId: plan.patientId,
    title: cat === 'blood_sugar' ? 'Maintain HbA1c below 7%' : cat === 'blood_pressure' ? 'BP below 130/80' : `Improve ${cat.replace('_', ' ')}`,
    category: cat,
    target: cat === 'medication' ? '95% adherence' : 'Achieve target within 90 days',
    priority: i === 0 ? 'high' : 'medium',
    owner: plan.assignedPhysician,
    ownerId: plan.assignedPhysicianId,
    deadline: daysFromNow(30 + i * 14),
    status: i === 0 ? 'in_progress' : i === 1 ? 'not_started' : 'achieved',
    progressPercent: i === 2 ? 100 : 30 + (index % 50),
    createdAt: plan.startDate,
    updatedAt: new Date().toISOString(),
  }));
}

export function generateTasks(plan: CarePlan, index: number): CareTask[] {
  const types = ['medication', 'appointment', 'lab', 'education', 'monitoring'] as const;
  return Array.from({ length: 8 + (index % 6) }, (_, i) => {
    const dueOffset = i - 2;
    const status = dueOffset < -1 ? 'overdue' : dueOffset < 0 ? 'completed' : 'pending';
    return {
      id: `task-${plan.id}-${i}`,
      carePlanId: plan.id,
      patientId: plan.patientId,
      title: types[i % types.length] === 'medication' ? 'Take morning medications' : types[i % types.length] === 'appointment' ? 'Follow-up appointment' : 'Complete scheduled activity',
      type: types[i % types.length]!,
      priority: i === 0 ? 'urgent' : i < 3 ? 'high' : 'medium',
      owner: i % 2 === 0 ? plan.assignedPhysician : 'Sarah Jenkins',
      ownerId: i % 2 === 0 ? plan.assignedPhysicianId : 'user-patient',
      dueDate: daysFromNow(dueOffset),
      status,
      linkedMedicationId: types[i % types.length] === 'medication' ? plan.linkedMedicationIds[0] : undefined,
      linkedAppointmentId: types[i % types.length] === 'appointment' ? plan.linkedAppointmentIds[0] : undefined,
      createdAt: plan.startDate,
      updatedAt: new Date().toISOString(),
    };
  });
}

function generateTeam(plan: CarePlan): CareTeamMember[] {
  return [
    {
      id: `team-${plan.id}-1`,
      carePlanId: plan.id,
      name: plan.assignedPhysician,
      role: 'primary_physician',
      specialty: 'Internal Medicine',
      email: 'physician@medease.health',
      phone: '+33 1 42 00 00 01',
      permissions: ['read', 'write', 'assign'],
      availability: 'Mon–Fri 9:00–17:00',
      responsibilities: ['Care plan oversight', 'Prescriptions', 'Referrals'],
      isPrimary: true,
    },
    {
      id: `team-${plan.id}-2`,
      carePlanId: plan.id,
      name: 'Marie Dupont, RN',
      role: 'nurse',
      permissions: ['read', 'write'],
      responsibilities: ['Vital monitoring', 'Patient education', 'Task coordination'],
      isPrimary: false,
    },
    {
      id: `team-${plan.id}-3`,
      carePlanId: plan.id,
      name: 'David Chen, PharmD',
      role: 'pharmacist',
      permissions: ['read'],
      responsibilities: ['Medication review', 'Interaction checks'],
      isPrimary: false,
    },
  ];
}

function generateRisks(plan: CarePlan, index: number): RiskAssessment[] {
  return [
    {
      id: `risk-${plan.id}-1`,
      carePlanId: plan.id,
      patientId: plan.patientId,
      category: 'medication',
      severity: index % 3 === 0 ? 'moderate' : 'low',
      score: 25 + (index % 40),
      title: 'Medication interaction risk',
      recommendation: 'Review concurrent medications at next visit.',
      assessedAt: daysAgo(7),
      active: true,
    },
    {
      id: `risk-${plan.id}-2`,
      carePlanId: plan.id,
      patientId: plan.patientId,
      category: 'readmission',
      severity: plan.riskLevel,
      score: 30 + (index % 50),
      title: '30-day readmission risk',
      recommendation: 'Ensure follow-up within 7 days of discharge.',
      assessedAt: daysAgo(3),
      active: plan.riskLevel !== 'low',
    },
  ];
}

export const MOCK_CARE_PLANS: CarePlan[] = Array.from({ length: 120 }, (_, i) =>
  generateCarePlan(i, i % 40),
);

export const MOCK_GOALS: CareGoal[] = MOCK_CARE_PLANS.flatMap((p, i) => generateGoals(p, i));

export const MOCK_TASKS: CareTask[] = MOCK_CARE_PLANS.flatMap((p, i) => generateTasks(p, i));

export const MOCK_TEAM: CareTeamMember[] = MOCK_CARE_PLANS.flatMap((p) => generateTeam(p));

export const MOCK_RISKS: RiskAssessment[] = MOCK_CARE_PLANS.flatMap((p, i) => generateRisks(p, i));

export const MOCK_PATHWAYS: ClinicalPathway[] = PATHWAY_DEFS;

export const MOCK_ACTIVITY: CareActivityItem[] = MOCK_CARE_PLANS.slice(0, 20).flatMap((p, i) => [
  {
    id: `act-${p.id}-1`,
    type: 'task',
    title: 'Task assigned: Follow-up appointment',
    actor: p.assignedPhysician,
    timestamp: daysAgo(i),
    carePlanId: p.id,
  },
  {
    id: `act-${p.id}-2`,
    type: 'goal',
    title: 'Goal progress updated to 75%',
    actor: 'Marie Dupont, RN',
    timestamp: daysAgo(i + 1),
    carePlanId: p.id,
  },
]);

export function buildCareTimeline(patientId: string): CareTimelineEntry[] {
  const plans = MOCK_CARE_PLANS.filter((p) => p.patientId === patientId);
  const tasks = MOCK_TASKS.filter((t) => t.patientId === patientId);
  const goals = MOCK_GOALS.filter((g) => g.patientId === patientId);

  const entries: CareTimelineEntry[] = [];

  for (const plan of plans) {
    entries.push({
      id: `tl-cp-${plan.id}`,
      patientId,
      carePlanId: plan.id,
      date: plan.startDate,
      title: plan.title,
      description: `Care plan ${plan.status}`,
      category: 'task',
    });
  }

  for (const task of tasks.slice(0, 15)) {
    entries.push({
      id: `tl-task-${task.id}`,
      patientId,
      carePlanId: task.carePlanId,
      date: task.dueDate,
      title: task.title,
      description: `Task ${task.status}`,
      category: 'task',
      linkedEntityId: task.id,
      linkedEntityType: 'task',
    });
  }

  for (const goal of goals.slice(0, 10)) {
    entries.push({
      id: `tl-goal-${goal.id}`,
      patientId,
      carePlanId: goal.carePlanId,
      date: goal.updatedAt,
      title: goal.title,
      description: `${goal.progressPercent}% complete`,
      category: 'goal',
      linkedEntityId: goal.id,
      linkedEntityType: 'goal',
    });
  }

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPatientIdForUser(userId: string): string | null {
  return AUTH_USER_PATIENT_MAP[userId] ?? null;
}

export function buildDashboard(patientId: string): CarePlanDashboard {
  const activePlan = MOCK_CARE_PLANS.find((p) => p.patientId === patientId && p.status === 'active');
  const tasks = MOCK_TASKS.filter((t) => t.patientId === patientId);
  const team = activePlan ? MOCK_TEAM.filter((m) => m.carePlanId === activePlan.id) : [];

  return {
    patientId,
    activePlan,
    healthScore: activePlan?.healthScore ?? 72,
    completionPercent: activePlan?.completionPercent ?? 0,
    progressPercent: activePlan?.progressPercent ?? 0,
    riskLevel: activePlan?.riskLevel ?? 'moderate',
    pendingTasks: tasks.filter((t) => t.status === 'pending').length,
    upcomingTasks: tasks.filter((t) => t.status === 'pending' && new Date(t.dueDate) > new Date()).length,
    completedTasks: tasks.filter((t) => t.status === 'completed').length,
    overdueTasks: tasks.filter((t) => t.status === 'overdue').length,
    missedTasks: tasks.filter((t) => t.status === 'missed').length,
    assignedProfessionals: team.length,
    upcomingAppointments: activePlan?.linkedAppointmentIds.length ?? 0,
    activeMedications: activePlan?.linkedMedicationIds.length ?? 0,
    outstandingLabs: 2,
    outstandingImaging: 1,
    recentActivity: MOCK_ACTIVITY.filter((a) => {
      const plan = MOCK_CARE_PLANS.find((p) => p.id === a.carePlanId);
      return plan?.patientId === patientId;
    }).slice(0, 5).map((a) => ({ id: a.id, title: a.title, date: a.timestamp })),
  };
}

export function buildProgress(patientId: string): CareProgressTracking {
  const plan = MOCK_CARE_PLANS.find((p) => p.patientId === patientId && p.status === 'active');
  const goals = MOCK_GOALS.filter((g) => g.patientId === patientId);
  const achieved = goals.filter((g) => g.status === 'achieved').length;

  return {
    patientId,
    daily: 85,
    weekly: 78,
    monthly: 72,
    quarterly: 68,
    yearly: 65,
    goalCompletion: goals.length ? Math.round((achieved / goals.length) * 100) : 0,
    medicationCompliance: 88,
    appointmentAttendance: 92,
    clinicalImprovement: plan?.progressPercent ?? 70,
    healthScoreTrend: [
      { label: 'Jan', value: 68 }, { label: 'Feb', value: 70 }, { label: 'Mar', value: 72 },
      { label: 'Apr', value: plan?.healthScore ?? 75 },
    ],
    riskTrend: [
      { label: 'W1', value: 45 }, { label: 'W2', value: 40 }, { label: 'W3', value: 35 }, { label: 'W4', value: 30 },
    ],
  };
}

export function buildAnalytics(): CareAnalytics {
  const active = MOCK_CARE_PLANS.filter((p) => p.status === 'active');
  return {
    totalPlans: MOCK_CARE_PLANS.length,
    activePlans: active.length,
    completionRate: 78,
    averageProgress: Math.round(active.reduce((s, p) => s + p.progressPercent, 0) / Math.max(active.length, 1)),
    overdueTasks: MOCK_TASKS.filter((t) => t.status === 'overdue').length,
    readmissionRiskAverage: 32,
    qualityScore: 84,
    plansByType: [
      { label: 'Chronic', value: MOCK_CARE_PLANS.filter((p) => p.type === 'chronic_disease').length },
      { label: 'Rehab', value: MOCK_CARE_PLANS.filter((p) => p.type === 'rehabilitation').length },
      { label: 'Preventive', value: MOCK_CARE_PLANS.filter((p) => p.type === 'preventive').length },
    ],
    completionByMonth: [
      { label: 'Jan', value: 72 }, { label: 'Feb', value: 75 }, { label: 'Mar', value: 78 }, { label: 'Apr', value: 81 },
    ],
    topPathways: [
      { label: 'Diabetes', value: 28 }, { label: 'Hypertension', value: 24 }, { label: 'Heart Failure', value: 18 },
    ],
  };
}

export { AUTH_USER_PATIENT_MAP };
