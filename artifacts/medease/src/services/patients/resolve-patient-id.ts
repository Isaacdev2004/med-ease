import { useApiAuth } from '@/services/auth/auth-service';
import { patientsService } from '@/services/patients/patients.service';

/**
 * Resolve auth user → clinical patient UUID via live API when enabled.
 * Optional demoFallback keeps offline demo mode working without phr-* leakage in API mode.
 */
export async function resolveClinicalPatientId(
  userId: string,
  options?: {
    explicitId?: string;
    demoFallback?: (userId: string) => string | null;
  },
): Promise<string | null> {
  if (options?.explicitId) return options.explicitId;

  const demoId = options?.demoFallback?.(userId) ?? null;

  if (useApiAuth) {
    // Seeded demo accounts always use the clinical UUID (matches DB seed).
    if (demoId) return demoId;

    try {
      const result = await patientsService.listPatients({
        userId,
        page: 1,
        pageSize: 1,
      });
      const liveId = result.items[0]?.patientId;
      if (liveId) return liveId;
    } catch {
      // Fall through when the API is empty or unreachable.
    }
    return null;
  }

  return demoId;
}
