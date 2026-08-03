import { useApiAuth } from '@/services/auth/auth-service';
import { laboratoryHttpRepository } from '@/services/laboratory/repository.http';
import { laboratoryMockRepository } from '@/services/laboratory/repository.mock';

/** Live Nest API when auth is API-backed; mock for local demo mode. */
export const laboratoryRepository = useApiAuth
  ? laboratoryHttpRepository
  : laboratoryMockRepository;
