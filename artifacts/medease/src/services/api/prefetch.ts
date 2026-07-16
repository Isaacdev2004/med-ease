import type { QueryClient, QueryKey } from '@tanstack/react-query';

/** Prefetch likely next screens to improve perceived performance. */
export async function prefetchQuery<T>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  staleTime?: number,
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime,
  });
}

/** Patient detail → prefetch medical record, appointments, medications. */
export async function prefetchPatientDetailBundle(
  queryClient: QueryClient,
  patientId: string,
  loaders: {
    timeline: () => Promise<unknown>;
    appointments: () => Promise<unknown>;
    medications: () => Promise<unknown>;
  },
): Promise<void> {
  const { queryKeys } = await import('@/services/api/query-keys');
  const { CACHE_TIMES } = await import('@/services/api/cache-config');

  await Promise.all([
    prefetchQuery(
      queryClient,
      queryKeys.patients.timeline(patientId),
      loaders.timeline,
      CACHE_TIMES.patientTimeline,
    ),
    prefetchQuery(
      queryClient,
      queryKeys.appointments.list({ patientId }),
      loaders.appointments,
      CACHE_TIMES.patientList,
    ),
    prefetchQuery(
      queryClient,
      queryKeys.medications.list({ patientId }),
      loaders.medications,
      CACHE_TIMES.patientList,
    ),
  ]);
}
