import type { PopulationMember } from '@/services/population-health/types';

export interface CohortCriteria {
  minAge?: number;
  conditions?: string[];
  minOpenGaps?: number;
  maxDaysSinceVisit?: number;
  riskTiers?: string[];
}

export function evaluateCohort(member: PopulationMember, criteria: CohortCriteria): boolean {
  if (criteria.minAge != null && member.age < criteria.minAge) return false;
  if (criteria.conditions?.length && member.primaryCondition && !criteria.conditions.includes(member.primaryCondition)) return false;
  if (criteria.minOpenGaps != null && member.openGaps < criteria.minOpenGaps) return false;
  if (criteria.riskTiers?.length && !criteria.riskTiers.includes(member.riskTier)) return false;
  if (criteria.maxDaysSinceVisit != null && member.lastVisit) {
    const days = (Date.now() - new Date(member.lastVisit).getTime()) / (1000 * 60 * 60 * 24);
    if (days <= criteria.maxDaysSinceVisit) return false;
  } else if (criteria.maxDaysSinceVisit != null && !member.lastVisit) {
    return true;
  }
  return true;
}

export function buildCohortFromCriteria(members: PopulationMember[], criteria: CohortCriteria): PopulationMember[] {
  return members.filter((m) => evaluateCohort(m, criteria));
}

export function parseCriteriaString(criteria: string): CohortCriteria {
  const result: CohortCriteria = {};
  if (criteria.includes('Age > 60')) result.minAge = 60;
  if (criteria.includes('Diabetes')) result.conditions = ['Diabetes'];
  if (criteria.includes('Missed medication') || criteria.includes('No appointment')) result.maxDaysSinceVisit = 180;
  if (criteria.includes('HbA1c')) result.minOpenGaps = 1;
  return result;
}
