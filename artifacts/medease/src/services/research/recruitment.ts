import type {
  ClinicalTrial,
  ResearchParticipant,
} from '@/services/research/types';

export function computeRecruitmentScore(
  trial: ClinicalTrial,
  candidates: number,
): number {
  const gap = trial.targetEnrollment - trial.currentEnrollment;
  if (gap <= 0) return 0;
  return Math.min(100, Math.round((candidates / gap) * 100));
}

export function randomizeParticipant(arms: string[]): string {
  return arms[Math.floor(Math.random() * arms.length)] ?? 'control';
}

export function isEligibleForScreening(
  participant: ResearchParticipant,
  criteriaMet: boolean,
): boolean {
  return participant.status === 'screening' && criteriaMet;
}

export const DEFAULT_RANDOMIZATION_ARMS = [
  'control',
  'intervention_a',
  'intervention_b',
];
