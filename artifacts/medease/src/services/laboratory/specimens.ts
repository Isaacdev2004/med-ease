import type {
  SpecimenRecord,
  SpecimenStatus,
} from '@/services/laboratory/types';

export function sortSpecimensByDate(
  specimens: SpecimenRecord[],
): SpecimenRecord[] {
  return [...specimens].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function isSpecimenActionable(status: SpecimenStatus): boolean {
  return ['pending', 'collected', 'in_transit', 'received'].includes(status);
}

export function specimenStatusLabel(status: SpecimenStatus): string {
  return status.replace(/_/g, ' ');
}
