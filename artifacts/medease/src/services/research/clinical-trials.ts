import type {
  ClinicalTrial,
  TrialPhase,
  TrialStatus,
} from '@/services/research/types';

export const TRIAL_PHASES: TrialPhase[] = [
  'I',
  'II',
  'III',
  'IV',
  'observational',
];
export const TRIAL_STATUSES: TrialStatus[] = [
  'planning',
  'recruiting',
  'active',
  'completed',
  'suspended',
  'terminated',
];
export const THERAPEUTIC_AREAS = [
  'Oncology',
  'Cardiology',
  'Neurology',
  'Immunology',
  'Endocrinology',
  'Infectious Disease',
  'Rare Disease',
  'Psychiatry',
];

export function canTransitionTrial(
  from: TrialStatus,
  to: TrialStatus,
): boolean {
  const transitions: Record<TrialStatus, TrialStatus[]> = {
    planning: ['recruiting', 'terminated'],
    recruiting: ['active', 'suspended', 'terminated'],
    active: ['completed', 'suspended', 'terminated'],
    suspended: ['active', 'terminated'],
    completed: [],
    terminated: [],
  };
  return transitions[from]?.includes(to) ?? false;
}

export function computeEnrollmentRate(trial: ClinicalTrial): number {
  if (trial.targetEnrollment === 0) return 0;
  return Math.round((trial.currentEnrollment / trial.targetEnrollment) * 100);
}

export function isTrialRecruiting(trial: ClinicalTrial): boolean {
  return (
    trial.status === 'recruiting' &&
    trial.currentEnrollment < trial.targetEnrollment
  );
}

export function toFhirResearchStudy(trial: ClinicalTrial) {
  return {
    resourceType: 'ResearchStudy',
    id: trial.fhirResearchStudyId ?? trial.trialId,
    status:
      trial.status === 'active'
        ? 'active'
        : trial.status === 'recruiting'
          ? 'active'
          : 'completed',
    title: trial.title,
    phase: { coding: [{ code: trial.phase }] },
    enrollment: [{ reference: `Group/${trial.trialId}-cohort` }],
    sponsor: { display: trial.sponsor },
  };
}
