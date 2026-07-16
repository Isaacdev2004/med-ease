import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { professionalService } from '@/features/professional/services/professional.service';

export const professionalQueries = {
  patients: (filters?: Record<string, unknown>) => ({
    queryKey: queryKeys.patients.list(filters),
    queryFn: () =>
      professionalService.listPatients(
        filters?.status ? { status: String(filters.status) } : undefined,
      ),
    staleTime: CACHE_TIMES.patientList,
  }),
};
