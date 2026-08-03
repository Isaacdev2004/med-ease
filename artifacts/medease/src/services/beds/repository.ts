import { useApiAuth } from '@/services/auth/auth-service';
import { bedsHttpRepository } from '@/services/beds/repository.http';
import { bedsMockRepository } from '@/services/beds/repository.mock';

export const bedsRepository = useApiAuth
  ? bedsHttpRepository
  : bedsMockRepository;
