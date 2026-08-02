import { useApiAuth } from '@/services/auth/auth-service';
import { medicationHttpRepository } from '@/services/medications/repository.http';
import { medicationMockRepository } from '@/services/medications/repository.mock';

/** Live Nest API when auth is API-backed; mock for local demo mode. */
export const medicationRepository = useApiAuth
  ? medicationHttpRepository
  : medicationMockRepository;
