import { useApiAuth } from '@/services/auth/auth-service';
import { carePlanHttpRepository } from '@/services/care-plans/repository.http';
import { carePlanMockRepository } from '@/services/care-plans/repository.mock';

export const carePlanRepository = useApiAuth
  ? carePlanHttpRepository
  : carePlanMockRepository;
