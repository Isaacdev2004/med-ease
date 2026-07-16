import { useQuery } from '@tanstack/react-query';

import { professionalQueries } from '@/features/professional/queries/professional.queries';

export function usePatients(filters?: Record<string, unknown>) {
  return useQuery(professionalQueries.patients(filters));
}
