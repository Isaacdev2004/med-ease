import { useApiAuth } from '@/services/auth/auth-service';
import { radiologyHttpRepository } from '@/services/radiology/repository.http';
import { radiologyMockRepository } from '@/services/radiology/repository.mock';

/** Live Nest API when auth is API-backed; mock for local demo mode. */
export const radiologyRepository = useApiAuth
  ? radiologyHttpRepository
  : radiologyMockRepository;
