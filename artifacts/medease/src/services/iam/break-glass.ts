import type { BreakGlassEvent } from '@/services/iam/types';

export function isBreakGlassActive(event: BreakGlassEvent): boolean {
  return event.status === 'active';
}

export function breakGlassRequiresReview(event: BreakGlassEvent): boolean {
  return event.status === 'ended' && !event.reviewedBy;
}

export function activeBreakGlassCount(events: BreakGlassEvent[]): number {
  return events.filter(isBreakGlassActive).length;
}
