import { useApiAuth } from '@/services/auth/auth-service';
import { medicationHttpRepository } from '@/services/medications/repository.http';
import { medicationMockRepository } from '@/services/medications/repository.mock';
import { createHybridRepository } from '@/services/repository-hybrid';

/** Live Nest API with mock fallback when API is empty or unreachable. */
export const medicationRepository = useApiAuth
  ? createHybridRepository(medicationHttpRepository, medicationMockRepository)
  : medicationMockRepository;
