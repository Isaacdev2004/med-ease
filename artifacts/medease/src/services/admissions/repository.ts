import { useApiAuth } from '@/services/auth/auth-service';
import { admissionsHttpRepository } from '@/services/admissions/repository.http';
import { admissionsMockRepository } from '@/services/admissions/repository.mock';

export const admissionsRepository = useApiAuth
  ? admissionsHttpRepository
  : admissionsMockRepository;
