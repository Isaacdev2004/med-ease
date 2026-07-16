export type CarePlanStatus = 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled' | 'archived' | 'suspended';
export type CarePlanType =
  | 'chronic_disease'
  | 'rehabilitation'
  | 'preventive'
  | 'post_operative'
  | 'home_care'
  | 'palliative'
  | 'goal_based'
  | 'collaborative'
  | 'shared';
export type GoalStatus = 'not_started' | 'in_progress' | 'achieved' | 'partial' | 'missed' | 'cancelled';
export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';
export type GoalCategory =
  | 'clinical'
  | 'patient'
  | 'lifestyle'
  | 'medication'
  | 'exercise'
  | 'nutrition'
  | 'mental_health'
  | 'recovery'
  | 'weight'
  | 'blood_pressure'
  | 'blood_sugar'
  | 'custom';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue' | 'missed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskType =
  | 'medication'
  | 'appointment'
  | 'lab'
  | 'radiology'
  | 'physical_therapy'
  | 'home_visit'
  | 'teleconsultation'
  | 'education'
  | 'exercise'
  | 'nutrition'
  | 'smoking_cessation'
  | 'vaccination'
  | 'monitoring'
  | 'emergency_follow_up'
  | 'custom';
export type RiskSeverity = 'low' | 'moderate' | 'high' | 'critical';
export type RiskCategory =
  | 'clinical'
  | 'fall'
  | 'medication'
  | 'readmission'
  | 'lifestyle'
  | 'mental_health'
  | 'nutrition'
  | 'pregnancy'
  | 'custom';
export type PathwayId =
  | 'diabetes'
  | 'hypertension'
  | 'copd'
  | 'heart_failure'
  | 'cancer'
  | 'pregnancy'
  | 'stroke'
  | 'post_surgery'
  | 'mental_health'
  | 'kidney_disease';
export type CareTeamRole =
  | 'primary_physician'
  | 'specialist'
  | 'nurse'
  | 'pharmacist'
  | 'therapist'
  | 'nutritionist'
  | 'social_worker'
  | 'caregiver'
  | 'emergency_contact'
  | 'transport_coordinator';

export interface CarePlanFilters {
  patientId?: string;
  status?: CarePlanStatus;
  type?: CarePlanType;
  pathwayId?: PathwayId;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface CareGoal {
  id: string;
  carePlanId: string;
  patientId: string;
  title: string;
  description?: string;
  category: GoalCategory;
  target: string;
  priority: GoalPriority;
  owner: string;
  ownerId?: string;
  deadline?: string;
  status: GoalStatus;
  progressPercent: number;
  evidence?: string;
  notes?: string;
  outcome?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareTask {
  id: string;
  carePlanId: string;
  patientId: string;
  title: string;
  description?: string;
  type: TaskType;
  priority: TaskPriority;
  owner: string;
  ownerId?: string;
  dueDate: string;
  status: TaskStatus;
  dependsOn?: string[];
  attachmentIds?: string[];
  comments?: string[];
  completionNotes?: string;
  linkedMedicationId?: string;
  linkedAppointmentId?: string;
  linkedProviderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareTeamMember {
  id: string;
  carePlanId: string;
  name: string;
  role: CareTeamRole;
  specialty?: string;
  email?: string;
  phone?: string;
  permissions: string[];
  availability?: string;
  responsibilities: string[];
  isPrimary: boolean;
}

export interface RiskAssessment {
  id: string;
  carePlanId: string;
  patientId: string;
  category: RiskCategory;
  severity: RiskSeverity;
  score: number;
  title: string;
  recommendation: string;
  assessedAt: string;
  active: boolean;
}

export interface CareTimelineEntry {
  id: string;
  patientId: string;
  carePlanId?: string;
  date: string;
  title: string;
  description: string;
  category:
    | 'appointment'
    | 'medication'
    | 'note'
    | 'vital'
    | 'lab'
    | 'radiology'
    | 'procedure'
    | 'task'
    | 'goal'
    | 'transfer'
    | 'emergency'
    | 'provider';
  linkedEntityId?: string;
  linkedEntityType?: string;
}

export interface ClinicalPathway {
  id: PathwayId;
  name: string;
  description: string;
  milestones: { id: string; title: string; completed: boolean }[];
  mandatoryTasks: string[];
  requiredAppointments: number;
  requiredLabs: number;
  medicationProtocols: string[];
  completionCriteria: string;
}

export interface CarePlanVersion {
  version: number;
  changedAt: string;
  changedBy: string;
  summary: string;
}

export interface CarePlan {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  description: string;
  type: CarePlanType;
  status: CarePlanStatus;
  pathwayId?: PathwayId;
  primaryDiagnosis?: string;
  diagnosisCode?: string;
  startDate: string;
  endDate?: string;
  reviewDate: string;
  completionPercent: number;
  progressPercent: number;
  healthScore: number;
  riskLevel: RiskSeverity;
  assignedPhysician: string;
  assignedPhysicianId: string;
  facilityId?: string;
  facilityName?: string;
  isShared: boolean;
  isCollaborative: boolean;
  templateId?: string;
  version: number;
  versionHistory: CarePlanVersion[];
  linkedMedicationIds: string[];
  linkedAppointmentIds: string[];
  linkedProviderIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CarePlanDashboard {
  patientId: string;
  activePlan?: CarePlan;
  healthScore: number;
  completionPercent: number;
  progressPercent: number;
  riskLevel: RiskSeverity;
  pendingTasks: number;
  upcomingTasks: number;
  completedTasks: number;
  overdueTasks: number;
  missedTasks: number;
  assignedProfessionals: number;
  upcomingAppointments: number;
  activeMedications: number;
  outstandingLabs: number;
  outstandingImaging: number;
  recentActivity: { id: string; title: string; date: string }[];
}

export interface CareProgressTracking {
  patientId: string;
  daily: number;
  weekly: number;
  monthly: number;
  quarterly: number;
  yearly: number;
  goalCompletion: number;
  medicationCompliance: number;
  appointmentAttendance: number;
  clinicalImprovement: number;
  healthScoreTrend: { label: string; value: number }[];
  riskTrend: { label: string; value: number }[];
}

export interface CareAnalytics {
  totalPlans: number;
  activePlans: number;
  completionRate: number;
  averageProgress: number;
  overdueTasks: number;
  readmissionRiskAverage: number;
  qualityScore: number;
  plansByType: { label: string; value: number }[];
  completionByMonth: { label: string; value: number }[];
  topPathways: { label: string; value: number }[];
}

export interface CareActivityItem {
  id: string;
  type: 'task' | 'goal' | 'note' | 'assignment' | 'approval';
  title: string;
  actor: string;
  timestamp: string;
  carePlanId: string;
}

export interface CreateCarePlanInput {
  patientId: string;
  title: string;
  description?: string;
  type: CarePlanType;
  pathwayId?: PathwayId;
  primaryDiagnosis?: string;
  templateId?: string;
}

export interface UpdateGoalInput {
  goalId: string;
  progressPercent?: number;
  status?: GoalStatus;
  notes?: string;
  outcome?: string;
}

export interface CompleteTaskInput {
  taskId: string;
  completionNotes?: string;
}

export interface AssignTaskInput {
  taskId: string;
  ownerId: string;
  owner: string;
}

export const AUTH_USER_PATIENT_MAP: Record<string, string> = {
  'user-patient': 'phr-001',
};
