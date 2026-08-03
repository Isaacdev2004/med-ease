import { useApiAuth } from '@/services/auth/auth-service';
import { directoryHttpRepository } from '@/services/directory/repository.http';
import { directoryMockRepository } from '@/services/directory/repository.mock';

export const directoryRepository = useApiAuth
  ? directoryHttpRepository
  : directoryMockRepository;
