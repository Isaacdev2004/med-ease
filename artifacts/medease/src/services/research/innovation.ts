import type {
  InnovationProject,
  InnovationStatus,
} from '@/services/research/types';

export const INNOVATION_CATEGORIES = [
  'Digital Health',
  'AI/ML',
  'Medical Device',
  'Diagnostics',
  'Therapeutics',
  'Process Improvement',
  'Precision Medicine',
];

export function innovationReadinessScore(project: InnovationProject): number {
  const statusScores: Record<InnovationStatus, number> = {
    ideation: 20,
    pilot: 45,
    scaling: 75,
    deployed: 95,
    archived: 0,
  };
  return statusScores[project.status];
}

export function canAdvanceInnovation(project: InnovationProject): boolean {
  return project.status !== 'deployed' && project.status !== 'archived';
}
