import type { CommunityProgram } from '@/services/public-health/types';

export const PROGRAM_CATEGORIES = ['Vaccination', 'Nutrition', 'Mental Health', 'Substance Use', 'Chronic Disease', 'Maternal Health', 'Senior Care', 'Health Education'];

export function programReachRate(program: CommunityProgram): number {
  if (program.targetPopulation === 0) return 0;
  return Math.round((program.enrolledCount / program.targetPopulation) * 100);
}

export function isActiveProgram(program: CommunityProgram): boolean {
  return program.status === 'active';
}
